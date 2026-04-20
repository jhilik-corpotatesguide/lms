"""
Check if OTP was generated for phone number 8389827042
"""

from pymongo import MongoClient
from datetime import datetime

print("Checking MongoDB for OTP...")
print("-" * 70)

try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    db = client['lms_db']
    
    # Check otp_sessions collection
    otp_collection = db['otp_sessions']
    
    # Find the latest OTP for the phone number
    otp_session = otp_collection.find_one(
        {'phone': '8389827042'},
        sort=[('created_at', -1)]
    )
    
    if otp_session:
        print(f"✅ OTP FOUND in Database!")
        print(f"   Phone: {otp_session.get('phone')}")
        print(f"   OTP: {otp_session.get('otp')}")
        print(f"   Created At: {otp_session.get('created_at')}")
        print(f"   Attempts: {otp_session.get('attempts')}")
        print(f"   Status: Successfully stored in MongoDB")
        print("\n💡 The OTP was generated but may not have been sent via SMS.")
        print("   Possible issues:")
        print("   1. Twilio credentials might be invalid or expired")
        print("   2. Twilio phone number might not be configured")
        print("   3. SMS sending might be failing silently in the backend")
    else:
        print(f"❌ OTP NOT FOUND in Database for phone: 8389827042")
        print("   The OTP generation itself may have failed.")
        print("\n⚠️  Backend may have encountered an error.")
    
    client.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
