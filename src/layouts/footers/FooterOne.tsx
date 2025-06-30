import { Link } from "react-router-dom";
import React from "react";

// --- Data Configuration ---
const socialLinks = [
  { icon: "fab fa-facebook-f", href: "#" },
  { icon: "fab fa-instagram", href: "#" },
  { icon: "fab fa-linkedin-in", href: "#" },
  { icon: "fab fa-twitter", href: "#" },
];

const exploreLinks = [
  { text: "All Courses", to: "/courses" },
  { text: "My Dashboard", to: "/profile" },
  { text: "Our Instructors", to: "/instructor" },
  { text: "Contact", to: "/contact" },
];

const quickLinks = [
  { text: "Privacy Policy", to: "/privacy-policy" },
  { text: "Terms of Service", to: "/terms" },
  { text: "Edit Profile", to: "/profile/edit" },
  { text: "Contact Support", to: "/contact" },
];

const contactInfo = {
  address:
    "National School of Applied Sciences, Avenue My Abdallah Km 5" +
    "\n" +
    "Imouzzer Road, Fez BP 72.",
  email: "help.LUMINARA@gmail.com",
  phone: "+212 626-95-22-47, +212 695-72-25-47",
};

// --- Component Props & Types ---
interface User {
  userName: string;
}

interface FooterOneProps {
  user: User | null;
}

const FooterOne: React.FC<FooterOneProps> = ({ user }) => {
  return (
    <>
      <footer className="footer-section fix footer-bg">
        {/* Decorative elements */}
        <div className="big-circle">
          <img src="/assets/img/footer/big-circle.png" alt="" />
        </div>
        <div className="circle-shape-2">
          <img src="/assets/img/footer/circle-2.png" alt="" />
        </div>
        <div className="Vector-shape-2">
          <img src="/assets/img/footer/Vector-2.png" alt="" />
        </div>

        <div className="container">
          {/* Personalized Banners */}
          <div className="footer-banner-items">
            <div className="row g-4">
              {/* Welcome Back Banner */}
              <div className="col-lg-6">
                <div className="footer-banner">
                  <div className="content">
                    <h3 className="wow fadeInUp">
                      {user ? (
                        <>
                          Welcome back,{" "}
                          <span style={{ color: "#FFF", fontWeight: 600 }}>
                            {user.userName}
                          </span>
                          !
                        </>
                      ) : (
                        "Your Learning Journey"
                      )}
                    </h3>
                    <p className="wow fadeInUp" data-wow-delay=".3s">
                      Ready to dive back in? Pick up your journey, unlock new
                      achievements, and make today your best learning day yet!
                    </p>
                    <Link
                      to="/profile"
                      className="theme-btn wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      Go to Your Profile
                    </Link>
                  </div>
                  <div className="thumb">
                    <img
                      src="/assets/img/boy-img-2.png"
                      alt="Illustration of a person learning"
                      className="wow fadeInUp"
                      data-wow-delay="0.7s"
                    />
                  </div>
                </div>
              </div>
              {/* Discover Banner */}
              <div className="col-lg-6">
                <div className="footer-banner style-2">
                  <div className="content">
                    <h3 className="wow fadeInUp">
                      Ready for Your Next Adventure?
                    </h3>
                    <p className="wow fadeInUp" data-wow-delay=".3s">
                      Discover trending courses, unlock new skills, and fuel
                      your curiosity. Every day is a chance to learn something
                      extraordinary!
                    </p>
                    <Link
                      to="/courses"
                      className="theme-btn wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      Explore All Courses
                    </Link>
                  </div>
                  <div className="thumb">
                    <img
                      src="/assets/img/boy-img-3.png"
                      alt="Illustration of a person exploring"
                      className="wow img-custom-anim-left"
                      data-wow-duration="1.5s"
                      data-wow-delay="0.3s"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data-Driven Link Section */}
          <div className="footer-widget-wrapper">
            <div className="row">
              {/* Column 1: Brand/Social */}
              <div
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".2s"
              >
                {/* ... content as before ... */}
              </div>

              {/* === THE CORRECTED COLUMNS START HERE === */}

              {/* Column 2: Explore */}
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".4s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Explore</h3>
                  </div>
                  <nav aria-label="Explore LUMINARA">
                    <ul className="list-area">
                      {exploreLinks.map((link, index) => (
                        <li key={index}>
                          <Link to={link.to}>{link.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>{" "}
                {/* <-- This closing div was missing */}
              </div>

              {/* Column 3: Quick Links */}
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".6s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Quick Links</h3>
                  </div>
                  <nav aria-label="Quick Links">
                    <ul className="list-area">
                      {quickLinks.map((link, index) => (
                        <li key={index}>
                          <Link to={link.to}>{link.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>{" "}
                {/* <-- This closing div was missing */}
              </div>

              {/* Column 4: Contact Us */}
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".8s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Contact Us</h3>
                  </div>
                  <address className="footer-content">
                    <ul className="contact-info">
                      <li>
                        <i className="fas fa-map-marker-alt"></i>
                        {contactInfo.address}
                      </li>
                      <li>
                        <i className="fas fa-envelope"></i>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="link"
                        >
                          {contactInfo.email}
                        </a>
                      </li>
                      <li>
                        <i className="fas fa-phone-alt"></i>
                        <a
                          href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                          className="link"
                        >
                          {contactInfo.phone}
                        </a>
                      </li>
                    </ul>
                  </address>
                </div>{" "}
                {/* <-- This closing div was missing */}
              </div>
            </div>
          </div>

          <div className="footer-bottom style-2">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              <Link to="/">LUMINARA</Link>. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterOne;
