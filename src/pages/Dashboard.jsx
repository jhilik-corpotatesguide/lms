import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">

      <div className="dashboard-card">

        <h2>Welcome back!</h2>
        <p>Log in with your email</p>

        <input type="text" placeholder="Name*" />
        <input type="text" placeholder="Address*" />
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
    </div>
  );
}

export default Dashboard;
