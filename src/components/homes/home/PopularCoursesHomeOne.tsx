import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { coursService } from "../../../services/coursService";
import { courseDataGenerale } from "../../../services/coursService";

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
            transition: transform 0.3s ease;
          }
          
          .courses-card-items {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
          .post-cat{
            height: 44px;
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
                {filteredCourses.map((course) => (
                  <div key={course.id} className="col-xl-3 col-lg-6 col-md-6">
                    <div className="courses-card-main-items">
                      <div className="courses-card-items ">
                        <div className="courses-image">
                          <img
                            className="pb-3"
                            src={
                              course.thumbnailPreview ||
                              "assets/img/courses/01.jpg"
                            }
                            alt="course thumbnail"
                          />
                          {/* <h3 className="courses-title">{course.title}</h3> */}
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
                        <h3 className="courses-title">{course.title}</h3>
                        <h4 className="topic-title">
                          {course.description.replace(/<\/?[^>]+(>|$)/g, "").length > 50
                          ? `${course.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 50)}...`
                          : course.description.replace(/<\/?[^>]+(>|$)/g, "")}
                        </h4>
                        <div className="courses-content">
                          <ul className="post-cat gap-4">
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
                              <div className="course-title">
                                Learn With {course.level} {course.title} Course
                              </div>
                            </Link>
                          </h5>
                          <div className="client-items">
                            <div className="icon-items">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "assets/img/courses/c1.jpg"
                                  }
                                  alt="img"
                                />
                              </i>
                            </div>
                            <p>
                              <Link
                                to={`/instructor-details/${course.InstructorId}`}
                              >
                                {course.instructorName?.replace("|", " ") || "Unknown Instructor"}
                              </Link>
                            </p>
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
                          <ul className="post-cat gap-4">
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
                            <div className="client-img bg-cover">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "assets/img/courses/c1.jpg"
                                  }
                                  alt="img"
                                />
                              </i>
                            </div>
                            <Link
                              to={"/instructor-details/" + course.InstructorId}
                              className={"text-white"}
                            >
                              {course.instructorName?.replace("|", " ") || "Unknown Instructor"}
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularCoursesHomeOne;
