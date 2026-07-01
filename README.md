# Corporates Guide LMS

A full-stack Learning Management System.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python + FastAPI
- **Database:** MongoDB

## Features implemented

- Home page with 3 auto-changing banners (pulled from MongoDB)
- Navbar: Home, Courses, About, Calendar, Login/Profile
- Email + OTP login (no passwords). OTP is emailed via SMTP.
- New email → registration form (name, DOB, college/company, phone) → then goes to Courses page
- Existing email → OTP verify → straight to Courses page
- One email can only be registered once
- Course listing page (cards match your attached design) with "Enroll Now"
- Profile page: shows name, email, enrolled courses, profile picture upload,
  and an "Edit Profile" option — **email itself can never be edited**
- Clicking "Courses" while logged out redirects to the Login page
- All data (users, OTPs, courses, banners) stored in MongoDB
- Session handling: after 1 hour of being logged in, a popup appears.
  If the user does not click "Continue" within 5 minutes, they are
  automatically logged out.

---

## 1. What you need to install first

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **Python** (v3.10 or newer) — https://www.python.org/downloads/
3. **MongoDB** — either:
   - Install MongoDB Community Server locally: https://www.mongodb.com/try/download/community, OR
   - Use a free MongoDB Atlas cloud cluster (recommended, no local install needed): https://www.mongodb.com/cloud/atlas/register
4. A code editor such as VS Code (optional but recommended)
5. A Gmail (or any SMTP) account to send OTP emails.
   - For Gmail: turn on 2-Step Verification, then create an **App Password**
     at https://myaccount.google.com/apppasswords — use that as `SMTP_PASSWORD`.

---

## 2. Backend setup (FastAPI + MongoDB)

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your real values:

```bash
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string
  - Local: `mongodb://localhost:27017`
  - Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
- `JWT_SECRET` — any long random string
- `SMTP_USER` / `SMTP_PASSWORD` — your email + app password for sending OTPs
  - If you leave these blank, OTPs will just be printed in the backend
    terminal (useful for testing without email setup).

Seed the database with sample courses & banners (run once):

```bash
python seed_data.py
```

Run the backend server:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will run at: **http://localhost:8000**
API docs (auto-generated): **http://localhost:8000/docs**

---

## 3. Frontend setup (React + Vite)

Open a new terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Make sure `VITE_API_URL=http://localhost:8000` matches your backend URL.

Run the frontend:

```bash
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 4. How the login flow works

1. User enters email on `/login` → OTP is generated, saved in MongoDB
   (expires after 5 minutes) and emailed to the user.
2. User enters OTP on `/verify-otp`.
   - If the email is **new** → redirected to `/register` to fill in
     name, date of birth, college/company, phone.
   - If the email **already registered** → logged in immediately and
     redirected to `/courses`.
3. A JWT access token (valid 1 hour) is stored in the browser and sent
   with every API request.
4. If a logged-out user clicks "Courses" or "Profile", they're
   automatically redirected to `/login`.
5. After 1 hour of login, a "Are you still there?" popup appears. If the
   user doesn't click "Continue Session" within 5 minutes, they're
   logged out automatically.

---

## 5. Project structure

```
lms-project/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint
│   │   ├── config.py          # env config
│   │   ├── database.py        # MongoDB connection + collections
│   │   ├── auth.py            # JWT + OTP helpers
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── auth_routes.py     # /auth/send-otp /auth/verify-otp /auth/register
│   │   │   ├── user_routes.py     # /user/me /user/enroll
│   │   │   └── course_routes.py   # /courses /banners
│   │   └── utils/email_utils.py   # sends OTP emails
│   ├── seed_data.py           # inserts sample courses/banners
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Home, Login, VerifyOtp, Register, Courses, Profile, About, Calendar
│   │   ├── components/         # Navbar, BannerCarousel, SessionWarningModal, RequireAuth
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useSessionTimeout.js   # 1hr / 5min auto-logout logic
│   │   ├── utils/api.js        # axios instance
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md   (this file)
```

---

## 6. Adding your own course/banner images

Put image files inside `frontend/public/images/` (e.g. `frontend.png`,
`banner1.jpg`, etc.). Then edit `backend/seed_data.py` to point to the
matching filenames (or full image URLs), and re-run `python seed_data.py`.

---

## 7. Deploying later (optional)

- Backend: deploy to Render / Railway / a VPS (uvicorn + MongoDB Atlas)
- Frontend: deploy to Vercel / Netlify (`npm run build` → `dist/` folder)
- Update `VITE_API_URL` in frontend `.env` to your deployed backend URL,
  and `FRONTEND_URL` in backend `.env` to your deployed frontend URL (for CORS).
