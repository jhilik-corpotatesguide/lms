import os
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "insecure_dev_secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SENDER_EMAIL")
SMTP_PASSWORD = os.getenv("SENDER_PASSWORD")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "LMS")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
