import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a1229] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Contact */}
        <div>
          <img
            src="/logo.jpg"
            alt="Corporates Guide Logo"
            className="h-20 w-auto object-contain mb-5"
          />

          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <PhoneIcon />
              <span>+91 6289597268 (Corporate)</span>
            </div>

            <div className="flex items-start gap-3">
              <PhoneIcon />
              <span>+91 6290597268 (Institutional)</span>
            </div>

            <div className="flex items-start gap-3">
              <LocationIcon />
              <span>
                56/2F, Santosh Roy Road, Sakher Bazar,
                Barisha, Kolkata - 700008
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MailIcon />
              <span>support@corporatesguide.com</span>
            </div>

            <div className="flex items-start gap-3">
              <MailIcon />
              <span>training@corporatesguide.com</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 transition flex items-center justify-center"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 transition flex items-center justify-center"
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-300">

            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>

            <li>
              <Link to="/courses" className="hover:text-white">
                Courses
              </Link>
            </li>

          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-5">
            About Corporates Guide
          </h3>

          <p className="text-gray-300 leading-7 text-sm">
            Corporates Guide is a professional IT training institute helping
            students and working professionals build future-ready skills
            through practical training, internships, workshops and real
            industry exposure.
          </p>

          <div className="mt-6">
  <img
    src="/images/msme-iso.png"
    alt="MSME & ISO Certification"
    className="w-full max-w-xs object-contain"
  />
</div>
        </div>

      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Corporates Guide. All Rights Reserved.
      </div>
    </footer>
  );
}

/* ---------------- Icons ---------------- */

function PhoneIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22 12a10 10 0 10-11.5 9.87v-6.98H7.9V12h2.6V9.8c0-2.57 1.53-4 3.87-4 1.12 0 2.3.2 2.3.2v2.5h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.89h-2.4v6.98A10 10 0 0022 12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}