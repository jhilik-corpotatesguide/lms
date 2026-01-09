// Import the dashboard styles
import "./Dashboard.css";

// Import the image from assets folder
import hero from "../assets/image.png";

function Dashboard() {
  return (
    // Main dashboard container
    <div className="dashboard">

      {/* ---------------- LEFT SIDE: LOGIN FORM ---------------- */}
      <div className="left-panel">

        {/* Title & subtitle */}
        <h2>Welcome back!</h2>
        <p>Log in with your email</p>

        {/* Input fields */}
        <input type="text" placeholder="Email address*" />
        <input type="password" placeholder="Password*" />

        {/* Remember + Forgot password */}
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="link">Forgot Password?</span>
        </div>

        {/* Main login button */}
        <button className="login-btn">Login</button>

        {/* Divider */}
        <div className="divider">OR</div>

        {/* Social login buttons */}
        <button className="social">Continue with Google</button>
        <button className="social">Continue with LinkedIn</button>

        {/* Sign up link */}
        <p className="signup">
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>

      {/* ---------------- RIGHT SIDE: IMAGE ONLY ---------------- */}
      <div className="right-panel"></div>


    </div>
  );
}

export default Dashboard;
