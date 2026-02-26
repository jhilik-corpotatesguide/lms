// Import routing components
import { Routes, Route } from "react-router-dom";

// Import pages
import Home from "./pages/home/Home";   // Home page
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Course from "./course/Course";

function App() {
  return (
    <div className="app-wrapper">
      <Routes>

        {/* Home page will open first */}
        <Route path="/" element={<Home />} />

        {/* Other pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Course />} />

      </Routes>
    </div>
  );
}

export default App;
