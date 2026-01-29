import React from "react";
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


// Hardcoded course data (Easy to add more)
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
      "Master Go programming to boost your team’s efficiency and performance with our expert-led corporate training courses.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: goImg,
  },
  {
    id: 4,
    title: "Spring Boot with REST API",
    description:
      "Enhance your team’s backend development skills with our Spring Boot with REST API corporate training course designed for students & professional executives. Learn from hands-on experience in building robust, scalable, and efficient RESTful API.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: springImg,
  },
  {
id: 5,
    title: "MERN Developer [Internships/On Job Training for College Students Provided]",
    description:
      "Equip your team with full-stack development expertise through our MERN corporate training, covering MongoDB, Express.js, React, and Node.js to build powerful, scalable web applications. Flexible course for college students, interns & professional executives.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: mernImg,
  },
  {
    id: 6,
    title: "MEVN Developer [Internships/On Job Training for College Students Provided]",
    description:
      "Upskill your team with comprehensive full-stack development skills through our MEVN corporate training, focusing on MongoDB, Express.js, Vue.js, and Node.js to create dynamic and efficient web applications. Flexible course for college students, interns & professional executives.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    image: mevnImg,
  },
  {
   id: 7,
    title: "PHP[Internships/On Job Training for College Students Provided]",
    description:
      "Elevate your web development capabilities with our PHP corporate training course, offering in-depth knowledge and practical skills for building robust and dynamic server-side applications. Flexible course for college students, Interns & professional executives.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    image: phpImg, 
  },
  {
    id: 8,
    title: "Front End Developer (JavaScript, Typescript, HTML, and CSS), [Internships/On Job Training for College Students Provided]",
    description:
      "Upgrade your front-end development skills with our JavaScript, HTML, and CSS corporate training course, providing essential expertise to create interactive, responsive, and visually appealing web pages.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    
    image: frontImg, 
  },
  {
   id: 9,
    title: "Docker and Kubernetes",
    description:
      "Boost your team’s DevOps proficiency with our Docker and Kubernetes corporate training, equipping them with the skills to containerize applications and manage scalable, high-availability environments. Certified course for college students, Intern & executives.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: dockerImg,  
  },
  {
    id: 10,
    title: "Angular",
    description:
      "Upgrade front-end development skills with our Angular corporate training course, focusing on building dynamic, scalable, and high-performance web applications using the Angular framework, full certified course for college students and professional executives.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
   
    
    image: angularImg, 
  },
  {
    id: 11,
    title: "Ionic Framework [Internships/On Job Training for College Students Provided]",
    description:
      "Enhance your mobile app development skills with our Ionic Framework corporate training course, providing the knowledge to create cross-platform, high-performance mobile applications using web technologies. Flexible course college students, interns & professional executives.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
   
    
    image: ionicImg, 
  },
  {
     id: 12,
    title: "Database Expert [MySQL, PostgreSQL, and Redis], [Internships/On Job Training for College Students Provided]",
    description:
      "Strengthen your team’s database management skills with our MySQL, PostgreSQL, and Redis corporate training, covering essential techniques for efficient data storage, retrieval, and performance optimization.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
   
    
    image: databaseImg,
  },
  {
    id: 13,
    title: "Full-Stack Development Bootcamps, [Internships/On Job Training for College Students Provided]",
    description:
      "Outcome-Driven Full-Stack Development Bootcamps, offering targeted, hands-on training in key technology stacks over 2 months. Gain practical skills and certification guidance for industry-recognized credentials, with flexible scheduling available throughout the year.",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    
    image: fullsImg,
  },
  {
    id: 14,
    title: "Cloud Computing – AWS & Azure [Internships/On Job Training for College Students Provided]",
    description:
      "Empower your career with cloud expertise through our AWS and Azure corporate training course, offering comprehensive skills for managing, deploying, and optimizing scalable cloud solutions across leading platforms.",
    duration: "3 Months",
    certificate: "Certificate Assured by Corporates Guide / AWS / Azure",
    placement: "Placement Support Provided for this course.",
    
    image: cloudImg,
  },
  {
id: 15,
    title: "WAS WebLogic",
    description:
      "Enhance your team’s server management skills with our WAS WebLogic corporate training, providing in-depth knowledge for efficiently deploying, configuring, and optimizing WebLogic Server environments.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: wasImg,
  },
  {
    id: 16,
    title: "Kafka Confluent",
    description:
      "Upgrade your team’s data streaming capabilities with our Kafka Confluent corporate training course, offering hands-on experience in building and managing real-time data pipelines using Confluent’s robust Kafka ecosystem.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: kafImg,
  },
  {
 id: 17,
    title: "Agile (Non-technical)",
    description:
      "Transform your team’s project management approach with our Agile corporate training, providing essential skills and practices for adopting Agile methodologies to enhance collaboration, flexibility, and project efficiency. flexible online and offline training available for professionals.",
    duration: "1 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: agileImg,
  },
  {
    id: 18,
    title: "PMP (Non-technical)",
    description:
      "Flexible corporate training course, delivering essential techniques and knowledge for effectively planning, executing, and closing projects to achieve strategic goals.",
    duration: "As per requirement",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: pmpImg,
  },
  {
    id: 19,
    title: "Quality Analyst/Testing Bootcamps [Internships/On Job Training for College Students Provided]",
    description:
      "Elevate your team’s technical skills with our Quality Analyst/Testing Bootcamps designed for students & professionals. This intensive training program provides in-depth knowledge and hands-on experience in software testing, quality assurance methodologies, and industry best practices..",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    placement: "Placement Support Provided for this course.",
    
    image: qualityImg,
  },
  {
    id: 20,
    title: "Data Science [Internships/On Job Training for College Students Provided]",
    description:
      "Unlock the power of data with our comprehensive Data Science course designed for professionals. This program covers the entire data science lifecycle, including data collection, cleaning, analysis, visualization, and machine learning model deployment. Participants will gain hands-on experience with tools and technologies such as Python, Pandas, TensorFlow, and cloud platforms like AWS and Azure.",
    duration: "2.5 Months",
    certificate: "Certificate Assured by Corporate Guide.",
    
    
    image: datascinceImg,
  },
  {
   id: 21,
    title: "Application Performance Management",
    description:
      "We offer comprehensive learning programs on CISCO AppDynamics Core APM (Design/Deploy/Administer), Grafana, Manage Engine OPManager with Network Monitoring, Zabbix 7 Application and Network Monitoring, Network Administration with Computer Networking Essentials, CISCO SD-WAN, TCP/IP 2024, Network Application with Python 3, and ForeScout Network Access Control-Admin training. Flexible for students & professionals",
    duration: "2 Months",
    certificate: "Certificate Assured by Corporates Guide / AWS / Azure",
    placement: "Placement Support Provided for this course.",
    
    image: applicationImg, 
  }




];

export default function Course() {

  // Handle enroll click
  const handleEnroll = (courseName) => {
    alert(`Enroll request submitted for: ${courseName}`);
  };

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

              <p className="course-info">
                <strong>Duration:</strong> {course.duration}
              </p>

              <p className="course-info">{course.certificate}</p>

              <p className="course-info">{course.placement}</p>

              {/* Center Enroll Button */}
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
