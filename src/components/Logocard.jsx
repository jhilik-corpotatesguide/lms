import logo from "../assets/logo.png";

function LogoCard() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center">
      <img src={logo} alt="Logo" className="logo-img" />
      <h4 className="mt-3 text-primary">
        Welcome to Corporates Guide
      </h4>
      <p className="text-muted">
        Sign in to continue your learning journey
      </p>
    </div>
  );
}

export default LogoCard;