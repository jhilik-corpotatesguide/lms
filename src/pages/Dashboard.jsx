import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://192.168.29.195:5000";

  const handleRegister = async () => {
    if (!fullName || !address || !email || !phone) {
      setMessage("Please complete all required fields.");
      return;
    }
    if (!agree) {
      setMessage("You must agree to the Terms & Conditions.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone.toString(),
          email,
          role: "student",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ User info save করো
        localStorage.setItem("user_name", fullName);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_id", data.user_id);

        setMessage("Registration successful! Redirecting...");

        // ✅ Course page এ যাও
        setTimeout(() => {
          navigate("/course");
        }, 1000);

      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">

      {/* Background Layer */}
      <div className="bg-layer"></div>

      {/* Registration Card */}
      <div className="dashboard-card">

        <h2 className="create-titleh2">Welcome new user!</h2>
        <h3 className="create-title">Create Account</h3>
        <p>Please fill in the details to register</p>

        {message && <div className="alert-message">{message}</div>}

        <input
          type="text"
          placeholder="First Name*"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name*"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address*"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        
        <input
          type="tel"
          placeholder="Phone Number*"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

       

        <button
          className="login-btn"
          onClick={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        

        

      </div>
    </div>
  );
}

export default Dashboard;