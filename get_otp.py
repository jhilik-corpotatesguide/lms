"""
Retrieve the OTP that was sent for phone 6290597268
"""

from pymongo import MongoClient

try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    
    db = client['lms_db']
    otp_collection = db['otp_sessions']
    
    print("\n" + "=" * 70)
    print("OTP RETRIEVAL - Phone: 6290597268")
    print("=" * 70)
    
    # Find the OTP session for this phone
    otp_session = otp_collection.find_one({'phone': '6290597268'})
    
    if otp_session:
        print("\n✅ OTP Session found:")
        print(f"   Phone: {otp_session.get('phone')}")
        print(f"   OTP: {otp_session.get('otp')}")
        print(f"   Created At: {otp_session.get('created_at')}")
        print(f"   Attempts: {otp_session.get('attempts')}")
        print("\n💡 Use this OTP to verify the login:")
        print(f"   OTP: {otp_session.get('otp')}")
    else:
        print("\n❌ No OTP session found for this phone")
    
    print("\n" + "=" * 70)
    
    client.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
