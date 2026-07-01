"""
Run this once after setting up MongoDB to populate sample courses & banners:
    python seed_data.py
"""
import asyncio
from app.database import courses_collection, banners_collection

COURSES = [
    {
        "slug": "frontend-development",
        "title": "Frontend Development",
        "description": "Master HTML, CSS, JavaScript, and React to build modern, responsive web applications from scratch.",
        "duration": "2 Months",
        "certificate": True,
        "placement_support": True,
        "image": "/images/frontend.png",
    },
    {
        "slug": "backend-development",
        "title": "Backend Development",
        "description": "Learn server-side programming with Node.js, Express, REST APIs, and database integration.",
        "duration": "2 Months",
        "certificate": True,
        "placement_support": True,
        "image": "/images/backend.png",
    },
    {
        "slug": "machine-learning",
        "title": "Machine Learning",
        "description": "Dive into ML algorithms, model training, and real-world AI applications using Python and scikit-learn.",
        "duration": "2.5 Months",
        "certificate": True,
        "placement_support": True,
        "image": "/images/ml.png",
    },
    {
        "slug": "data-analysis",
        "title": "Data Analysis",
        "description": "Analyze and visualize data using Python, Pandas, NumPy, and Matplotlib to drive business decisions.",
        "duration": "2 Months",
        "certificate": True,
        "placement_support": True,
        "image": "/images/data-analysis.png",
    },
    {
        "slug": "automation-testing",
        "title": "Automation Testing",
        "description": "Learn Selenium, pytest, and CI/CD pipelines to automate software testing like a professional.",
        "duration": "2 Months",
        "certificate": True,
        "placement_support": True,
        "image": "/images/automation.png",
    },
]

BANNERS = [
    {
        "title": "Learn In-Demand Tech Skills",
        "subtitle": "Join our expert-led courses and kickstart your career",
        "image": "/images/banner1.jpg",
    },
    {
        "title": "Get Certified",
        "subtitle": "Earn a certificate recognized by top companies",
        "image": "/images/banner2.jpg",
    },
    {
        "title": "100% Placement Support",
        "subtitle": "We help you land your first tech job",
        "image": "/images/banner3.jpg",
    },
]


async def seed():
    await courses_collection.delete_many({})
    await courses_collection.insert_many(COURSES)

    await banners_collection.delete_many({})
    await banners_collection.insert_many(BANNERS)

    print(f"Inserted {len(COURSES)} courses and {len(BANNERS)} banners.")


if __name__ == "__main__":
    asyncio.run(seed())
