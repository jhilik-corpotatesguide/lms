import React, { useState, useEffect } from "react";
import "./Course.css";

import frontendImg from "../assets/frontend.png";
import backendImg  from "../assets/backend.png";
import mlImg       from "../assets/ml.png";
import dataImg     from "../assets/data.png";
import testingImg  from "../assets/testing.png";

const courses = [
  { id: 1, title: "Frontend Development", description: "Master HTML, CSS, JavaScript, and React to build modern, responsive web applications from scratch.", duration: "2 Months", certificate: "Certificate Assured by Corporate Guide.", placement: "Placement Support Provided.", image: frontendImg },
  { id: 2, title: "Backend Development", description: "Learn server-side programming with Node.js, Express, REST APIs, and database integration.", duration: "2 Months", certificate: "Certificate Assured by Corporate Guide.", placement: "Placement Support Provided.", image: backendImg },
  { id: 3, title: "Machine Learning", description: "Dive into ML algorithms, model training, and real-world AI applications using Python and scikit-learn.", duration: "2.5 Months", certificate: "Certificate Assured by Corporate Guide.", placement: "Placement Support Provided.", image: mlImg },
  { id: 4, title: "Data Analysis", description: "Analyze and visualize data using Python, Pandas, NumPy, and Matplotlib to drive business decisions.", duration: "2 Months", certificate: "Certificate Assured by Corporate Guide.", placement: "Placement Support Provided.", image: dataImg },
  { id: 5, title: "Automation Testing", description: "Learn Selenium, pytest, and CI/CD pipelines to automate software testing like a professional.", duration: "2 Months", certificate: "Certificate Assured by Corporate Guide.", placement: "Placement Support Provided.", image: testingImg },
];

const BASE_URL = `http://${window.location.hostname}:5000`;

export default function Course() {
  const userName  = localStorage.getItem("user_name")  || "";
  const userEmail = localStorage.getItem("user_email") || "";
  const userId    = localStorage.getItem("user_id")    || "";

  const [popupMsg,        setPopupMsg]        = useState("");
  const [popupType,       setPopupType]       = useState("");
  const [enrollingId,     setEnrollingId]     = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // ── Page load এ enrolled courses fetch ──
  useEffect(() => {
    if (!userId) return;
    fetch(`${BASE_URL}/user-enrollments/${userId}`)
      .then(res => res.json())
      .then(data => {
        const ids = (data.enrolled_courses || []).map(c => String(c.course_id));
        setEnrolledCourses(ids);
      })
      .catch(() => {});
  }, [userId]);

  const isEnrolled    = (courseId) => enrolledCourses.includes(String(courseId));
  const hasAnyEnrolled = enrolledCourses.length > 0;

  const showPopup = (msg, type = "success") => {
    setPopupMsg(msg);
    setPopupType(type);
    setTimeout(() => setPopupMsg(""), 3500);
  };

  const handleEnroll = async (course) => {
    if (!userId) {
      showPopup("Please login first! ❌", "error");
      return;
    }

    // ✅ আগে enrolled হলে
    if (isEnrolled(course.id)) {
      showPopup(`You are already enrolled in "${course.title}" ✅`, "info");
      return;
    }

    // ✅ অন্য course এ enrolled হলে
    if (hasAnyEnrolled) {
      showPopup("You can only enroll in 1 course. You already have an active enrollment! ❌", "error");
      return;
    }

    setEnrollingId(course.id);
    try {
      const res = await fetch(`${BASE_URL}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id    : userId,
          course_id  : course.id,
          course_name: course.title,
        }),
      });
      const data = await res.json();

      if (data.message === "ENROLLED") {
        setEnrolledCourses(prev => [...prev, String(course.id)]);
        showPopup(`Successfully enrolled in "${course.title}"! 🎉`, "success");
      } else if (data.message === "ALREADY_ENROLLED") {
        setEnrolledCourses(prev => [...prev, String(course.id)]);
        showPopup(`Already enrolled in "${course.title}" ✅`, "info");
      } else {
        showPopup("Something went wrong. Try again ❌", "error");
      }
    } catch {
      showPopup("Cannot connect to server ❌", "error");
    } finally {
      setEnrollingId(null);
    }
  };

  // ── Button text ও style decide করো ──
  const getButtonState = (course) => {
    if (isEnrolled(course.id)) {
      return { text: "✅ Already Enrolled", cls: "enrolled", disabled: true };
    }
    if (hasAnyEnrolled) {
      return { text: "🔒 Not Available", cls: "locked", disabled: true };
    }
    if (enrollingId === course.id) {
      return { text: "Enrolling...", cls: "", disabled: true };
    }
    return { text: "Enroll Now →", cls: "", disabled: false };
  };

  return (
    <div className="course-page">

      {/* ── Popup ── */}
      {popupMsg && (
        <div className={`enroll-popup ${popupType}`}>{popupMsg}</div>
      )}

      {/* ── Title ── */}
      <h1 className="course-page-title">Our Courses</h1>
      <p className="course-page-sub">Choose a course and start your learning journey today</p>

      {/* ── Grid ── */}
      <div className="course-grid">
        {courses.map((course) => {
          const btn = getButtonState(course);
          return (
            <div key={course.id} className="course-card">
              <div className="course-img-wrap">
                <img src={course.image} alt={course.title} className="course-image" />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-tags">
                  <span className="tag">⏱ {course.duration}</span>
                  <span className="tag">🏆 {course.certificate}</span>
                  <span className="tag">💼 {course.placement}</span>
                </div>
                <button
                  className={`enroll-btn ${btn.cls}`}
                  onClick={() => handleEnroll(course)}
                  disabled={btn.disabled}
                >
                  {btn.text}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}