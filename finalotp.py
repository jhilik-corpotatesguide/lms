import smtplib
import random
import string
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class EmailOTP:
    def __init__(self):
        self.otps = {}

    # Generate OTP
    def generate_otp(self, length=6):
        return ''.join(random.choices(string.digits, k=length))

    # Send OTP Email
    def send_otp(self, email):
        otp = self.generate_otp()

        # Store OTP with expiry
        self.otps[email] = {
            "otp": otp,
            "expires": datetime.now() + timedelta(minutes=5)
        }

        # 🔴 IMPORTANT: Put your real Gmail here
        sender_email = "jhilikb2003@gmail.com"
        sender_password = "iryd wwwp sgbz jocr"   # Gmail App Password

        smtp_server = "smtp.gmail.com"
        smtp_port = 587

        # Email content
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = email
        msg["Subject"] = "LMS Verification Code"

        body = f"""
        <h2>LMS OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>{otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        """

        msg.attach(MIMEText(body, "html"))

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
            server.quit()

            print("✅ OTP sent successfully")
            return True

        except Exception as e:
            print("❌ Error:", e)
            return False

    # Verify OTP
    def verify_otp(self, email, user_otp):
        if email not in self.otps:
            return False, "No OTP found"

        data = self.otps[email]

        # Expiry check
        if datetime.now() > data["expires"]:
            del self.otps[email]
            return False, "OTP expired"

        # Match check
        if data["otp"] == user_otp:
            del self.otps[email]
            return True, "OTP verified successfully"

        return False, "Invalid OTP"


# --------------------------
# TEST RUN
# --------------------------
otp_service = EmailOTP()

email = input("Enter your email: ")

# Send OTP
if otp_service.send_otp(email):
    user_otp = input("Enter OTP: ")

    result, msg = otp_service.verify_otp(email, user_otp)
    print(msg)
else:
    print("Failed to send OTP")