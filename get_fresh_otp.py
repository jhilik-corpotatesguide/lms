"""
Send fresh OTP and retrieve it
"""

import requests
from pymongo import MongoClient
import time

BASE_URL = "http://127.0.0.1:5000"

print("\n[STEP 1] Sending Fresh OTP")
print("-" * 70)

response = requests.post(
    f"{BASE_URL}/send-otp",
    json={"phone": "6290597268"},
    headers={"Content-Type": "application/json"}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Wait a moment
time.sleep(0.5)

# Retrieve the OTP
print("\n[STEP 2] Retrieving OTP from Database")
print("-" * 70)

client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
db = client['lms_db']
otp_collection = db['otp_sessions']

otp_session = otp_collection.find_one({'phone': '6290597268'})

if otp_session:
    print(f"✅ OTP Found: {otp_session.get('otp')}")
    print(f"   Attempts: {otp_session.get('attempts')}")
    print(f"\n💡 Use this OTP in the browser: {otp_session.get('otp')}")
else:
    print("❌ OTP not found")

client.close()
