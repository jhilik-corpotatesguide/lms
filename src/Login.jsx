import PhoneCard from "./components/Phonecard";

import LogoCard from "./components/Logocard";
import "./login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-layout">
        
        {/* Left - Card */}
        <div className="left-panel">
          <PhoneCard />
        </div>

        {/* Right - Logo */}
        <div className="right-panel">
          <LogoCard />
        </div>

      </div>
    </div>
  );
}

export default Login;
