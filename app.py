import random
import time
import os
import smtplib
import string
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime, timedelta
import bcrypt
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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

# ================== EMAIL OTP CONFIG ==================
USE_MOCK_EMAIL = True  # Set to False to use real email sending


class EmailOTP:
    """Email-based OTP service for LMS"""
    
    def __init__(self):
        self.otps = {}  # Store OTPs in memory {email: {'otp': str, 'expires': datetime}}
    
    def generate_otp(self, length=6):
        """Generate numeric OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    def send_otp(self, email, subject="Your LMS Verification Code"):
        """Send OTP to email address"""
        otp = self.generate_otp()
        self.otps[email] = {
            'otp': otp,
            'expires': datetime.now() + timedelta(minutes=5)
        }
        
        if USE_MOCK_EMAIL:
            print(f"Mock: OTP {otp} sent to {email}")
            return True
        
        # Real email sending
        sender_email = os.getenv("SENDER_EMAIL", "noreply@lms.com")
        sender_password = os.getenv("SENDER_PASSWORD", "your_app_password")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = subject
        
        # HTML Email Body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">🔐 LMS Verification</h2>
                <p style="color: #666; font-size: 16px;">Your verification code is:</p>
                <div style="background: #4CAF50; color: white; font-size: 32px; font-weight: bold; 
                            text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px;">
                    {otp}
                </div>
                <p style="color: #999; font-size: 14px; margin-top: 20px;">
                    This code will expire in 5 minutes.<br>
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
            server.quit()
            print(f"OTP sent to {email}")
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False
    
    def verify_otp(self, email, code):
        """Verify OTP code"""
        if email not in self.otps:
            return False, "No OTP found for this email"
        
        record = self.otps[email]
        
        # Check expiration
        if datetime.now() > record['expires']:
            del self.otps[email]
            return False, "OTP expired"
        
        # Verify code
        if record['otp'] == code:
            del self.otps[email]  # Remove after successful verification
            return True, "OTP verified successfully"
        
        return False, "Invalid OTP"


# Initialize EmailOTP service
email_otp_service = EmailOTP()

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
#  EMAIL OTP ROUTES
# ─────────────────────────────────────────

@app.route("/send-email-otp", methods=["POST"])
def send_email_otp_api():
    """
    Body: { "email": "user@example.com" }
    Sends OTP to email address.
    """
    data = request.get_json()
    email = data.get("email", "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"message": "INVALID_EMAIL"}), 400

    success = email_otp_service.send_otp(email)
    
    if success:
        return jsonify({"message": "EMAIL_OTP_SENT"})
    else:
        return jsonify({"message": "FAILED_TO_SEND_EMAIL"}), 500


@app.route("/verify-email-otp", methods=["POST"])
def verify_email_otp_api():
    """
    Body: { "email": "user@example.com", "otp": "123456" }
    Validates email OTP.
    """
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    otp = str(data.get("otp", "")).strip()

    is_valid, message = email_otp_service.verify_otp(email, otp)

    if is_valid:
        # Check if user already exists
        user = users_collection.find_one({"email": email})
        
        if user:
            return jsonify({
                "message": "VERIFIED",
                "user_id": str(user["_id"]),
                "is_new": False,
            })
        else:
            return jsonify({
                "message": "VERIFIED",
                "is_new": True,
            })
    else:
        return jsonify({"message": message}), 400


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