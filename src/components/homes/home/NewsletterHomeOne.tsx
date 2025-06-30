import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// Assuming you have this service from the previous steps
import reviewService from "../../../services/reviewsService";

const NewsletterHomeOne = () => {
  // State to hold the dynamic student/review count
  const [studentCount, setStudentCount] = useState<number>(0);

  // Fetch the count when the component mounts
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const count = await reviewService.getReviewsCount();
        setStudentCount(count);
      } catch (error) {
        console.error("Failed to fetch student count:", error);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <>
      <section className="cta-newsletter-section fix blue-bg">
        {/* Decorative images remain the same */}
        <div
          className="girl-shape animation__arryLeftRight wow img-custom-anim-left"
          data-wow-duration="1.5s"
          data-wow-delay="0.3s"
        >
          {/* <img src="assets/img/cta/girl-img.png" alt="" /> */}
        </div>
        <div className="shape-1">
          <img src="assets/img/cta/shape-1.png" alt="" />
        </div>
        <div className="shape-2">
          <img src="assets/img/cta/shape-2.png" alt="" />
        </div>

        <div className="container">
          <div className="cta-newsletter-wrapper">
            <div className="section-title text-center">
              {/* Updated heading text */}
              <h6 className="text-white wow fadeInUp">Join Our Community</h6>
              <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                Get Started With LUMINARA <br />
                to Brighten Your Career!
              </h2>
            </div>

            {/* The form is replaced with this centered button wrapper */}
            <div
              className="cta-button-wrapper text-center wow fadeInUp"
              data-wow-delay=".5s"
            >
              <Link to="/register" className="theme-btn yellow-btn">
                Get Started Today
              </Link>
            </div>

            <ul className="list-items wow fadeInUp" data-wow-delay=".7s">
              <li>
                <i className="far fa-check-circle"></i>
                Positive Reviews
              </li>
              <li>
                <i className="far fa-check-circle"></i>
                Professional Instructors
              </li>
              <li>
                <i className="far fa-check-circle"></i>
                {/* The student count is now dynamic */}
                {studentCount > 0
                  ? `${studentCount.toLocaleString()}+`
                  : "Thousands of"}{" "}
                Happy Students
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsletterHomeOne;
