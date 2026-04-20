"""
Test Login Flow with OTP
Phone: 6290597268
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

print("\n" + "=" * 70)
print("LOGIN FLOW TEST - Phone: 6290597268")
print("=" * 70)

# Step 1: Send OTP
print("\n[STEP 1] Sending OTP Request")
print("-" * 70)
print(f"POST {BASE_URL}/send-otp")
print(f"Body: {{'phone': '6290597268'}}")

try:
    response = requests.post(
        f"{BASE_URL}/send-otp",
        json={"phone": "6290597268"},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 200:
        print("✅ OTP SENT SUCCESSFULLY")
        otp_sent = True
    else:
        print(f"❌ Failed to send OTP: {data.get('message')}")
        otp_sent = False
        
except Exception as e:
    print(f"❌ Error sending OTP: {e}")
    otp_sent = False

# Step 2: Verify OTP (using a sample OTP - in real scenario, it's sent via SMS)
if otp_sent:
    print("\n[STEP 2] Verifying OTP")
    print("-" * 70)
    
    # In development, you can check the database to get the actual OTP
    # For now, we'll try with a dummy OTP to show the flow
    sample_otp = "123456"
    
    print(f"POST {BASE_URL}/verify-otp")
    print(f"Body: {{'phone': '6290597268', 'otp': '{sample_otp}'}}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/verify-otp",
            json={"phone": "6290597268", "otp": sample_otp},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print("✅ OTP VERIFIED SUCCESSFULLY")
            print(f"   User ID: {data.get('user_id', 'N/A')}")
            print(f"   Is New User: {data.get('is_new', False)}")
        else:
            print(f"❌ OTP Verification Failed: {data.get('message')}")
            
    except Exception as e:
        print(f"❌ Error verifying OTP: {e}")

# Step 3: Check if user with this phone exists in database
print("\n[STEP 3] Checking User in Database")
print("-" * 70)

from pymongo import MongoClient

try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    
    db = client['lms_db']
    users_collection = db['users']
    
    # Search for user with this phone
    user = users_collection.find_one({'phone': '6290597268'})
    
    if user:
        print("✅ User found in database:")
        print(f"   Full Name: {user.get('full_name', 'N/A')}")
        print(f"   Phone: {user.get('phone')}")
        print(f"   Email: {user.get('email', 'N/A')}")
        print(f"   Role: {user.get('role')}")
        print(f"   Verified: {user.get('is_verified')}")
    else:
        print("❌ User NOT found in database")
        print("   This is a new phone number - user would need to register first")
        
    client.close()
    
except Exception as e:
    print(f"❌ Database Error: {e}")

print("\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70 + "\n")
