"""
Configuration / Settings
========================
Edit EMAIL and PASSWORD before running.
"""

# ── Gmail URLs ────────────────────────────────────────────────────────────────
GMAIL_URL  = "https://mail.google.com"
LOGIN_URL  = "https://accounts.google.com/signin/v2/identifier?service=mail"
SIGNUP_URL = (
    "https://accounts.google.com/signup/v2/webcreateaccount"
    "?service=mail&continue=https://mail.google.com/mail/&flowName=GlifWebSignIn"
    "&flowEntry=SignUp"
)

# ── Timeouts (seconds) ────────────────────────────────────────────────────────
DEFAULT_TIMEOUT = 15   # Normal element wait
SLOW_TIMEOUT    = 30   # For slower pages

# ── Credentials ───────────────────────────────────────────────────────────────
# ⚠️  Replace with your real Gmail credentials before running!
EMAIL    = "your_email@gmail.com"
PASSWORD = "your_password_here"
