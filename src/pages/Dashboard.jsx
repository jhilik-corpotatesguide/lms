// Import the CSS file for styling this page
import "./Dashboard.css";

// Dashboard / Registration Component
function Dashboard() {
  return (
    // Main wrapper that holds the full-page background
    <div className="dashboard-page">

      {/* Registration form card */}
      <div className="dashboard-card">

        {/* Page heading */}
        <h2>Create Account</h2>
        <p>Please fill in the details to register</p>

        {/* User name input */}
        <input type="text" placeholder="Full Name*" />

        {/* Address input */}
        <input type="text" placeholder="Address*" />

        {/* Email input */}
        <input type="email" placeholder="Email Address*" />

        {/* Password input */}
        <input type="password" placeholder="Password*" />

        {/* Confirm password input */}
        <input type="password" placeholder="Confirm Password*" />

        {/* Terms & conditions checkbox */}
        <div className="options">
          <label>
            <input type="checkbox" /> I agree to the Terms & Conditions
          </label>
        </div>

        {/* Register button */}
        <button className="login-btn">Register</button>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Social login buttons */}
        <button className="social">Register with Google</button>
        <button className="social">Register with LinkedIn</button>

        {/* Login redirect */}
        <p className="signup">
          Already have an account? <span>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Dashboard;
