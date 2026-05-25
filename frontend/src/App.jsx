import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home      from "./pages/home/Home";
import Login     from "./Login";
import Dashboard from "./pages/Dashboard";
import Course    from "./course/Course";
import Navbar    from "./pages/home/Navbar";
import Footer    from "./pages/home/Footer";

// ── 1 ঘন্টা পর auto logout ──
function useAutoLogout() {
  useEffect(() => {
    const loginTime = localStorage.getItem("login_time");
    if (!loginTime) return;

    const elapsed   = Date.now() - parseInt(loginTime);
    const oneHour   = 60 * 60 * 1000;
    const remaining = oneHour - elapsed;

    if (remaining <= 0) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      localStorage.clear();
      window.location.href = "/login";
    }, remaining);

    return () => clearTimeout(timer);
  }, []);
}

function App() {
  const location = useLocation();

  useAutoLogout(); // ✅ auto logout

  // এই page গুলোতে Navbar/Footer দেখাবে না
  const hideNavOn = ["/login", "/dashboard"];

  return (
    <div className="app-wrapper">

      {/* ✅ course page এ Navbar দেখাবে না — Course এর নিজের navbar আছে */}
      {!hideNavOn.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course"    element={<Course />} />
      </Routes>

      {!hideNavOn.includes(location.pathname) && <Footer />}

    </div>
  );
}

export default App;