import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Background Layer */}
      <div className="bg-layer"></div>

      {/* Registration Card */}
      <div className="dashboard-card">

        <h2 className="create-titleh2">Welcome new user !</h2>

        <h3 className="create-title">Create Account</h3>
        <p>Please fill in the details to register</p>

        <input type="text" placeholder="Full Name*" />
        <input type="text" placeholder="Address*" />
        <input type="email" placeholder="Email Address*" />
        <input type="number" placeholder="Phone Number*" />

        <div className="options">
          <label>
            <input type="checkbox" /> I agree to the Terms & Conditions
          </label>
        </div>

        <button className="login-btn">Register</button>

        <div className="divider">OR</div>

        <button className="social">Register with Google</button>
        <button className="social">Register with LinkedIn</button>

      </div>
    </div>
  );
}

export default Dashboard;
