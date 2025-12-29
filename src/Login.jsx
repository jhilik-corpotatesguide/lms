import { useState } from "react";
import logo from "./assets/logo.jpg";

function Login() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleGetOtp = () => {
    if (mobile.length !== 10) {
      alert("Please enter 10 digit mobile number");
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }
    alert("OTP Verified Successfully");
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center bg-light">
      <div className="row w-100 justify-content-center">

        {/* LEFT CARD */}
        <div className="col-md-4 d-flex justify-content-center">
          <div className="card shadow p-4 login-card">
            <h5>Enter your Phone Number</h5>
            <p className="text-muted small">
              We will send you an OTP to verify your details
            </p>

            {step === 1 && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleGetOtp}>
                  Get OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  className="btn btn-success w-100"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>

                <p
                  className="text-primary text-center mt-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setStep(1)}
                >
                  Change mobile number
                </p>
              </>
            )}
          </div>
        </div>

        {/* GAP COLUMN (controls spacing) 
        <div className="col-md-1"></div>

        {/* RIGHT CARD */}
        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center text-center">
          <img src={logo} alt="Logo" className="logo-img" />
          <h4 className="mt-3 text-primary">
            Welcome to Corporates Guide
          </h4>
          <p className="text-muted">
            Sign in to continue your learning journey
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
