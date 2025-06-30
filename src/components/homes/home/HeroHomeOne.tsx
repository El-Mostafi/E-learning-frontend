import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import reviewService from "../../../services/reviewsService";
import Count from "../../../common/Count";
import { coursService } from "../../../services/coursService";

const HeroHomeOne = () => {
  // --- State Management ---
  const { user } = useAuth();
  const [courseCount, setCourseCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        const [coursesData, reviewsCount] = await Promise.all([
          coursService.getCoursesCount(),
          reviewService.getReviewsCount(),
        ]);

        setCourseCount(coursesData.count);
        setReviewCount(reviewsCount);
      } catch (error) {
        console.error("Failed to fetch hero stats:", error);
      }
    };

    fetchHeroStats();
  }, []); // Empty array ensures this runs only once on mount

  return (
    <>
      <section className="hero-section hero-1 fix">
        <div className="shape-left">
          <img src="assets/img/hero/shape-left.png" alt="" />
        </div>
        <div className="shape-right">
          <img src="assets/img/hero/shape-right.png" alt="" />
        </div>
        <div className="dot-shape float-bob-x">
          <img src="assets/img/hero/dot.png" alt="" />
        </div>
        <div className="vector-shape float-bob-y">
          <img src="assets/img/hero/vectoe.png" alt="" />
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content">
                <span className="wow fadeInUp">
                  Welcome {user ? user.userName.replace("|", " ") : ""} to
                  LUMINARA
                </span>
                <h1 className="wow fadeInUp" data-wow-delay=".3s">
                  Interactive Learning Engaging Students in the Digital Age
                </h1>
                <h3 className="wow fadeInUp" data-wow-delay=".5s">
                  Get{" "}
                  {courseCount > 0
                    ? `${courseCount.toLocaleString()}+`
                    : "Thousands of"}{" "}
                  Best Quality Online Courses
                </h3>
                <div className="hero-button wow fadeInUp" data-wow-delay=".7s">
                  <Link to="/courses" className="theme-btn hover-white">
                    Find Your Best Courses
                  </Link>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="assets/img/hero/hero-1.jpg"
                alt="img"
                className="img-custom-anim-left"
                data-wow-duration="1.5s"
                data-wow-delay="0.3s"
              />

              {/* Dynamic Courses Counter */}
              <div className="counter-box float-bob-x">
                <p>More than</p>
                <h2>
                  <span className="odometer" data-count={courseCount}>
                    {courseCount > 0 && <Count number={courseCount} text="+" />}
                  </span>
                </h2>
                <p>Quality Courses</p>
              </div>

              {/* Dynamic Reviews Counter (Simplified Design) */}
              <div className="rating-box float-bob-y">
                <div className="content">
                  <h2>
                    <span className="odometer" data-count={reviewCount}>
                      {reviewCount > 0 && (
                        <Count number={reviewCount} text="+" />
                      )}
                    </span>
                  </h2>
                  <p>Total Positive Reviews</p> {/* Restored to simple text */}
                </div>
                <img
                  src="assets/img/hero/trustpilot-logopng.png"
                  alt="Trustpilot Logo"
                />
              </div>

              <div className="circle-img float-bob-y">
                <img src="assets/img/hero/circle.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroHomeOne;
