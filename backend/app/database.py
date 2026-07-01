import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "lms_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
otps_collection = db["otps"]
courses_collection = db["courses"]
banners_collection = db["banners"]


async def init_indexes():
    """Call this once on startup to create required indexes."""
    await users_collection.create_index("email", unique=True)
    await otps_collection.create_index("email")
    await otps_collection.create_index("expires_at", expireAfterSeconds=0)
    await courses_collection.create_index("slug", unique=True)
