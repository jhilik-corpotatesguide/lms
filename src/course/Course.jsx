import React, { useState } from "react";
import "./Course.css";

// Import images from assets folder
import javaImg from "../assets/java.png";
import pythonImg from "../assets/python.png";
import goImg from "../assets/go.png";
import springImg from "../assets/spring.png";
import mernImg from "../assets/mern.png";
import mevnImg from "../assets/mevn.png";
import phpImg from "../assets/php.png";
import frontImg from "../assets/front.png";
import dockerImg from "../assets/docker.png";
import angularImg from "../assets/angular.png";
import ionicImg from "../assets/ionic.png";
import databaseImg from "../assets/database.png";
import fullsImg from "../assets/fulls.png";
import wasImg from "../assets/was.png";
import kafImg from "../assets/kaf.png";
import agileImg from "../assets/agile.png";
import pmpImg from "../assets/pmp.png";
import qualityImg from "../assets/quality.png";
import datascinceImg from "../assets/datascince.png";
import applicationImg from "../assets/application.png";
import cloudImg from "../assets/cloud.png";

// Hardcoded course data
const courses = [
  {
    id: 1,
    title: "Java Full Stack",
    description:
      "We offer comprehensive full stack development certified course for college students, interns & professional executives.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: javaImg,
  },
  {
    id: 2,
    title: "Python Full Stack",
    description:
      "In-depth python full stack development certified course for college students, interns & professional executives.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: pythonImg,
  },
  {
    id: 3,
    title: "Go Programming",
    description:
      "Master Go programming to boost your team's efficiency and performance with our expert-led corporate training courses.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: goImg,
  },
  {
    id: 4,
    title: "Spring Boot with REST API",
    description:
      "Enhance your team's backend development skills with our Spring Boot with REST API corporate training course designed for students & professional executives.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: springImg,
  },
  {
    id: 5,
    title: "MERN Developer [Internships/On Job Training for College Students Provided]",
    description:
      "Equip your team with full-stack development expertise through our MERN corporate training, covering MongoDB, Express.js, React, and Node.js.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: mernImg,
  },
  {
    id: 6,
    title: "MEVN Developer [Internships/On Job Training for College Students Provided]",
    description:
      "Upskill your team with comprehensive full-stack development skills through our MEVN corporate training, focusing on MongoDB, Express.js, Vue.js, and Node.js.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: mevnImg,
  },
  {
    id: 7,
    title: "PHP [Internships/On Job Training for College Students Provided]",
    description:
      "Elevate your web development capabilities with our PHP corporate training course.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: phpImg,
  },
  {
    id: 8,
    title: "Front End Developer (JavaScript, Typescript, HTML, and CSS)",
    description:
      "Upgrade your front-end development skills with our JavaScript, HTML, and CSS corporate training course.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: frontImg,
  },
  {
    id: 9,
    title: "Docker and Kubernetes",
    description:
      "Boost your team's DevOps proficiency with our Docker and Kubernetes corporate training.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: dockerImg,
  },
  {
    id: 10,
    title: "Angular",
    description:
      "Upgrade front-end development skills with our Angular corporate training course.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: angularImg,
  },
  {
    id: 11,
    title: "Ionic Framework [Internships/On Job Training for College Students Provided]",
    description:
      "Enhance your mobile app development skills with our Ionic Framework corporate training course.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: ionicImg,
  },
  {
    id: 12,
    title: "Database Expert [MySQL, PostgreSQL, and Redis]",
    description:
      "Strengthen your team's database management skills with our MySQL, PostgreSQL, and Redis corporate training.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: databaseImg,
  },
  {
    id: 13,
    title: "Full-Stack Development Bootcamps",
    description:
      "Outcome-Driven Full-Stack Development Bootcamps, offering targeted, hands-on training in key technology stacks.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: fullsImg,
  },
  {
    id: 14,
    title: "Cloud Computing – AWS & Azure",
    description:
      "Empower your career with cloud expertise through our AWS and Azure corporate training course.",
    duration: "3 Months",
    certificate: "Certificate Assured by Corporates Guide / AWS / Azure",
    placement: "Placement Support Provided for this course.",
    image: cloudImg,
  },
  {
    id: 15,
    title: "WAS WebLogic",
    description:
      "Enhance your team's server management skills with our WAS WebLogic corporate training.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: wasImg,
  },
  {
    id: 16,
    title: "Kafka Confluent",
    description:
      "Upgrade your team's data streaming capabilities with our Kafka Confluent corporate training course.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: kafImg,
  },
  {
    id: 17,
    title: "Agile (Non-technical)",
    description:
      "Transform your team's project management approach with our Agile corporate training.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: agileImg,
  },
  {
    id: 18,
    title: "PMP (Non-technical)",
    description:
      "Flexible corporate training course for effectively planning, executing, and closing projects.",
    duration: "As per requirement",
    certificate: "Certificate Assured by Corporate Guide.",
    image: pmpImg,
  },
  {
    id: 19,
    title: "Quality Analyst/Testing Bootcamps",
    description:
      "Elevate your team's technical skills with our Quality Analyst/Testing Bootcamps designed for students & professionals.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: qualityImg,
  },
  {
    id: 20,
    title: "Data Science [Internships/On Job Training for College Students Provided]",
    description:
      "Unlock the power of data with our comprehensive Data Science course designed for professionals.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    image: datascinceImg,
  },
  {
    id: 21,
    title: "Application Performance Management",
    description:
      "We offer comprehensive learning programs on CISCO AppDynamics, Grafana, Manage Engine OPManager, Zabbix 7, and more.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporates Guide / AWS / Azure",
    placement: "Placement Support Provided for this course.",
    image: applicationImg,
  },
];

export default function Course() {

  // ✅ localStorage থেকে user info নাও
  const userName  = localStorage.getItem("user_name")  || "";
  const userEmail = localStorage.getItem("user_email") || "";

  // Profile dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle enroll click
  const handleEnroll = (courseName) => {
    alert(`Enroll request submitted for: ${courseName}`);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  // Avatar — নামের প্রথম অক্ষর দেখাবে
  const avatar = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <div className="course-page">

      

          
      {/* Page Title */}
      <h1 className="course-page-title">Academics</h1>

      {/* Course Grid */}
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">

            {/* Course Image */}
            <img
              src={course.image}
              alt={course.title}
              className="course-image"
            />

            {/* Course Content */}
            <div className="course-content">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              <p className="course-info"><strong>Duration:</strong> {course.duration}</p>
              <p className="course-info">{course.certificate}</p>
              {course.placement && (
                <p className="course-info">{course.placement}</p>
              )}

              {/* Enroll Button */}
              <div className="enroll-center">
                <button
                  className="enroll-btn"
                  onClick={() => handleEnroll(course.title)}
                >
                  Enroll Now
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}