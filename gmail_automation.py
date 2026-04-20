"""
Gmail Automation with Selenium
================================
Automates Gmail login, signup, and sending emails.
"""

import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from config.settings import (
    GMAIL_URL, LOGIN_URL, SIGNUP_URL,
    DEFAULT_TIMEOUT, SLOW_TIMEOUT,
    EMAIL, PASSWORD
)
from utils.helpers import take_screenshot, human_delay, log_step

# ─── Logging Setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    filename="logs/automation.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)


# ─── Browser Setup ────────────────────────────────────────────────────────────
def create_driver(headless: bool = False) -> webdriver.Chrome:
    """Initialize and return a Chrome WebDriver."""
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument("--lang=en-US")

    if headless:
        options.add_argument("--headless=new")
        options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # Remove the navigator.webdriver flag
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    return driver


# ─── Gmail Login ──────────────────────────────────────────────────────────────
def login_to_gmail(driver: webdriver.Chrome, email: str, password: str) -> bool:
    """
    Log in to Gmail with the provided credentials.
    Returns True on success, False on failure.
    """
    log_step("Starting Gmail Login...")
    wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    try:
        driver.get(LOGIN_URL)
        human_delay(2, 3)

        # ── Enter Email ──
        log_step("Entering email address...")
        email_field = wait.until(
            EC.presence_of_element_located((By.ID, "identifierId"))
        )
        email_field.clear()
        for char in email:          # Type character by character (more human-like)
            email_field.send_keys(char)
            time.sleep(0.05)

        next_btn = wait.until(
            EC.element_to_be_clickable((By.ID, "identifierNext"))
        )
        next_btn.click()
        human_delay(2, 3)

        # ── Enter Password ──
        log_step("Entering password...")
        password_field = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//input[@name='Passwd' or @type='password']")
            )
        )
        password_field.clear()
        for char in password:
            password_field.send_keys(char)
            time.sleep(0.07)

        pass_next_btn = wait.until(
            EC.element_to_be_clickable((By.ID, "passwordNext"))
        )
        pass_next_btn.click()
        human_delay(3, 5)

        # ── Verify Login ──
        wait.until(EC.url_contains("mail.google.com"))
        log_step("✅ Login successful!")
        take_screenshot(driver, "login_success")
        return True

    except TimeoutException:
        log_step("❌ Login failed — timeout waiting for element.", level="error")
        take_screenshot(driver, "login_failed")
        return False
    except Exception as e:
        log_step(f"❌ Unexpected error during login: {e}", level="error")
        take_screenshot(driver, "login_error")
        return False


# ─── Gmail Signup ─────────────────────────────────────────────────────────────
def signup_gmail(
    driver: webdriver.Chrome,
    first_name: str,
    last_name: str,
    username: str,
    password: str,
    birth_day: str = "15",
    birth_month: str = "6",   # 6 = June
    birth_year: str = "1995",
    gender: str = "1"         # 1 = Male, 2 = Female, 3 = Rather not say
) -> bool:
    """
    Create a new Gmail account.
    Returns True on success, False on failure.

    ⚠️  Google may require phone verification for new accounts.
        This script handles the basic form — manual phone entry may be needed.
    """
    log_step("Starting Gmail Signup...")
    wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    try:
        driver.get(SIGNUP_URL)
        human_delay(2, 3)

        # ── Name ──
        log_step("Filling in name...")
        wait.until(EC.presence_of_element_located((By.NAME, "firstName"))).send_keys(first_name)
        driver.find_element(By.NAME, "lastName").send_keys(last_name)

        next_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Next']]")
        ))
        next_btn.click()
        human_delay(2, 3)

        # ── Birthday & Gender ──
        log_step("Filling in birthday and gender...")
        wait.until(EC.presence_of_element_located((By.ID, "day"))).send_keys(birth_day)

        from selenium.webdriver.support.ui import Select
        Select(driver.find_element(By.ID, "month")).select_by_value(birth_month)
        driver.find_element(By.ID, "year").send_keys(birth_year)
        Select(driver.find_element(By.ID, "gender")).select_by_value(gender)

        next_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Next']]")
        ))
        next_btn.click()
        human_delay(2, 3)

        # ── Username ──
        log_step("Choosing username...")
        username_field = wait.until(
            EC.presence_of_element_located((By.NAME, "Username"))
        )
        username_field.clear()
        username_field.send_keys(username)

        next_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Next']]")
        ))
        next_btn.click()
        human_delay(2, 3)

        # ── Password ──
        log_step("Setting password...")
        wait.until(EC.presence_of_element_located((By.NAME, "Passwd"))).send_keys(password)
        driver.find_element(By.NAME, "PasswdAgain").send_keys(password)

        next_btn = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Next']]")
        ))
        next_btn.click()
        human_delay(3, 5)

        log_step("✅ Signup form submitted! (Phone verification may be required.)")
        take_screenshot(driver, "signup_submitted")
        return True

    except TimeoutException:
        log_step("❌ Signup failed — timeout.", level="error")
        take_screenshot(driver, "signup_failed")
        return False
    except Exception as e:
        log_step(f"❌ Unexpected error during signup: {e}", level="error")
        take_screenshot(driver, "signup_error")
        return False


# ─── Compose & Send Email ─────────────────────────────────────────────────────
def compose_and_send_email(
    driver: webdriver.Chrome,
    to_email: str,
    subject: str,
    body: str
) -> bool:
    """
    Compose and send an email in Gmail.
    Assumes the user is already logged in.
    Returns True on success, False on failure.
    """
    log_step(f"Composing email to: {to_email}")
    wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    try:
        # ── Navigate to Gmail if not already there ──
        if "mail.google.com" not in driver.current_url:
            driver.get(GMAIL_URL)
            human_delay(3, 4)

        # ── Click Compose ──
        log_step("Clicking Compose button...")
        compose_btn = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//div[contains(@class,'T-I') and contains(@class,'T-I-KE')]")
            )
        )
        compose_btn.click()
        human_delay(1, 2)

        # ── To Field ──
        log_step("Filling in recipient...")
        to_field = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//input[@aria-label='To recipients' or @name='to']")
            )
        )
        to_field.send_keys(to_email)
        to_field.send_keys(Keys.TAB)
        human_delay(0.5, 1)

        # ── Subject ──
        log_step("Filling in subject...")
        subject_field = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//input[@name='subjectbox']")
            )
        )
        subject_field.send_keys(subject)
        human_delay(0.5, 1)

        # ── Body ──
        log_step("Writing email body...")
        body_field = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//div[@aria-label='Message Body' or @role='textbox']")
            )
        )
        body_field.click()
        body_field.send_keys(body)
        human_delay(1, 2)

        take_screenshot(driver, "email_composed")

        # ── Send ──
        log_step("Sending email...")
        send_btn = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, "//div[@aria-label='Send ‪(Ctrl-Enter)‬' or @data-tooltip='Send']")
            )
        )
        send_btn.click()
        human_delay(2, 3)

        # ── Confirm Sent ──
        try:
            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(),'Message sent') or contains(text(),'Sent')]")
                )
            )
            log_step("✅ Email sent successfully!")
            take_screenshot(driver, "email_sent")
            return True
        except TimeoutException:
            log_step("⚠️  Could not confirm 'Message sent' toast — email may still have sent.")
            take_screenshot(driver, "email_sent_unconfirmed")
            return True

    except TimeoutException:
        log_step("❌ Email compose failed — timeout.", level="error")
        take_screenshot(driver, "email_compose_failed")
        return False
    except Exception as e:
        log_step(f"❌ Unexpected error while composing: {e}", level="error")
        take_screenshot(driver, "email_compose_error")
        return False


# ─── Main Runner ──────────────────────────────────────────────────────────────
def main():
    driver = None
    try:
        driver = create_driver(headless=False)

        # ── Login ──
        logged_in = login_to_gmail(driver, EMAIL, PASSWORD)

        if logged_in:
            # ── Send a Sample Email ──
            compose_and_send_email(
                driver,
                to_email="recipient@example.com",
                subject="Hello from Gmail Automation 🤖",
                body=(
                    "Hi there,\n\n"
                    "This email was sent automatically using Python + Selenium.\n\n"
                    "Features demonstrated:\n"
                    "  ✅ Gmail Login\n"
                    "  ✅ Compose Email\n"
                    "  ✅ Send Email\n\n"
                    "Best regards,\n"
                    "Gmail Automation Bot"
                )
            )
        else:
            log_step("Skipping email compose — login failed.", level="warning")

    finally:
        if driver:
            time.sleep(3)
            driver.quit()
            log_step("Browser closed.")


if __name__ == "__main__":
    main()
