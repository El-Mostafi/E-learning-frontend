import { Link } from "react-router-dom";
import React from "react";
import { UserContext } from "../../context/AuthContext";

// --- Data Configuration ---

const contactInfo = {
  address:
    "National School of Applied Sciences, Avenue My Abdallah Km 5" +
    "\n" +
    "Imouzzer Road, Fez BP 72.",
  email: "help.luminara@gmail.com",
  phone: "+212 626-95-22-47, +212 695-72-25-47",
};

// --- Component Props & Types ---

interface FooterOneProps {
  user: UserContext | null;
}

const FooterOne: React.FC<FooterOneProps> = ({ user }) => {
  const exploreLinks = [
    { text: "All Courses", to: "/courses" },
    { text: "Instructors", to: "/instructor" },
    { text: "About", to: "/about" },
    { text: "Contact Support", to: "/contact" },
  ];

  const quickLinks = [
    { text: "Home", to: "/" },
    { text: "My Courses", to: "/my-courses" },
    { text: "Profile", to: "/profile" },
    { text: user?.role ==="student" ? "Shop Cart" : "FAQs", to: user?.role ==="student" ? "/shop-cart" : "/faq" },
  ];

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
          {user && user.role === "student" && (
            <div className="footer-banner-items">
              <div className="row g-4">
                {/* Welcome Back Banner */}
                <div className="col-lg-6 ">
                  <div className="footer-banner max-h-[334px]">
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
                <div className="col-lg-6 ">
                  <div className="footer-banner style-2 max-h-[334px]">
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
          )}

          {/* Data-Driven Link Section */}
          <div className="footer-widget-wrapper">
            <div className="row">
              {/* Column 1: Brand/Social */}
              <div
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <Link to="/">
                      <img src="assets/img/logo/black-logo.svg" alt="img" />
                    </Link>
                  </div>
                  <div className="footer-content">
                    <p>
                      Education the foundation personal and societal growth,
                      empowering individuals with knowledge.
                    </p>
                    <div className="social-icon">
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-dribbble"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-behance"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
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
                          href={`mailto:helpdesk.elearningapp@gmail.com
`}
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

          
        </div>
      </footer>
    </>
  );
};

export default FooterOne;
