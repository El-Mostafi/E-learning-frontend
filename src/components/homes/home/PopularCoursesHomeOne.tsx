import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  courseDataGenerale,
  coursService,
} from "../../../services/coursService";
import Pagination from "../../pagination/Pagination";

const styles = `
  .icon-items {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .icon-items i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    background-color:rgb(255, 255, 255);
    font-size: 20px;
  }
  .icon-items, .client-img i img {
    border-radius: 50%;
  }
  
  .courses-card-main-items {
    margin-bottom: 30px;
    transition: all 0.3s ease;
    height: 100%;
    position: relative;
    perspective: 1000px;
  }
  
  .courses-card-items {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    transition: all 0.3s ease;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .courses-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }
  
  .course-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;       
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4em;
    max-height: 2.8em;           
    cursor: pointer;
  }

  .course-description {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #666;
    margin: 0.5rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 4.5em;
  }
  
  .post-cat {
    height: 44px;
    margin-bottom: 1rem;
  }
  
  .category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 12px 0 10px 0; /* Added top padding */
    gap: 10px;
    scrollbar-width: thin;
  }
  
  .category-tabs::-webkit-scrollbar {
    height: 4px;
  }
  
  .category-tabs::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .courses-card-items-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    transform: rotateY(180deg);
    backface-visibility: hidden;
    overflow: auto;
  }

  .courses-card-items-hover .courses-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
  }

  .courses-card-main-items:hover .courses-card-items {
    transform: rotateY(180deg);
    opacity: 0;
  }

  .courses-card-main-items:hover .courses-card-items-hover {
    transform: rotateY(0);
    opacity: 1;
    visibility: visible;
  }

  /* Custom scrollbar for hover content */
  .courses-card-items-hover::-webkit-scrollbar {
    width: 4px;
  }

  .courses-card-items-hover::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .courses-card-items-hover::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .courses-card-items-hover {
      position: relative;
      transform: none;
      opacity: 1;
      visibility: visible;
      margin-top: 1rem;
    }

    .courses-card-main-items:hover .courses-card-items {
      transform: none;
      opacity: 1;
    }

    .courses-card-items {
      transform: none;
    }
  }

  /* Theme button styles */
  .theme-btn.yellow-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #ffd700;
    color: #000;
    border-radius: 8px;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
  }

  .theme-btn.yellow-btn:hover {
    background: #ffed4a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
`;

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const remainingAfterHours = totalSeconds % 3600;
  const minutes = Math.floor(remainingAfterHours / 60);
  const seconds = Math.round(remainingAfterHours % 60);

  if (hours > 0) {
    const parts = [];
    parts.push(`${hours}h`);
    if (minutes > 0) {
      parts.push(`${minutes}min`);
    }
    return parts.join(" ");
  } else {
    const parts = [];
    if (minutes > 0) {
      parts.push(`${minutes}min`);
    }
    if (seconds > 0 || totalSeconds === 0) {
      parts.push(`${seconds}s`);
    }
    return parts.join(" ");
  }
};

const PopularCoursesHomeOne = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const pageSize = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, totalCount } = await coursService.getPopularCourses(
          4.0,
        );
        setCourses(data);

        const uniqueCategories = Array.from(
          new Set(data.map((course) => course.category))
        );
        console.log(uniqueCategories);
        setCategories(uniqueCategories);

        setTotalPages(Math.ceil(totalCount / pageSize));
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, selectedCategory, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Stay at the popular courses section after pagination
    const section = document.querySelector(".popular-courses-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
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
            <div className="section-title-area mb-5 d-flex justify-content-between align-items-center flex-wrap">
            <div className="section-title">
              <h6 className="wow fadeInUp">Popular Courses</h6>
              <h2 className="wow fadeInUp" data-wow-delay=".3S">
              Explore Top Popular Courses
              </h2>
            </div>
            <ul
              className="nav category-tabs mt-3 mt-md-0"
              style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
            >
              {["All", ...categories].map((category, index) => (
              <li
                key={index}
                className="nav-item wow fadeInUp"
                data-wow-delay={`${0.2 * (index + 1)}s`}
              >
                <button
                type="button"
                className={`category-tab-btn px-5 py-2 rounded-lg font-semibold border transition-colors duration-200
                ${
                selectedCategory === category
                  ? "bg-blue-500 border-blue-600 text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-blue-100"
                }
              `}
                style={{
                  outline:
                  selectedCategory === category
                    ? "2px solid #3b82f6"
                    : "none",
                  outlineOffset: "2px",
                  zIndex: selectedCategory === category ? 1 : undefined,
                  position: "relative",
                }}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                >
                {category}
                </button>
              </li>
              ))}
            </ul>
            </div>
          <div className="tab-content">
            <div id="All" className="tab-pane fade show active">
              <div className="row">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="col-xl-3 col-lg-6 col-md-6 d-flex"
                  >
                    <div className="courses-card-main-items w-100">
                      <div className="courses-card-items">
                        <div className="courses-image">
                          <img
                            className="pb-3 w-full h-40 object-cover"
                            src={
                              course.thumbnailPreview ||
                              "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600"
                            }
                            alt={`${course.title} thumbnail`}
                          />
                          <h4 className="topic-title">{course.level}</h4>
                          <div className="arrow-items">
                            <div className="GlidingArrow">
                              <img src="assets/img/courses/a1.png" alt="img" />
                            </div>
                            <div className="GlidingArrow delay1">
                              <img src="assets/img/courses/a2.png" alt="img" />
                            </div>
                            <div className="GlidingArrow delay2">
                              <img src="assets/img/courses/a3.png" alt="img" />
                            </div>
                            <div className="GlidingArrow delay3">
                              <img src="assets/img/courses/a4.png" alt="img" />
                            </div>
                            <div className="GlidingArrow delay4">
                              <img src="assets/img/courses/a5.png" alt="img" />
                            </div>
                            <div className="GlidingArrow delay5">
                              <img src="assets/img/courses/a6.png" alt="img" />
                            </div>
                          </div>
                        </div>

                        <div className="courses-content p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {course.title}
                          </h3>
                          <p className="course-description">
                            {course.description.replace(/<\/?[^>]+(>|$)/g, "")}
                          </p>

                          <ul className="post-cat gap-4">
                            <li>
                              <Link to="/courses">{course.category}</Link>
                            </li>
                            <li className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(course.reviews)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </li>
                          </ul>
                          <div className="client-items">
                            <div className="icon-items">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://randomuser.me/api/portraits/men/1.jpg"
                                  }
                                  alt="instructor"
                                />
                              </i>
                            </div>
                            <p>
                              <Link
                                to={`/instructor-details/${course.InstructorId}`}
                              >
                                {course.instructorName?.replace("|", " ") ||
                                  "Unknown Instructor"}
                              </Link>
                            </p>
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
                        </div>
                      </div>

                      <div className="courses-card-items-hover">
                        <div className="courses-content p-4">
                          <ul className="post-cat gap-4">
                            <li>
                              <Link to="/courses">{course.category}</Link>
                            </li>
                            <li className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(course.reviews)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </li>
                          </ul>
                          <h5>
                            <Link
                              to="/courses-details"
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
                            <div className="client-img bg-cover">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://randomuser.me/api/portraits/men/1.jpg"
                                  }
                                  alt="instructor"
                                />
                              </i>
                            </div>
                            <Link
                              to={"/instructor-details/" + course.InstructorId}
                              className={"text-white"}
                            >
                              {course.instructorName?.replace("|", " ") ||
                                "Unknown Instructor"}
                            </Link>
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
                            className="theme-btn yellow-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/courses-details", {
                                state: { courseId: course.id },
                              });
                            }}
                          >
                            Enroll Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularCoursesHomeOne;
