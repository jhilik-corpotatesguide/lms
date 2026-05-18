import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhoneCard.css";

function PhoneCard() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://10.237.65.203:5000";

  const showMsg = (text, type = "error") => {
    setMsg(text);
    setMsgType(type);
  };

  // ================= SEND EMAIL OTP =================
  const sendOtp = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      showMsg("Please enter a valid email address ❌");
      return;
    }

    setLoading(true);
    showMsg("");

    try {
      const res = await fetch(`${BASE_URL}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (data.message === "EMAIL_OTP_SENT") {
        setStep(2);
        showMsg("OTP sent to your email ✅", "success");
      } else if (data.message === "INVALID_EMAIL") {
        showMsg("Invalid email address ❌");
      } else if (data.message === "EMAIL_NOT_CONFIGURED") {
        showMsg("Email service not configured. Contact admin ❌");
      } else {
        showMsg("Failed to send OTP. Try again ❌");
      }
    } catch (err) {
      showMsg("Cannot connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY EMAIL OTP =================
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      showMsg("Please enter the 6-digit OTP ❌");
      return;
    }

    setLoading(true);
    showMsg("");

    try {
      const res = await fetch(`${BASE_URL}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();

      if (data.message === "VERIFIED") {
        showMsg("Login Successful 🎉", "success");

        // সব দরকারি data save করো
        localStorage.setItem("user_email", email.trim().toLowerCase());
        if (data.user_id) localStorage.setItem("user_id", data.user_id);
        if (data.user_name) localStorage.setItem("user_name", data.user_name);

        setTimeout(() => {
          if (data.is_new) {
            navigate("/dashboard"); // নতুন user → registration
          } else {
            navigate("/course");    // পুরানো user → course
          }
        }, 800);

      } else if (data.message === "OTP expired") {
        showMsg("OTP expired. Please request a new one ❌");
        setStep(1);
        setOtp("");
      } else if (data.message === "No OTP found for this email") {
        showMsg("No OTP found. Please request a new one ❌");
        setStep(1);
        setOtp("");
      } else {
        showMsg("Invalid OTP. Please try again ❌");
      }
    } catch (err) {
      showMsg("Cannot connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h4 className="text-center">Login with OTP</h4>

      {/* Message box */}
      {msg && (
        <p
          className="text-center"
          style={{ color: msgType === "success" ? "green" : "red" }}
        >
          {msg}
        </p>
      )}

      {/* ── Step 1: Email input ── */}
      {step === 1 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOtp()}
            disabled={loading}
          />
          <button
            className="btn custom-btn w-100"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </>
      )}

      {/* ── Step 2: OTP input ── */}
      {step === 2 && (
        <>
          <p className="back-hint">
            <button
              className="back-btn"
              onClick={() => { setStep(1); setMsg(""); setOtp(""); }}
              disabled={loading}
            >
              ← Back
            </button>
            <span>OTP sent to {email}</span>
          </p>

          <input
            className="form-control mb-3"
            placeholder="Enter 6-digit OTP"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
            disabled={loading}
          />

          <button
            className="btn custom-btn w-100"
            onClick={verifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            className="resend-btn"
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        </>
      )}
    </div>
  );
}

export default PhoneCard;