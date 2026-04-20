"""
Request fresh OTP for 8389827042
"""
import requests

BASE_URL = "http://127.0.0.1:5000"

print("\n" + "="*70)
print("📱 REQUESTING FRESH OTP")
print("="*70)

response = requests.post(
    f"{BASE_URL}/send-otp",
    json={"phone": "8389827042"},
    headers={"Content-Type": "application/json"}
)

print(f"\n✅ Status: {response.status_code}")
print(f"✅ Response: {response.json()}")
print("\n💡 CHECK THE BACKEND TERMINAL FOR OTP!")
print("="*70 + "\n")
