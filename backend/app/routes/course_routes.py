from fastapi import APIRouter, HTTPException

from app.database import courses_collection, banners_collection

router = APIRouter(tags=["courses"])


@router.get("/courses")
async def get_courses():
    courses = await courses_collection.find().to_list(length=100)
    for c in courses:
        c["_id"] = str(c["_id"])
    return courses


@router.get("/courses/{slug}")
async def get_course(slug: str):
    course = await courses_collection.find_one({"slug": slug})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course["_id"] = str(course["_id"])
    return course


@router.get("/banners")
async def get_banners():
    banners = await banners_collection.find().to_list(length=10)
    for b in banners:
        b["_id"] = str(b["_id"])
    return banners
