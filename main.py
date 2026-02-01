from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)  # allows React frontend 

class OTPService:
    def __init__(self):
        self.otp_store = {}

    def generate_otp(self):
        return random.randint(100000, 999999)

    def send_otp(self, mobile_number):
        otp = self.generate_otp()
        self.otp_store[mobile_number] = {
            "otp": otp,
            "created_at": time.time()
        }
        print(f"OTP sent to {mobile_number}: {otp}")  # replace with SMS API
        return otp

    def validate_otp(self, mobile_number, user_otp):
        if mobile_number not in self.otp_store:
            return False, "OTP not requested"

        otp_data = self.otp_store[mobile_number]

        if time.time() - otp_data["created_at"] > 300:
            del self.otp_store[mobile_number]
            return False, "OTP expired"

        if otp_data["otp"] == user_otp:
            del self.otp_store[mobile_number]
            return True, "OTP verified successfully"
        else:
            return False, "Invalid OTP"


otp_service = OTPService()

# -------------------- API ROUTES --------------------

@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    mobile = data.get("mobile")

    if not mobile:
        return jsonify({"status": "error", "message": "Mobile number required"}), 400

    otp_service.send_otp(mobile)
    return jsonify({"status": "success", "message": "OTP sent successfully"})


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    mobile = data.get("mobile")
    otp = data.get("otp")

    if not mobile or not otp:
        return jsonify({"status": "error", "message": "Mobile and OTP required"}), 400

    status, message = otp_service.validate_otp(mobile, int(otp))

    if status:
        return jsonify({"status": "success", "message": message})
    else:
        return jsonify({"status": "error", "message": message}), 400


# -------------------- RUN SERVER --------------------

if __name__ == "__main__":
    app.run(debug=True)
