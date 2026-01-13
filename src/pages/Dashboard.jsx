// Import dashboard styles
import "./Dashboard.css";

// Import the hero image (make sure this file exists in src/assets)
import hero from "../assets/image.png";

function Dashboard() {
  return (
    // Wrapper to isolate dashboard styles
    <div className="dashboard-page">

      {/* Main dashboard layout */}
      <div className="dashboard">

        {/* ---------------- LEFT SIDE: LOGIN FORM ---------------- */}
        <div className="left-panel">

          <h2>Welcome back!</h2>
          <p>Log in with your email</p>

          <input type="text" placeholder="Email address*" />
          <input type="password" placeholder="Password*" />

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="link">Forgot Password?</span>
          </div>

          <button className="login-btn">Login</button>

          <div className="divider">OR</div>

          <button className="social">Continue with Google</button>
          <button className="social">Continue with LinkedIn</button>

          <p className="signup">
            Don't have an account? <span>Sign Up</span>
          </p>

        </div>

        {/* ---------------- RIGHT SIDE: IMAGE ONLY ---------------- */}
        <div className="right-panel"></div>

      </div>
    </div>
  );
}

export default Dashboard;
