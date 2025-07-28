import { Link } from "react-router-dom";
import MobileMenu from "../layouts/headers/MobileMenu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OffCanvas = ({ setOpenCanvas, openCanvas }: any) => {
  return (
    <>
      <div className="fix-area">
        <div className={`offcanvas__info ${openCanvas ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/">
                    <img
                      src="assets/img/logo/black-logo.svg"
                      alt="logo-img"
                    />
                  </Link>
                </div>
                <div
                  className="offcanvas__close"
                  onClick={() => setOpenCanvas(false)}
                >
                  <button title="Close">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <h3 className="offcanvas-title">Hello There!</h3>
              <p>
                {" "}
                Welcome to E-learning platform <br /> We are here to help you{" "}
              </p>
              <div className="social-icon d-flex align-items-center">
                <a href="https://www.facebook.com">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.twitter.com">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.youtube.com">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.linkedin.com">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div className="mobile-menu fix mb-3 mean-container">
                <MobileMenu />
              </div>
              <div className="offcanvas__contact">
                <h3>Information</h3>
                <ul className="contact-list">
                  <li>
                    <span>Call Us:</span>
                    <a href="tel:+212695722547">+212 695-72-25-47</a>
                  </li>
                  <li>
                    <span>Email:</span>
                    <a href="mailto:helpdesk.elearningapp@gmail.com">
                      help.luminara@gmail.com
                    </a>
                  </li>
                </ul>
                <div className="offcanvas-button">
                  <Link to="/sign-in" className="theme-btn style-2">
                    <i className="far fa-sign-in"></i> SignIn
                  </Link>
                  <Link to="/register" className="theme-btn yellow-btn">
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${openCanvas ? "overlay-open" : ""}`}
        onClick={() => setOpenCanvas(false)}
      ></div>
    </>
  );
};

export default OffCanvas;
