from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException

from app.database import users_collection, otps_collection
from app.schemas import (
    SendOtpRequest,
    VerifyOtpRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)
from app.auth import generate_otp, create_access_token
from app.utils.email_utils import send_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])

OTP_VALID_MINUTES = 5


@router.post("/send-otp")
async def send_otp(payload: SendOtpRequest):
    """Generate a 6-digit OTP, store it (5 min expiry) and email it."""
    otp = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_VALID_MINUTES)

    await otps_collection.delete_many({"email": payload.email})
    await otps_collection.insert_one(
        {"email": payload.email, "otp": otp, "expires_at": expires_at}
    )

    send_otp_email(payload.email, otp)
    return {"message": "OTP sent to your email", "expires_in_minutes": OTP_VALID_MINUTES}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(payload: VerifyOtpRequest):
    """Verify OTP. If the user already exists -> log them in.
    If not -> tell frontend a new-user registration form is needed."""
    record = await otps_collection.find_one({"email": payload.email})
    if not record:
        raise HTTPException(status_code=400, detail="OTP expired or not found. Please request a new one.")

    if record["otp"] != payload.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP correct -> remove it so it can't be reused
    await otps_collection.delete_many({"email": payload.email})

    user = await users_collection.find_one({"email": payload.email})
    is_new_user = user is None

    if is_new_user:
        # Create a bare-bones user record; full profile fields are filled
        # in during the /auth/register step.
        user = {
            "email": payload.email,
            "name": None,
            "dob": None,
            "organization": None,
            "organization_type": None,
            "phone": None,
            "profile_picture": None,
            "enrolled_courses": [],
            "is_registered": False,
        }
        await users_collection.insert_one(user)

    token = create_access_token(payload.email)
    user_out = UserOut(**{k: v for k, v in user.items() if k != "_id"})
    return TokenResponse(access_token=token, is_new_user=is_new_user, user=user_out)


@router.post("/register", response_model=TokenResponse)
async def register(payload: RegisterRequest):
    """Complete registration for a new user (called after OTP verify)."""
    existing = await users_collection.find_one({"email": payload.email})
    if existing and existing.get("is_registered"):
        raise HTTPException(status_code=400, detail="This email is already registered. Please log in instead.")

    update_data = {
        "name": payload.name,
        "dob": payload.dob,
        "organization": payload.organization,
        "organization_type": payload.organization_type,
        "phone": payload.phone,
        "is_registered": True,
    }

    await users_collection.update_one(
        {"email": payload.email}, {"$set": update_data}, upsert=True
    )

    user = await users_collection.find_one({"email": payload.email})
    token = create_access_token(payload.email)
    user_out = UserOut(**{k: v for k, v in user.items() if k != "_id"})
    return TokenResponse(access_token=token, is_new_user=False, user=user_out)
