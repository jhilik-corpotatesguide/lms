import random
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
from dotenv import load_dotenv

# ── Load .env file ──
load_dotenv()

from database import (
    users_collection,
    otp_collection,
    new_user,
    new_otp_session,
)

# ================== TWILIO CONFIG ==================
account_sid   = os.getenv("TWILIO_ACCOUNT_SID", "AC32f1237e8789fa4b1aff55cf27038c2a")
auth_token    = os.getenv("TWILIO_AUTH_TOKEN",  "ebcc5b4e54b8b2188709266ad3aed323")
twilio_number = os.getenv("TWILIO_NUMBER",      "(256) 305-6561")
client = Client(account_sid, auth_token)

# ================== EMAIL CONFIG (from .env) ==================
SENDER_EMAIL    = os.getenv("SENDER_EMAIL")       # তোমার Gmail
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")    # Gmail App Password
SMTP_SERVER     = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT       = int(os.getenv("SMTP_PORT", "587"))


class EmailOTP:
    """Email-based OTP service for LMS"""

    def __init__(self):
        # { email: { 'otp': str, 'expires': datetime } }
        self.otps = {}

    def generate_otp(self, length=6):
        return ''.join(random.choices(string.digits, k=length))

    def send_otp(self, email, subject="Your LMS Verification Code"):
        otp = self.generate_otp()
        self.otps[email] = {
            'otp'    : otp,
            'expires': datetime.now() + timedelta(minutes=5),
        }

        # ── Build HTML email ──
        html_body = f"""
        <html>
        <body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0"
                 style="padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                       style="background:#ffffff;border-radius:12px;
                              box-shadow:0 4px 20px rgba(0,0,0,0.08);
                              overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#2563eb;padding:28px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:22px;
                                 letter-spacing:1px;">🎓 LMS Portal</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 40px;">
                      <p style="margin:0 0 8px;color:#374151;font-size:16px;
                                font-weight:600;">Hello!</p>
                      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;
                                line-height:1.6;">
                        We received a login request for your LMS account.
                        Use the OTP below to verify your identity.
                        This code is valid for <strong>5 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#f0f4ff;border:2px dashed #2563eb;
                                  border-radius:10px;padding:20px;
                                  text-align:center;margin-bottom:24px;">
                        <p style="margin:0 0 4px;color:#6b7280;font-size:12px;
                                  text-transform:uppercase;letter-spacing:1px;">
                          Your OTP
                        </p>
                        <p style="margin:0;font-size:36px;font-weight:700;
                                  color:#2563eb;letter-spacing:10px;">
                          {otp}
                        </p>
                      </div>

                      <p style="margin:0;color:#9ca3af;font-size:12px;
                                line-height:1.6;">
                        If you did not request this, please ignore this email.
                        Do not share this OTP with anyone.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:16px 40px;
                               text-align:center;">
                      <p style="margin:0;color:#d1d5db;font-size:11px;">
                        © 2025 LMS Portal · All rights reserved
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["From"]    = f"LMS Portal <{SENDER_EMAIL}>"
        msg["To"]      = email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html"))

        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.ehlo()
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, msg.as_string())
            server.quit()
            print(f"[EMAIL] OTP sent to {email}")
            return True
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")
            return False

    def verify_otp(self, email, code):
        if email not in self.otps:
            return False, "No OTP found for this email"

        record = self.otps[email]

        if datetime.now() > record["expires"]:
            del self.otps[email]
            return False, "OTP expired"

        if record["otp"] == code:
            del self.otps[email]
            return True, "OTP verified successfully"

        return False, "Invalid OTP"


# ── Init ──
email_otp_service = EmailOTP()

app = Flask(__name__)
CORS(app, origins="*")

MAX_OTP_ATTEMPTS = 3


# ─────────────────────────────────────────
#  HELPER
# ─────────────────────────────────────────
def serialize(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ─────────────────────────────────────────
#  PHONE OTP ROUTES
# ─────────────────────────────────────────

@app.route("/send-otp", methods=["POST"])
def send_otp_api():
    # print(request)
    data  = request.get_json()
    phone = data.get("phone", "").strip()

    if not phone or len(phone) != 10 or not phone.isdigit():
        return jsonify({"message": "INVALID_PHONE"}), 400

    otp = str(random.randint(100000, 999999))

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
        print(f"[DEV] OTP for {phone}: {otp}")

    return jsonify({"message": "OTP_SENT"})


@app.route("/verify-otp", methods=["POST"])
def verify_otp_api():
    data  = request.get_json()
    phone = data.get("phone", "").strip()
    otp   = str(data.get("otp", "")).strip()

    session = otp_collection.find_one({"phone": phone})

    if not session:
        return jsonify({"message": "OTP_EXPIRED_OR_NOT_SENT"}), 400

    if session.get("attempts", 0) >= MAX_OTP_ATTEMPTS:
        otp_collection.delete_one({"phone": phone})
        return jsonify({"message": "TOO_MANY_ATTEMPTS"}), 429

    if session["otp"] != otp:
        otp_collection.update_one({"phone": phone}, {"$inc": {"attempts": 1}})
        return jsonify({"message": "INVALID_OTP"}), 400

    otp_collection.delete_one({"phone": phone})
    users_collection.update_one(
        {"phone": phone},
        {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}},
    )

    user = users_collection.find_one({"phone": phone})
    if user:
        return jsonify({"message": "VERIFIED", "user_id": str(user["_id"]), "is_new": False})
    else:
        return jsonify({"message": "VERIFIED", "is_new": True})


# ─────────────────────────────────────────
#  EMAIL OTP ROUTES
# ─────────────────────────────────────────

@app.route("/send-email-otp", methods=["POST"])
def send_email_otp_api():
    print(request)
    data  = request.get_json()
    email = data.get("email", "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"message": "INVALID_EMAIL"}), 400

    # Check করো SENDER_EMAIL configure আছে কিনা
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return jsonify({"message": "EMAIL_NOT_CONFIGURED"}), 500

    success = email_otp_service.send_otp(email)

    if success:
        return jsonify({"message": "EMAIL_OTP_SENT"})
    else:
        return jsonify({"message": "FAILED_TO_SEND_EMAIL"}), 500


@app.route("/verify-email-otp", methods=["POST"])
def verify_email_otp_api():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()
    otp   = str(data.get("otp", "")).strip()

    is_valid, message = email_otp_service.verify_otp(email, otp)

    if is_valid:
        user = users_collection.find_one({"email": email})
        if user:
            return jsonify({"message": "VERIFIED", "user_id": str(user["_id"]),"user_name": user.get("full_name", ""), "is_new": False})
        else:
            return jsonify({"message": "VERIFIED", "is_new": True})
    else:
        return jsonify({"message": message}), 400


# ─────────────────────────────────────────
#  REGISTRATION ROUTE
# ─────────────────────────────────────────

@app.route("/register", methods=["POST"])
def register():
    data      = request.get_json()
    full_name = data.get("full_name", "").strip()
    phone     = data.get("phone", "").strip()
    email     = data.get("email", "").strip() or None
    password  = data.get("password", "")
    role      = data.get("role", "student")

    if not full_name:
        return jsonify({"message": "FULL_NAME_REQUIRED"}), 400
    if not phone or len(phone) != 10 or not phone.isdigit():
        return jsonify({"message": "INVALID_PHONE"}), 400
    if role not in ("student", "instructor", "admin"):
        return jsonify({"message": "INVALID_ROLE"}), 400

    password_hash = None
    if password:
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    user_doc = new_user(
        full_name=full_name, phone=phone, email=email,
        password_hash=password_hash, role=role,
    )
    user_doc["is_verified"] = True

    try:
        result  = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        return jsonify({"message": "REGISTERED", "user_id": user_id}), 201
    except DuplicateKeyError as e:
        err = str(e)
        if "phone" in err:
            return jsonify({"message": "PHONE_ALREADY_EXISTS"}), 409
        if "email" in err:
            return jsonify({"message": "EMAIL_ALREADY_EXISTS"}), 409
        return jsonify({"message": "DUPLICATE_ENTRY"}), 409


# ─────────────────────────────────────────
#  USER PROFILE ROUTE
# ─────────────────────────────────────────

@app.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"password_hash": 0},
        )
        if not user:
            return jsonify({"message": "USER_NOT_FOUND"}), 404
        return jsonify(serialize(user))
    except Exception:
        return jsonify({"message": "INVALID_ID"}), 400


# ─────────────────────────────────────────
#  LEGACY ROUTE
# ─────────────────────────────────────────

@app.route("/", methods=["POST"])
def send_otp_legacy():
    data  = request.get_json()
    phone = data.get("phone")
    with app.test_request_context("/send-otp", method="POST", json={"phone": phone}):
        return send_otp_api()


# ─────────────────────────────────────────
#  RUN
# ─────────────────────────────────────────

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)