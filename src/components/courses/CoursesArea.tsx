import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseDataGenerale } from "../../services/coursService";
import { Star } from "lucide-react";

const CoursesArea = () => {
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("01");

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursService.getGeneralDataCourses();
        setCourses(response);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const selectHandler = (item: Option, value: string) => {
    setSortBy(value);
    const sortedCourses = [...courses];
    console.log(item, sortBy);

    switch (value) {
      case "02":
        sortedCourses.sort((a, b) => b.students - a.students);
        break;
      case "03":
        sortedCourses.sort((a, b) => b.reviews - a.reviews);
        break;
      case "04":
        sortedCourses.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        sortedCourses.sort((a, b) => a.id.localeCompare(b.id));
    }

    setCourses(sortedCourses);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
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
          .icon-items i img {
            border-radius: 50%;
          }
          
        `}
      </style>
      <section className="popular-courses-section fix section-padding">
        <div className="container">
          <div className="coureses-notices-wrapper">
            <div className="courses-showing">
              <div className="icon-items">
                <Link to="/courses-grid">
                  <i className="fas fa-th"></i>
                </Link>
                <Link to="/courses-list">
                  <i className="fas fa-bars"></i>
                </Link>
              </div>
              <h5>
                Showing{" "}
                <span>
                  {indexOfFirstCourse + 1}-
                  {Math.min(indexOfLastCourse, courses.length)}
                </span>{" "}
                Of <span>{courses.length}</span> Results
              </h5>
            </div>
            <div className="form-clt">
              <NiceSelect
                className="category"
                options={[
                  { value: "01", text: "Sort by : Default" },
                  { value: "02", text: "Sort by popularity" },
                  { value: "03", text: "Sort by average rating" },
                  { value: "04", text: "Sort by latest" },
                ]}
                defaultCurrent={0}
                onChange={selectHandler}
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row">
            {currentCourses.map((course, index) => (
              <div
                key={course.id}
                className="col-xl-4 col-lg-6 col-md-6"
                data-wow-delay={`${0.2 + (index % 4) * 0.2}s`}
              >
                <div className="courses-card-main-items">
                  <div className="courses-card-items style-2">
                    <div className="courses-image">
                      <img
                        src={
                          course.thumbnailPreview || "assets/img/courses/09.jpg"
                        }
                        alt="img"
                      />
                      <h3 className="courses-title">{course.title}</h3>
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
                      <h3>
                        <Link to="/courses-details">
                          Learn With {course.level} {course.title} Course
                        </Link>
                      </h3>
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
                            to={"/instructor-details/" + course.InstructorId}
                          >
                            {course.instructorName.replace("|", " ")}
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
                        <li>
                          <Link to="/courses-details" className="theme-btn">
                            Enroll Now
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="page-nav-wrap pt-5 text-center">
            <ul>
              {currentPage > 1 && (
                <li>
                  <a
                    aria-label="Previous"
                    className="page-numbers"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  >
                    <i className="far fa-arrow-left"></i>
                  </a>
                </li>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <li key={pageNum}>
                    <a
                      className={`page-numbers ${
                        pageNum === currentPage ? "current" : ""
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </a>
                  </li>
                )
              )}
              {currentPage < totalPages && (
                <li>
                  <a
                    aria-label="Next"
                    className="page-numbers"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  >
                    <i className="far fa-arrow-right"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesArea;
