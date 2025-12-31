import PhoneCard from "./components/Phonecard";
import LogoCard from "./components/Logocard"

function Login() {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center bg-light">
      <div className="row w-100 justify-content-center align-items-center">

        {/* LEFT CARD */}
        <div className="col-md-4 d-flex justify-content-center">
          <PhoneCard />
        </div>

        {/* SMALL GAP */}
        <div className="col-md-1"></div>

        {/* RIGHT CARD */}
        <div className="col-md-4">
          <LogoCard />
        </div>

      </div>
    </div>
  );
}

export default Login;
