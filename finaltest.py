from twilio.rest import Client

# Twilio credentials
account_sid = "AC32f1237e8789fa4b1aff55cf27038c2a"
auth_token = "ebcc5b4e54b8b2188709266ad3aed323"
verify_sid = "VA5cdb616a99eaa4078e71d78ce7dd3c68"

client = Client(account_sid, auth_token)

# -------------------------------
# STEP 1: SEND OTP
# -------------------------------
verification = client.verify.v2.services(verify_sid).verifications.create(
    to="+918159831034",     # user number with country code
    channel="sms"
)

print("OTP sent successfully")

# -------------------------------
# STEP 2: VERIFY OTP
# -------------------------------
otp_input = input("Enter OTP: ")

verification_check = client.verify.v2.services(verify_sid).verification_checks.create(
    to="+918159831034",
    code=otp_input
)

if verification_check.status == "approved":
    print("OTP verified successfully ✅")
else:
    print("Invalid OTP ❌")
