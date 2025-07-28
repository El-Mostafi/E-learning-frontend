import { Link } from "react-router-dom";

const FooterTwo = () => {
  return (
    <>
      <footer className="footer-section fix footer-bg">
        <div className="big-circle">
          <img src="assets/img/footer/big-circle.png" alt="img" />
        </div>
        <div className="circle-shape-2">
          <img src="assets/img/footer/circle-2.png" alt="img" />
        </div>
        <div className="Vector-shape-2">
          <img src="assets/img/footer/Vector-2.png" alt="img" />
        </div>
        <div className="container">
          <div className="footer-banner-items ">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="footer-banner">
                  <div className="content" style={{ marginRight: "32px" }}>
                    <h3 className="wow fadeInUp">Become an Instructor</h3>
                    <p
                      className="wow fadeInUp d-flex align-items-center h-100"
                      data-wow-delay=".3s"
                      style={{ minHeight: "120px"}}
                    >
                      Becoming an instructor is a rewarding journey that
                      combines expertise, passion, and the drive to empower
                      others. Share your knowledge, inspire learners, and unlock
                      new opportunities for personal and professional growth.
                    </p>
                    <Link
                      to="/register"
                      className="theme-btn wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="thumb" style={{ marginLeft: "32px" }}>
                    <img
                      src="assets/img/boy-img-2.png"
                      alt="img"
                      className="wow fadeInUp"
                      data-wow-delay="0.7s"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="footer-banner style-2">
                  <div className="content" style={{ marginRight: "32px" }}>
                    <h3 className="wow fadeInUp">Become a Student</h3>
                    <p
                      className="wow fadeInUp"
                      data-wow-delay=".3s"
                    >
                      Becoming a student is a transformative journey that opens
                      the door to endless opportunities for learning, growth,
                      and personal development. Embrace new knowledge and skills
                      to shape your future.
                    </p>
                    <Link
                      to="/register"
                      className="theme-btn wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="thumb" style={{ marginLeft: "32px" }}>
                    <img
                      src="assets/img/boy-img-3.png"
                      alt="img"
                      className="wow img-custom-anim-left"
                      data-wow-duration="1.5s"
                      data-wow-delay="0.3s"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-widget-wrapper">
            <div className="row">
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
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".4s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Online Platform</h3>
                  </div>
                  <ul className="list-area">
                    <li>
                      <Link to="/courses">Coursera</Link>
                    </li>
                    <li>
                      <Link to="/courses">MasterClass</Link>
                    </li>
                    <li>
                      <Link to="/courses">Skillshare</Link>
                    </li>
                    <li>
                      <Link to="/courses">LinkedIn Learning</Link>
                    </li>
                    <li>
                      <Link to="/courses">FutureLearn</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".6s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Quick Link</h3>
                  </div>
                  <ul className="list-area">
                    <li>
                      <Link to="/about">About LUMINARA</Link>
                    </li>
                    <li>
                      <Link to="/instructor">Instructors</Link>
                    </li>
                    <li>
                      <Link to="/courses">Best Courses</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                      <Link to="/faq">FAQs</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp"
                data-wow-delay=".8s"
              >
                <div className="single-footer-widget">
                  <div className="widget-head">
                    <h3>Contact Us</h3>
                  </div>
                  <div className="footer-content">
                    <ul className="contact-info">
                      <li>
                        National School of Applied Sciences, Avenue My Abdallah
                        <br />
                        Km 5, Imouzzer Road, Fez BP 72.
                      </li>
                      <li>
                        National School of Applied Sciences, Avenue My Abdallah
                        <br />
                        Km 5, Imouzzer Road, Fez BP 72.
                      </li>
                      <li>
                        <a
                          href="mailto:helpdesk.elearningapp@gmail.com"
                          className="link"
                        >
                          help.luminara@gmail.com
                        </a>
                      </li>
                      <li>
                        <a href="tel:+212626952247">+212 626-95-22-47</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterTwo;
