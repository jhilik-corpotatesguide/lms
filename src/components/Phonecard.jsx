import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhoneCard.css";

function PhoneCard() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate(); // ✅ navigation

  // ⚠️ backend PC er IP dao
  const BASE_URL = "http://192.168.29.160:5000";

  // ================= SEND OTP =================
  const sendOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();

      if (data.message === "OTP_SENT") {
        setStep(2);
        setMsg("OTP sent to your phone");
      } else {
        setMsg("Failed to send OTP");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });

      const data = await res.json();

      if (data.message === "VERIFIED") {
        setMsg("Login Successful 🎉");

        // ✅ redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setMsg("Invalid OTP ❌");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div className="login-card">
      <h4 className="text-center">Login with OTP</h4>

      {msg && <p className="text-center">{msg}</p>}

      {step === 1 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button className="btn custom-btn w-100" onClick={sendOtp}>
            Get OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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