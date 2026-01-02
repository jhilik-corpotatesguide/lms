// Import Login page components
import PhoneCard from "./components/Phonecard";
import LogoCard from "./components/Logocard";

// Import Login page CSS
import "./login.css";

function Login() {
  return (
    // Main background wrapper
    <div className="login-page">

      {/* Bootstrap container */}
      <div className="container h-100 d-flex align-items-center">

        {/* Layout row */}
        <div className="row w-100 align-items-center justify-content-center">

          {/* Left: Phone Card */}
          <div className="col-md-5 d-flex justify-content-center">
            <PhoneCard />
          </div>

          {/* Right: Logo Section */}
          <div className="col-md-5 text-center logo-side">
            <LogoCard />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
