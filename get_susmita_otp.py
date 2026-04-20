"""
Retrieve OTP for susmita (8159831034)
"""
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
db = client['lms_db']
otp_collection = db['otp_sessions']

otp_session = otp_collection.find_one(
    {'phone': '8159831034'},
    sort=[('created_at', -1)]
)

if otp_session:
    otp = otp_session.get('otp')
    print("\n" + "="*70)
    print("✅ OTP GENERATED FOR SUSMITA")
    print("="*70)
    print(f"Phone: 8159831034")
    print(f"OTP: {otp}")
    print(f"Valid for: 5 minutes")
    print("="*70)
    print(f"\n👉 ENTER THIS OTP IN THE BROWSER: {otp}\n")
else:
    print("❌ OTP not found")

client.close()
