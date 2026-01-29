import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Course from "./course/Course";

function App() {
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Course />} />
        
      </Routes>
    </div>
  );
}

export default App;
