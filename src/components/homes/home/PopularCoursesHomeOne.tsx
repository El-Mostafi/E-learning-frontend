import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { coursService } from "../../../services/coursService";
import { courseDataGenerale } from "../../../services/coursService";
import { useNavigate } from "react-router-dom";

const styles = `
  .courses-card-main-items {
    position: relative;
    overflow: hidden;
    min-height: 450px;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .courses-card-items {
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .courses-image {
    height: 200px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .courses-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .courses-card-items-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease-in-out;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    z-index: 2;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .courses-card-main-items:hover .courses-card-items-hover {
    opacity: 1;
    visibility: visible;
  }

  .courses-card-main-items:hover .courses-card-items {
    opacity: 0;
  }

  .courses-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 15px 0 10px;
    padding: 0 15px;
    min-height: 3.6em;
    line-height: 1.3;
    font-size: 1.2rem;
  }

  .topic-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 15px 10px;
    min-height: 3em;
    color: #666;
    font-size: 0.9rem;
  }

  .courses-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 15px 15px;
  }

  .theme-btn.yellow-btn {
    display: inline-block;
    padding: 12px 30px;
    background: #f9b234;
    color: #fff !important;
    border-radius: 5px;
    margin-top: auto;
    align-self: flex-start;
    text-decoration: none;
    transition: background 0.3s ease;
  }

  .theme-btn.yellow-btn:hover {
    background: #e89e20;
  }

  .client-items {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
  }

  .client-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
  }

  .post-class {
    display: flex;
    justify-content: space-between;
    margin: 15px 0 0;
    padding: 0;
    list-style: none;
    font-size: 0.85rem;
    color: #666;
  }

  .post-cat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 10px;
    padding: 0;
    list-style: none;
  }

  .arrow-items {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
  }

  .GlidingArrow {
    transition: transform 0.3s ease;
  }
`;

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const PopularCoursesHomeOne = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursService.getGeneralDataCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <section className="popular-courses-section fix section-padding section-bg">
        <div className="container">
          <div className="section-title-area align-items-end">
            <div className="section-title">
              <h6 className="wow fadeInUp">Popular Courses</h6>
              <h2 className="wow fadeInUp" data-wow-delay=".3S">
                Explore Top Courses
              </h2>
            </div>
            <ul className="nav">
              {["All", ...categories].map((category, index) => (
                <li
                  key={index}
                  className={`nav-item wow fadeInUp ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  data-wow-delay={`${0.2 * (index + 1)}s`}
                >
                  <a
                    href="#"
                    data-bs-toggle="tab"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category);
                    }}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="tab-content">
            <div id="All" className="tab-pane fade show active">
              <div className="row">
                {filteredCourses.map((course, index) => (
                  <div
                    className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                    data-wow-delay={`${0.2 * (index + 1)}s`}
                    key={course.id}
                  >
                    <div className="courses-card-main-items">
                      <div className="courses-card-items">
                        <div className="courses-image">
                          <img
                            src={
                              course.thumbnailPreview ||
                              "assets/img/courses/default.jpg"
                            }
                            alt={course.title}
                          />
                          <div className="arrow-items">
                            {[1, 2, 3, 4, 5, 6].map((delay) => (
                              <div
                                key={delay}
                                className={`GlidingArrow ${
                                  delay > 1 ? `delay${delay - 1}` : ""
                                }`}
                              >
                                <img
                                  src={`assets/img/courses/a${delay}.png`}
                                  alt="arrow"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <h3 className="courses-title">{course.title}</h3>
                        <h4 className="topic-title">
                          {course.description.replace(/<\/?[^>]+(>|$)/g, "").length > 50
                          ? `${course.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 50)}...`
                          : course.description.replace(/<\/?[^>]+(>|$)/g, "")}
                        </h4>
                        <div className="courses-content">
                          <ul className="post-cat">
                            <li>
                              <Link to="/courses">{course.category}</Link>
                            </li>
                            <li className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < course.reviews
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </li>
                          </ul>
                          <div className="client-items">
                            <div
                              className="client-img bg-cover"
                              style={{
                                background: `url(${course.instructorImg})`,
                              }}
                            ></div>
                            <p>{course.instructorName}</p>
                          </div>
                          <ul className="post-class">
                            <li>
                              <i className="far fa-books"></i>
                              Lessons
                            </li>
                            <li>
                              <i className="far fa-user"></i>
                              {course.students} Students
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="courses-card-items-hover">
                        <div className="courses-content">
                          <ul className="post-cat">
                            <li>
                              <Link to="/courses">{course.category}</Link>
                            </li>
                            <li>
                              {Array.from({ length: course.reviews }).map(
                                (_, i) => (
                                  <i key={i} className="fas fa-star"></i>
                                )
                              )}
                            </li>
                          </ul>
                          <h5>
                            <Link to="/courses-details/${course.id}"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/courses-details", {
                                state: { courseId: course.id },
                              });
                            }}
                            >
                              Learn With {course.title}
                            </Link>
                          </h5>
                          <h4>${course.price}</h4>
                            <span>
                            {course.description.replace(/<\/?[^>]+(>|$)/g, "")}
                            </span>
                          <div className="client-items">
                            <div
                              className="client-img bg-cover"
                              style={{
                                background: `url(${course.instructorImg})`,
                              }}
                            ></div>
                            <p>{course.instructorName}</p>
                          </div>
                          <ul className="post-class">
                            <li>
                              <i className="far fa-clock"></i>
                              {formatDuration(course.duration)}
                            </li>
                            <li>
                              <i className="far fa-user"></i>
                              {course.students} Students
                            </li>
                          </ul>
                          <Link
                            to="/courses-details"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/courses-details", {
                                state: { courseId: course.id },
                              });
                            }
}
                            className="theme-btn yellow-btn"
                          >
                            Enroll Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularCoursesHomeOne;