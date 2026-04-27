from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure
from datetime import datetime
import os

# ================== MONGO CONFIG ==================
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "lms_db"

# ================== CONNECTION ==================
def get_db():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        print("✅ MongoDB connected successfully")
        return client[DB_NAME]
    except ConnectionFailure as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise

db = get_db()

# ================== COLLECTIONS ==================
users_collection     = db["users"]
otp_collection       = db["otp_sessions"]
courses_collection   = db["courses"]
enrollments_collection = db["enrollments"]

# ================== INDEXES ==================
def setup_indexes():
    # Users: unique phone & email
    users_collection.create_index([("phone", ASCENDING)], unique=True)
    users_collection.create_index([("email", ASCENDING)], unique=True, sparse=True)

    # OTP: TTL index — auto-delete docs after 300 seconds (5 mins)
    otp_collection.create_index([("created_at", ASCENDING)], expireAfterSeconds=300)
    otp_collection.create_index([("phone", ASCENDING)], unique=True)

    # Courses
    courses_collection.create_index([("title", ASCENDING)])

    # Enrollments: compound index
    enrollments_collection.create_index(
        [("user_id", ASCENDING), ("course_id", ASCENDING)], unique=True
    )

    print("✅ Indexes created")

setup_indexes()

# ================== SCHEMAS (helper dicts) ==================

def new_user(full_name, phone, email=None, password_hash=None, role="student"):
    """
    Users Collection Schema
    -----------------------
    _id          : ObjectId (auto)
    full_name    : str
    phone        : str  (unique, used for OTP login)
    email        : str  (optional, unique)
    password_hash: str  (optional, for email/password login)
    role         : str  → "student" | "instructor" | "admin"
    is_verified  : bool (True once OTP verified)
    profile_pic  : str  (URL, optional)
    created_at   : datetime
    updated_at   : datetime
    """
    return {
        "full_name"    : full_name,
        "phone"        : phone,
        "email"        : email,
        "password_hash": password_hash,
        "role"         : role,
        "is_verified"  : False,
        "profile_pic"  : None,
        "created_at"   : datetime.utcnow(),
        "updated_at"   : datetime.utcnow(),
    }


def new_otp_session(phone, otp):
    """
    OTP Sessions Collection Schema
    -------------------------------
    _id         : ObjectId (auto)
    phone       : str  (unique — one active OTP per phone)
    otp         : str
    created_at  : datetime  (TTL index auto-deletes after 300s)
    attempts    : int  (track failed attempts)
    """
    return {
        "phone"     : phone,
        "otp"       : otp,
        "created_at": datetime.utcnow(),
        "attempts"  : 0,
    }


def new_course(title, description, instructor_id, price=0, category=None, thumbnail=None):
    """
    Courses Collection Schema
    --------------------------
    _id           : ObjectId (auto)
    title         : str
    description   : str
    instructor_id : ObjectId (ref → users._id)
    price         : float
    category      : str
    thumbnail     : str  (URL)
    is_published  : bool
    created_at    : datetime
    updated_at    : datetime
    """
    return {
        "title"        : title,
        "description"  : description,
        "instructor_id": instructor_id,
        "price"        : price,
        "category"     : category,
        "thumbnail"    : thumbnail,
        "is_published" : False,
        "created_at"   : datetime.utcnow(),
        "updated_at"   : datetime.utcnow(),
    }


def new_enrollment(user_id, course_id):
    """
    Enrollments Collection Schema
    ------------------------------
    _id         : ObjectId (auto)
    user_id     : ObjectId (ref → users._id)
    course_id   : ObjectId (ref → courses._id)
    enrolled_at : datetime
    progress    : float  (0.0 – 100.0)
    completed   : bool
    """
    return {
        "user_id"    : user_id,
        "course_id"  : course_id,
        "enrolled_at": datetime.utcnow(),
        "progress"   : 0.0,
        "completed"  : False,
    }