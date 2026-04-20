"""
Verify that the registration data was inserted into MongoDB
"""

from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Connected to MongoDB\n")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit(1)

# Access database and collection
db = client['lms_db']
users_collection = db['users']

print("=" * 70)
print("MONGODB USER RECORDS VERIFICATION")
print("=" * 70)

# Query all users
all_users = list(users_collection.find())

if not all_users:
    print("\n❌ No users found in the database.")
else:
    print(f"\n✅ Found {len(all_users)} user(s) in the database:\n")
    
    for i, user in enumerate(all_users, 1):
        print(f"User {i}:")
        print(f"  ID:              {user.get('_id')}")
        print(f"  Full Name:       {user.get('full_name')}")
        print(f"  Phone:           {user.get('phone')}")
        print(f"  Email:           {user.get('email')}")
        print(f"  Role:            {user.get('role')}")
        print(f"  Verified:        {user.get('is_verified')}")
        print(f"  Created At:      {user.get('created_at')}")
        print(f"  Updated At:      {user.get('updated_at')}")
        print()

# Query specifically for Raj Kumar
print("=" * 70)
print("SEARCH FOR: Raj Kumar (raj.kumar@example.com)")
print("=" * 70)

raj_user = users_collection.find_one({'full_name': 'Raj Kumar'})

if raj_user:
    print("\n✅ User 'Raj Kumar' found in MongoDB!")
    print(f"\nDetails:")
    print(f"  ID:              {raj_user.get('_id')}")
    print(f"  Full Name:       {raj_user.get('full_name')}")
    print(f"  Phone:           {raj_user.get('phone')}")
    print(f"  Email:           {raj_user.get('email')}")
    print(f"  Role:            {raj_user.get('role')}")
    print(f"  Verified:        {raj_user.get('is_verified')}")
    print(f"  Created At:      {raj_user.get('created_at')}")
    print(f"  Updated At:      {raj_user.get('updated_at')}")
else:
    print("\n❌ User 'Raj Kumar' not found in MongoDB.")

# Query by phone number
print("\n" + "=" * 70)
print("SEARCH FOR: Phone 9876543210")
print("=" * 70)

phone_user = users_collection.find_one({'phone': '9876543210'})

if phone_user:
    print("\n✅ User with phone '9876543210' found in MongoDB!")
    print(f"\nDetails:")
    print(f"  Full Name:       {phone_user.get('full_name')}")
    print(f"  Email:           {phone_user.get('email')}")
    print(f"  Phone:           {phone_user.get('phone')}")
else:
    print("\n❌ No user with phone '9876543210' found.")

print("\n" + "=" * 70)
print("VERIFICATION COMPLETE")
print("=" * 70)

# Close connection
client.close()
