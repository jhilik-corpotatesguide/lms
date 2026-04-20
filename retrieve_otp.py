"""
Retrieve latest OTP for phone 8389827042
"""
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
db = client['lms_db']
otp_collection = db['otp_sessions']

# Get the most recent OTP for this phone
otp_session = otp_collection.find_one(
    {'phone': '8389827042'},
    sort=[('created_at', -1)]
)

if otp_session:
    print("\n" + "="*70)
    print("✅ OTP FOUND!")
    print("="*70)
    print(f"Phone: {otp_session.get('phone')}")
    print(f"OTP: {otp_session.get('otp')}")
    print(f"Created At: {otp_session.get('created_at')}")
    print(f"Attempts: {otp_session.get('attempts')}")
    print(f"\n💡 USE THIS OTP IN THE BROWSER: {otp_session.get('otp')}")
    print("="*70 + "\n")
else:
    print("❌ No OTP found")

client.close()
