// ── Imports ──────────────────────────────────────────────────
import { useState } from "react";                     // React state hook
import { useNavigate } from "react-router-dom";        // For page navigation
import "./Dashboard.css";                              // Dashboard styles

function Dashboard() {

  // ── State Variables ───────────────────────────────────────
  const [fullName,    setFullName]    = useState("");  // Stores user's full name
  const [address,     setAddress]     = useState("");  // Stores user's address
  const [phone,       setPhone]       = useState("");  // Stores user's phone number
  const [dob,         setDob]         = useState("");  // Stores date of birth
  const [institution, setInstitution] = useState("");  // Stores university/school/company (optional)
  const [message,     setMessage]     = useState("");  // Stores success or error message
  const [isSubmitting,setIsSubmitting]= useState(false); // Tracks if form is being submitted

  // ── Navigation hook ───────────────────────────────────────
  const navigate = useNavigate();

  // ── Backend URL ───────────────────────────────────────────
  const BASE_URL = "http://192.168.29.189:5000";

  // ── Calculate max date allowed for DOB (must be 14+ years old) ──
  const today = new Date();
  today.setFullYear(today.getFullYear() - 14);         // Subtract 14 years from today
  const maxDob = today.toISOString().split("T")[0];    // Format as YYYY-MM-DD

  // ── Handle Register Button Click ──────────────────────────
  const handleRegister = async () => {

    // Check if all required fields are filled
    if (!fullName || !address || !phone || !dob) {
      setMessage("Please complete all required fields.");
      return; // Stop if any required field is empty
    }

    // Check phone number is exactly 10 digits
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);  // Disable button while submitting
    setMessage("");          // Clear any previous message

    try {
      // Send registration data to backend
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name  : fullName,          // User's full name
          phone      : phone.toString(),  // Phone as string
          address    : address,           // User's address
          dob        : dob,               // Date of birth
          institution: institution,       // University/School/Company (optional)
          role       : "student",         // Default role is student
        }),
      });

      // Parse backend response
      const data = await response.json();

      if (response.ok) {
        // ✅ Registration successful — save user info to localStorage
        localStorage.setItem("user_name",  fullName);   // Save name for navbar display
        localStorage.setItem("user_id",    data.user_id); // Save user ID

        // Show success message
        setMessage("Registration successful! Redirecting...");

        // Redirect to course page after 1 second
        setTimeout(() => {
          navigate("/course");
        }, 1000);

      } else {
        // ❌ Backend returned an error
        if (data.message === "PHONE_ALREADY_EXISTS") {
          setMessage("This phone number is already registered.");
        } else {
          setMessage(data.message || "Registration failed. Please try again.");
        }
      }

    } catch (error) {
      // ❌ Could not connect to backend
      setMessage("Unable to connect to the backend. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

  // ── JSX (UI) ─────────────────────────────────────────────
  return (
    <div className="dashboard-page">

      {/* Background decorative layer */}
      <div className="bg-layer"></div>

      {/* Registration Card */}
      <div className="dashboard-card">

        {/* Card headings */}
        <h2 className="create-titleh2">Welcome new user!</h2>
        <h3 className="create-title">Create Account</h3>
        <p>Please fill in the details to register</p>

        {/* Show message if any (success or error) */}
        {message && <div className="alert-message">{message}</div>}

        {/* Full Name input — required */}
        <input
          type="text"
          placeholder="Full Name*"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        {/* Address input — required */}
        <input
          type="text"
          placeholder="Address*"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Phone Number input — required, numbers only */}
        <input
          type="tel"
          placeholder="Phone Number*"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))} // Allow digits only
        />

        {/* Date of Birth input — required, must be 14+ years old */}
        <label className="dob-label">Date of Birth*</label>
        <input
          type="date"
          value={dob}
          max={maxDob}       // User must be at least 14 years old
          onChange={(e) => setDob(e.target.value)}
        />

        {/* Institution input — optional */}
        <input
          type="text"
          placeholder="University / School / Company (optional)"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />

        {/* Register button — disabled while submitting */}
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