// React hooks
import { useState } from "react";

// Phone input component & validator
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";

// Phone input default styles
import "react-phone-number-input/style.css";

function PhoneCard() {

  // Step control: 1 = phone input, 2 = OTP input
  const [step, setStep] = useState(1);

  // Stores complete phone number with country code (+91...)
  const [phone, setPhone] = useState("");

  // Stores entered OTP
  const [otp, setOtp] = useState("");

  // Stores validation / error messages
  const [error, setError] = useState("");

  // Loading state while verifying OTP
  const [loading, setLoading] = useState(false);

  // Handle "Get OTP" button click
  const handleGetOtp = () => {

    // Check if phone number is empty
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    // Validate phone number for selected country
    if (!isValidPhoneNumber(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Clear error and move to OTP screen
    setError("");
    setStep(2);

    // Phone number is already in E.164 format
    console.log("Sending OTP to:", phone);
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {

    // Validate OTP (must be exactly 6 digits)
    if (otp.length !== 6 || isNaN(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);

    // Fake API call simulation
    setTimeout(() => {
      setLoading(false);
      alert("OTP Verified Successfully!");
    }, 2000);
  };

  // Go back to phone number screen
  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <div className="card shadow p-4 login-card">

      {/* Title */}
      <h5>Enter your Phone Number</h5>

      {/* Subtitle */}
      <p className="text-muted small">
        We will send you an OTP to verify your details
      </p>

      {/* Error Message */}
      {error && <div className="alert alert-danger small">{error}</div>}

      {/* STEP 1: Phone Number Input */}
      {step === 1 && (
        <>
          {/* International phone input with country selector */}
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            className="mb-3"
          />

          {/* Get OTP Button */}
          <button className="btn btn-primary w-100 custom-btn" onClick={handleGetOtp}>
            Get OTP
          </button>
        </>
      )}

      {/* STEP 2: OTP Input */}
      {step === 2 && (
        <>
          {/* OTP input field */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />

          {/* Verify OTP Button */}
          <button
            className="btn btn-primary w-100 custom-btn"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Change phone number */}
          <button className="btn btn-link w-100 mt-2" onClick={handleBack}>
            Change mobile number
          </button>
        </>
      )}
    </div>
  );
}

export default PhoneCard;
