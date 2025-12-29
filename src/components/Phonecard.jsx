import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";

function PhoneCard() {
  // Step control: 1 = phone, 2 = OTP
  const [step, setStep] = useState(1);

  // Stores full phone number with country code (+91...)
  const [phone, setPhone] = useState("");

  // OTP value
  const [otp, setOtp] = useState("");

  // Error message
  const [error, setError] = useState("");

  // Loading state for OTP verify
  const [loading, setLoading] = useState(false);

  // Handle Get OTP button
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

    // Clear error and move to OTP step
    setError("");
    setStep(2);

    // Phone number is already in E.164 format
    console.log("Sending OTP to:", phone);
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    // Validate OTP (6 digits only)
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

  // Go back to phone number step
  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <div className="card shadow p-4 login-card">
      <h5>Enter your Phone Number</h5>
      <p className="text-muted small">
        We will send you an OTP to verify your details
      </p>

      {/* Error message */}
      {error && <div className="alert alert-danger small">{error}</div>}

      {/* STEP 1: Phone Number */}
      {step === 1 && (
        <>
          {/* Phone input with ALL country flags */}
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            className="mb-3"
          />

          <button className="btn btn-primary w-100" onClick={handleGetOtp}>
            Get OTP
          </button>
        </>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />

          <button
            className="btn btn-success w-100"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button className="btn btn-link w-100 mt-2" onClick={handleBack}>
            Change mobile number
          </button>
        </>
      )}
    </div>
  );
}

export default PhoneCard;
