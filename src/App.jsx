import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Course from "./course/Course";
import Navbar from "./pages/home/Navbar"; // ✅ Navbar import

function App() {
  return (
    <div className="app-wrapper">

      {/* ✅ Navbar — login আর dashboard বাদে সব page-এ দেখাবে */}
      <Navbar />

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course"    element={<Course />} />
      </Routes>

    </div>
  );
}

export default App;