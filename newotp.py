import random
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client

# ================== TWILIO CONFIG ==================
account_sid = "AC32f1237e8789fa4b1aff55cf27038c2a"
auth_token = "ebcc5b4e54b8b2188709266ad3aed323"
twilio_number = "(256) 305-6561"  # Twilio number
client = Client(account_sid, auth_token)

# ================== FLASK ==================
app = Flask(__name__)
CORS(app)


# ================== OTP SERVICE ==================
class OTPService:
    def __init__(self):
        self.otp_store = {}

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    def send_otp(self, mobile_number):
        otp = self.generate_otp()

        self.otp_store[mobile_number] = {
            "otp": otp,
            "created_at": time.time()
        }

        try:
            message = client.messages.create(
                body=f"Your OTP is {otp}",
                from_=twilio_number,
                to="+91" + mobile_number
            )
            print("SMS sent:", message.sid)
        except Exception as e:
            print("SMS failed:", e)

    def validate_otp(self, mobile_number, user_otp):
        if mobile_number not in self.otp_store:
            return False

        otp_data = self.otp_store[mobile_number]

        # 5 minute expiry
        if time.time() - otp_data["created_at"] > 300:
            del self.otp_store[mobile_number]
            return False

        if otp_data["otp"] == str(user_otp):
            del self.otp_store[mobile_number]
            return True
        else:
            return False


otp_service = OTPService()

# ================== ROUTES ==================

@app.route("/", methods=["POST"])
def send_otp_api():
    data = request.get_json()
    phone = data.get("phone")

    otp_service.send_otp(phone)

    return jsonify({"message": "OTP_SENT"})


@app.route("/verify-otp", methods=["POST"])
def verify_otp_api():
    data = request.get_json()
    phone = data.get("phone")
    otp = data.get("otp")

    if otp_service.validate_otp(phone, otp):
        return jsonify({"message": "VERIFIED"})
    else:
        return jsonify({"message": "INVALID"})


# ================== RUN ==================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)