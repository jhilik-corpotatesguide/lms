import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_NAME


def send_otp_email(to_email: str, otp: str):
    """Send a one-time-password to the user's email using SMTP."""
    subject = "Your LMS Login OTP"
    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#5b21b6;">Corporates Guide LMS</h2>
      <p>Your One-Time Password (OTP) for login is:</p>
      <h1 style="letter-spacing:6px; color:#4f46e5;">{otp}</h1>
      <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(body, "html"))

    if not SMTP_USER or not SMTP_PASSWORD:
        # Dev fallback: print OTP to console instead of failing, so you can
        # test the flow before SMTP credentials are configured.
        print(f"[DEV MODE] OTP for {to_email}: {otp}")
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
