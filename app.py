import random
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime
import bcrypt

from database import (
    users_collection,
    otp_collection,
    new_user,
    new_otp_session,
)

# ================== TWILIO CONFIG ==================
account_sid  = "AC32f1237e8789fa4b1aff55cf27038c2a"
auth_token   = "ebcc5b4e54b8b2188709266ad3aed323"
twilio_number = "(256) 305-6561"
client = Client(account_sid, auth_token)

# ================== FLASK ==================
app = Flask(__name__)
CORS(app)

MAX_OTP_ATTEMPTS = 3   # lock out after 3 wrong tries


# ─────────────────────────────────────────
#  HELPER
# ─────────────────────────────────────────
def serialize(doc):
    """Convert MongoDB ObjectId → string so jsonify works."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ─────────────────────────────────────────
#  OTP ROUTES
# ─────────────────────────────────────────

@app.route("/send-otp", methods=["POST"])
def send_otp_api():
    """
    Body: { "phone": "9876543210" }
    Saves OTP in MongoDB (TTL 5 min) and sends SMS.
    """
    data  = request.get_json()
    phone = data.get("phone", "").strip()

    if not phone or len(phone) != 10 or not phone.isdigit():
        return jsonify({"message": "INVALID_PHONE"}), 400

    otp = str(random.randint(100000, 999999))

    # Upsert — replace any existing OTP for this phone
    otp_collection.replace_one(
        {"phone": phone},
        new_otp_session(phone, otp),
        upsert=True,
    )

    try:
        message = client.messages.create(
            body=f"Your LMS OTP is {otp}. Valid for 5 minutes.",
            from_=twilio_number,
            to="+91" + phone,
        )
        print("SMS sent:", message.sid)
    except Exception as e:
        print("SMS failed:", e)
        # Still return success so dev can test without Twilio credits
        # Remove this in production ↓
        print(f"[DEV] OTP for {phone}: {otp}")

    return jsonify({"message": "OTP_SENT"})


@app.route("/verify-otp", methods=["POST"])
def verify_otp_api():
    """
    Body: { "phone": "9876543210", "otp": "123456" }
    Validates OTP and marks user as verified if they exist.
    """
    data  = request.get_json()
    phone = data.get("phone", "").strip()
    otp   = str(data.get("otp", "")).strip()

    session = otp_collection.find_one({"phone": phone})

    if not session:
        return jsonify({"message": "OTP_EXPIRED_OR_NOT_SENT"}), 400

    # Too many attempts
    if session.get("attempts", 0) >= MAX_OTP_ATTEMPTS:
        otp_collection.delete_one({"phone": phone})
        return jsonify({"message": "TOO_MANY_ATTEMPTS"}), 429

    if session["otp"] != otp:
        otp_collection.update_one({"phone": phone}, {"$inc": {"attempts": 1}})
        return jsonify({"message": "INVALID_OTP"}), 400

    # ✅ Correct OTP — delete session
    otp_collection.delete_one({"phone": phone})

    # Mark user verified if they already registered
    users_collection.update_one(
        {"phone": phone},
        {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}},
    )

    # Check if user already exists to decide next step
    user = users_collection.find_one({"phone": phone})

    if user:
        return jsonify({
            "message" : "VERIFIED",
            "user_id" : str(user["_id"]),
            "is_new"  : False,
        })
    else:
        return jsonify({
            "message": "VERIFIED",
            "is_new" : True,   # frontend should redirect to full registration form
        })


# ─────────────────────────────────────────
#  REGISTRATION ROUTE
# ─────────────────────────────────────────

@app.route("/register", methods=["POST"])
def register():
    """
    Body:
    {
        "full_name" : "Rahul Sharma",
        "phone"     : "9876543210",   ← must be OTP-verified first
        "email"     : "rahul@email.com",   (optional)
        "password"  : "secret123",         (optional)
        "role"      : "student"            (optional, default "student")
    }
    """
    data      = request.get_json()
    full_name = data.get("full_name", "").strip()
    phone     = data.get("phone", "").strip()
    email     = data.get("email", "").strip() or None
    password  = data.get("password", "")
    role      = data.get("role", "student")

    # ── Validation ──
    if not full_name:
        return jsonify({"message": "FULL_NAME_REQUIRED"}), 400
    if not phone or len(phone) != 10 or not phone.isdigit():
        return jsonify({"message": "INVALID_PHONE"}), 400
    if role not in ("student", "instructor", "admin"):
        return jsonify({"message": "INVALID_ROLE"}), 400

    # ── Hash password if provided ──
    password_hash = None
    if password:
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    user_doc = new_user(
        full_name     = full_name,
        phone         = phone,
        email         = email,
        password_hash = password_hash,
        role          = role,
    )

    # Phone already OTP-verified? mark as verified directly
    # (in a stricter flow, check otp_collection for a "verified" flag)
    user_doc["is_verified"] = True

    try:
        result  = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        return jsonify({
            "message": "REGISTERED",
            "user_id": user_id,
        }), 201

    except DuplicateKeyError as e:
        # Figure out which field is duplicate
        err = str(e)
        if "phone" in err:
            return jsonify({"message": "PHONE_ALREADY_EXISTS"}), 409
        if "email" in err:
            return jsonify({"message": "EMAIL_ALREADY_EXISTS"}), 409
        return jsonify({"message": "DUPLICATE_ENTRY"}), 409


# ─────────────────────────────────────────
#  USER PROFILE ROUTE (bonus)
# ─────────────────────────────────────────

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"password_hash": 0},    # never return password
        )
        if not user:
            return jsonify({"message": "USER_NOT_FOUND"}), 404
        return jsonify(serialize(user))
    except Exception:
        return jsonify({"message": "INVALID_ID"}), 400


# ─────────────────────────────────────────
#  LEGACY ROUTE (keep old "/" working)
# ─────────────────────────────────────────
@app.route("/", methods=["POST"])
def send_otp_legacy():
    data  = request.get_json()
    phone = data.get("phone")
    # delegate to new logic
    with app.test_request_context(
        "/send-otp", method="POST", json={"phone": phone}
    ):
        return send_otp_api()


# ─────────────────────────────────────────
#  RUN
# ─────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)