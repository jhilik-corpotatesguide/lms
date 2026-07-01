from pydantic import BaseModel, EmailStr
from typing import Optional, List


class SendOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    dob: str  # "YYYY-MM-DD"
    organization: str  # college or company name
    organization_type: str  # "college" | "company"
    phone: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    organization: Optional[str] = None
    organization_type: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None  # base64 or URL


class EnrollRequest(BaseModel):
    course_slug: str


class UserOut(BaseModel):
    email: str
    name: Optional[str] = None
    dob: Optional[str] = None
    organization: Optional[str] = None
    organization_type: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    enrolled_courses: List[str] = []
    is_registered: bool = False


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_new_user: bool
    user: UserOut
