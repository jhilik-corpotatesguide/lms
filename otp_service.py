import random
import time

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
        print(f"OTP sent to {mobile_number}: {otp}")

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

mobile = input("Enter mobile number: ")
otp_service.send_otp(mobile)

user_otp = int(input("Enter OTP: "))
status, message = otp_service.validate_otp(mobile, user_otp)

print(message)