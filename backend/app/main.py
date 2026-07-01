from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_indexes
from app.config import FRONTEND_URL
from app.routes import auth_routes, user_routes, course_routes

app = FastAPI(title="LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(course_routes.router)


@app.on_event("startup")
async def on_startup():
    await init_indexes()


@app.get("/")
async def root():
    return {"status": "LMS API running"}
