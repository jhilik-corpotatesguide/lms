import os
import smtplib
import random
import string
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# For testing without real email sending
USE_MOCK = True  # Set to False to use real email


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
        
        if USE_MOCK:
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


# Initialize OTP service
otp_service = EmailOTP()


# -------------------------------
# STEP 1: SEND OTP
# -------------------------------
test_email = "student@example.com"

print("=" * 40)
print("   LMS - Email OTP Verification")
print("=" * 40)

success = otp_service.send_otp(test_email)
if success:
    print(f"✅ OTP sent to {test_email}")
else:
    print("❌ Failed to send OTP")

# -------------------------------
# STEP 2: VERIFY OTP
# -------------------------------
print("\n" + "-" * 40)
otp_input = input("Enter OTP: ")

is_valid, message = otp_service.verify_otp(test_email, otp_input)

if is_valid:
    print(f"✅ {message}")
else:
    print(f"❌ {message}")
