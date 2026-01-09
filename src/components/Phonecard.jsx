import { useState } from "react";
import "./PhoneCard.css";   // Card design CSS

function PhoneCard() {

  // Step control: 1 = phone input, 2 = OTP input
  const [step, setStep] = useState(1);

  // Form values
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Message display
  const [msg, setMsg] = useState("");

  // Send OTP
  const sendOtp = async () => {
    const res = await fetch("http://127.0.0.1:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (data.message === "OTP_SENT") {
      setStep(2);
      setMsg("OTP sent to your phone");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const res = await fetch("http://127.0.0.1:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp })
    });

    const data = await res.json();

    if (data.message === "VERIFIED") setMsg("Login Successful 🎉");
    else setMsg("Invalid OTP ❌");
  };

  return (
    <div className="login-card">

      {/* Card Title */}
      <h4 className="text-center">Login with OTP</h4>

      {/* Status message */}
      {msg && <p className="text-center text-success">{msg}</p>}

      {/* Step 1 - Phone input */}
      {step === 1 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <button className="btn custom-btn w-100" onClick={sendOtp}>
            Get OTP
          </button>
        </>
      )}

      {/* Step 2 - OTP input */}
      {step === 2 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />

          <button className="btn custom-btn w-100" onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}

    </div>
  );
}

export default PhoneCard;
