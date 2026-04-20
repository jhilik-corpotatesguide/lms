# 📧 Gmail Automation with Python & Selenium

Automate Gmail directly from your terminal — login, sign up, compose, and send emails using a real Chrome browser controlled by Selenium.

---

## 📁 Project Structure

```
gmail_automation/
├── gmail_automation.py      ← Main script (login, signup, send email)
├── requirements.txt         ← Python dependencies
├── config/
│   ├── __init__.py
│   └── settings.py          ← URLs, timeouts, credentials
├── utils/
│   ├── __init__.py
│   └── helpers.py           ← Screenshots, logging, human delays
├── screenshots/             ← Auto-created; stores step screenshots
└── logs/
    └── automation.log       ← Auto-created; full run log
```

---

## ⚙️ Setup

### 1. Prerequisites

| Requirement | Version |
|-------------|---------|
| Python      | 3.8+    |
| Google Chrome | Latest |

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

`webdriver-manager` automatically downloads the correct ChromeDriver — no manual setup needed.

### 3. Configure Credentials

Open `config/settings.py` and fill in your details:

```python
EMAIL    = "your_email@gmail.com"
PASSWORD = "your_password_here"
```

> ⚠️ **Security tip**: Use environment variables instead of hardcoding credentials.  
> Set `GMAIL_EMAIL` and `GMAIL_PASSWORD` as env vars and read them with `os.getenv()`.

---

## 🚀 Run the Script

```bash
cd gmail_automation
python gmail_automation.py
```

The browser will open, log in to Gmail, compose a sample email, and send it.

---

## 🧩 Features

### ✅ Login (`login_to_gmail`)

```python
login_to_gmail(driver, email="you@gmail.com", password="secret")
```

- Navigates to Google's sign-in page  
- Types email & password character-by-character (human simulation)  
- Waits for Gmail inbox to confirm success  
- Takes a screenshot on success/failure

---

### ✅ Signup (`signup_gmail`)

```python
signup_gmail(
    driver,
    first_name="John",
    last_name="Doe",
    username="johndoe2025",
    password="StrongPass@123",
    birth_day="15",
    birth_month="6",
    birth_year="1995",
    gender="1"          # 1=Male, 2=Female, 3=Rather not say
)
```

- Fills in the full Google account creation form  
- Selects birthday and gender from dropdowns  
- ⚠️ Google typically requires phone verification for new accounts — the script handles the form; you may need to enter a code manually.

---

### ✅ Compose & Send (`compose_and_send_email`)

```python
compose_and_send_email(
    driver,
    to_email="friend@example.com",
    subject="Hello from Selenium!",
    body="This email was sent by a robot. 🤖"
)
```

- Clicks the Compose button  
- Fills in To, Subject, and Body fields  
- Clicks Send and waits for the confirmation toast

---

## 🛡️ Anti-Detection Measures

The script includes several techniques to reduce bot-detection risk:

| Technique | Description |
|-----------|-------------|
| `human_delay()` | Random sleep between actions (1–5 seconds) |
| Character-by-character typing | Simulates realistic keyboard input |
| `navigator.webdriver` removal | Hides Selenium's automation flag |
| `excludeSwitches` | Removes the "Chrome is being controlled" banner |

> Even with these measures, Google may flag automation attempts. Use a real account and avoid running the script too frequently.

---

## 📸 Screenshots

Every key step saves a screenshot to `screenshots/`:

| File | When |
|------|------|
| `login_success.png` | After successful login |
| `login_failed.png` | If login times out |
| `email_composed.png` | Before clicking Send |
| `email_sent.png` | After Send confirmation |

---

## 📝 Logs

All steps are logged to `logs/automation.log`:

```
2025-08-01 12:00:01 [INFO] Starting Gmail Login...
2025-08-01 12:00:04 [INFO] Entering email address...
2025-08-01 12:00:07 [INFO] Entering password...
2025-08-01 12:00:12 [INFO] Login successful!
2025-08-01 12:00:13 [INFO] Composing email to: recipient@example.com
2025-08-01 12:00:17 [INFO] Email sent successfully!
```

---

## 🔧 Customisation

### Run Headless (no browser window)

In `gmail_automation.py`, change:

```python
driver = create_driver(headless=True)
```

### Send to Multiple Recipients

```python
recipients = ["alice@example.com", "bob@example.com"]
for recipient in recipients:
    compose_and_send_email(driver, recipient, "Hi!", "Test email")
    time.sleep(2)
```

### Use Environment Variables for Credentials

```python
import os
EMAIL    = os.getenv("GMAIL_EMAIL", "fallback@gmail.com")
PASSWORD = os.getenv("GMAIL_PASSWORD", "")
```

Set them before running:
```bash
export GMAIL_EMAIL="you@gmail.com"
export GMAIL_PASSWORD="yourpassword"
python gmail_automation.py
```

---

## ⚠️ Important Notes

1. **Google's Terms of Service**: Automating Gmail may violate Google's ToS. Use this for personal projects and testing only.
2. **2-Factor Authentication**: If 2FA is enabled, the script will pause at that step — you'll need to approve it manually.
3. **CAPTCHA**: Google may show a CAPTCHA if it detects unusual activity. The script cannot solve CAPTCHAs automatically.
4. **App Passwords**: If you have 2FA, consider using a Google App Password instead of your main password.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `selenium` | Browser automation |
| `webdriver-manager` | Auto-downloads ChromeDriver |

---

## 📄 License

MIT — free to use, modify, and distribute.
