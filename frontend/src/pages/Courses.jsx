import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingSlug, setEnrollingSlug] = useState(null);

  const { user, isLoggedIn, setUser } = useAuth();

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (slug) => {
    if (!isLoggedIn) return;

    setEnrollingSlug(slug);

    try {
      const res = await api.post("/user/enroll", {
        course_slug: slug,
      });

      setUser(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Could not enroll");
    } finally {
      setEnrollingSlug(null);
    }
  };

  const isEnrolled = (slug) =>
    user?.enrolled_courses?.includes(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-brand-light text-brand-purple text-xs font-semibold mb-3">
          EXPLORE PROGRAMS
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Our Courses
        </h1>

        <p className="text-gray-500">
          Choose a course and start your learning journey today.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.slug);

            return (
              <div
                key={course.slug}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/course-placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="text-7xl">📘</div>
                  )}

                  {/* Enrolled Badge */}
                  {enrolled && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      ✓ Enrolled
                    </span>
                  )}

                  {/* Duration */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    ⏱ {course.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-6 flex-1">
                    {course.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    {course.certificate && (
                      <div className="flex items-center gap-2">
                        🎓
                        <span>
                          Certificate Awarded by Corporates Guide
                        </span>
                      </div>
                    )}

                    {course.placement_support && (
                      <div className="flex items-center gap-2">
                        💼
                        <span>100% Placement Support</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEnroll(course.slug)}
                    disabled={
                      enrolled ||
                      enrollingSlug === course.slug
                    }
                    className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      enrolled
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : "bg-gradient-to-r from-[#440D70] to-indigo-600 text-white hover:opacity-90 hover:shadow-lg"
                    }`}
                  >
                    {enrolled
                      ? "Enrolled ✓"
                      : enrollingSlug === course.slug
                      ? "Enrolling..."
                      : "Enroll Now →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}