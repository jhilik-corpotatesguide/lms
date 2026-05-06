import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhoneCard.css";

function PhoneCard() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();// comment line

  const BASE_URL = "http://192.168.29.195:5000";

  // ================= SEND EMAIL OTP =================
  const sendOtp = async () => {
    if (!email || !email.includes("@")) {
      setMsg("Please enter a valid email address ❌");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.message === "EMAIL_OTP_SENT") {
        setStep(2);
        setMsg("OTP sent to your email ✅");
      } else if (data.message === "INVALID_EMAIL") {
        setMsg("Invalid email address ❌");
      } else {
        setMsg("Failed to send OTP ❌");
      }
    } catch (err) {
      setMsg("Server error ❌");
    }
  };

  // ================= VERIFY EMAIL OTP =================
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMsg("Please enter the 6-digit OTP ❌");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.message === "VERIFIED") {
  setMsg("Login Successful 🎉");

  // ✅ email save করো
  localStorage.setItem("user_email", email);

  // ✅ নতুন user হলে registration, পুরানো হলে course
  setTimeout(() => {
    if (data.is_new) {
      navigate("/dashboard");   // registration page
    } else {
      // পুরানো user এর নাম save করো
      localStorage.setItem("user_name", data.user_name || "User");
      navigate("/course");      // course page
    }
  }, 800);
}else if (data.message === "OTP expired") {
        setMsg("OTP expired. Please request a new one ❌");
        setStep(1);
        setOtp("");
      } else {
        setMsg("Invalid OTP ❌");
      }
    } catch (err) {
      setMsg("Server error ❌");
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
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOtp()}
          />
          <button className="btn custom-btn w-100" onClick={sendOtp}>
            Get OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="back-hint">
            <button
              className="back-btn"
              onClick={() => { setStep(1); setMsg(""); setOtp(""); }}
            >
              ← Back
            </button>
            <span>OTP sent to {email}</span>
          </p>
          <input
            className="form-control mb-3"
            placeholder="Enter 6-digit OTP"
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
          />
          <button className="btn custom-btn w-100" onClick={verifyOtp}>
            Verify OTP
          </button>
          <button className="resend-btn" onClick={sendOtp}>
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
}

export default PhoneCard;