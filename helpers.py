"""
Helper Utilities
================
Shared utility functions used across the project.
"""

import os
import time
import random
import logging

logger = logging.getLogger(__name__)

# Ensure screenshots directory exists
SCREENSHOT_DIR = "screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)


def human_delay(min_sec: float = 1.0, max_sec: float = 2.5) -> None:
    """
    Sleep for a random duration to mimic human behaviour.
    Reduces the chance of bot detection by Google.
    """
    delay = random.uniform(min_sec, max_sec)
    time.sleep(delay)


def take_screenshot(driver, name: str) -> None:
    """Save a screenshot to the screenshots/ folder."""
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    try:
        driver.save_screenshot(path)
        logger.info(f"Screenshot saved: {path}")
        print(f"   📸 Screenshot → {path}")
    except Exception as e:
        logger.warning(f"Could not save screenshot '{name}': {e}")


def log_step(message: str, level: str = "info") -> None:
    """Print a step message to stdout and write to log file."""
    print(f"[*] {message}")
    getattr(logger, level)(message)
