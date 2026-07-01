from fastapi import APIRouter, Depends, HTTPException

from app.database import users_collection, courses_collection
from app.schemas import UpdateProfileRequest, EnrollRequest, UserOut
from app.auth import get_current_user

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(**{k: v for k, v in current_user.items() if k != "_id"})


@router.put("/me", response_model=UserOut)
async def update_me(payload: UpdateProfileRequest, current_user: dict = Depends(get_current_user)):
    """Update profile. Email can never be changed here on purpose."""
    update_data = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    if update_data:
        await users_collection.update_one(
            {"email": current_user["email"]}, {"$set": update_data}
        )
    user = await users_collection.find_one({"email": current_user["email"]})
    return UserOut(**{k: v for k, v in user.items() if k != "_id"})


@router.post("/enroll", response_model=UserOut)
async def enroll_course(payload: EnrollRequest, current_user: dict = Depends(get_current_user)):
    course = await courses_collection.find_one({"slug": payload.course_slug})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    await users_collection.update_one(
        {"email": current_user["email"]},
        {"$addToSet": {"enrolled_courses": payload.course_slug}},
    )
    user = await users_collection.find_one({"email": current_user["email"]})
    return UserOut(**{k: v for k, v in user.items() if k != "_id"})
