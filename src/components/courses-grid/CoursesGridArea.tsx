import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseDataGenerale } from "../../services/coursService";
import { Star } from "lucide-react";

function CoursesGridArea() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<courseDataGenerale[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("01");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursService.getGeneralDataCourses();
        setCourses(response);
        setFilteredCourses(response);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedPrice,
    selectedInstructor,
    selectedRating,
    courses,
  ]);

  const applyFilters = () => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategory.includes(course.category)
      );
    }

    if (selectedLevel.length > 0) {
      filtered = filtered.filter((course) =>
        selectedLevel.includes(course.level)
      );
    }

    if (selectedPrice) {
      filtered = filtered.filter((course) => {
        if (selectedPrice.includes("Free")) return course.price === 0;
        if (selectedPrice.includes("Paid")) return course.price > 0;
        return true;
      });
    }

    if (selectedInstructor.length > 0) {
      filtered = filtered.filter((course) =>
        selectedInstructor.includes(course.instructorName)
      );
    }

    if (selectedRating.length > 0) {
      filtered = filtered.filter((course) =>
        selectedRating.includes(Math.floor(course.reviews))
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice(price);
  };

  const handleInstructorChange = (instructor: string) => {
    setSelectedInstructor((prev) =>
      prev.includes(instructor)
        ? prev.filter((i) => i !== instructor)
        : [...prev, instructor]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory([]);
    setSelectedLevel([]);
    setSelectedPrice("");
    setSelectedInstructor([]);
    setSelectedRating([]);
    setFilteredCourses(courses);
    setCurrentPage(1);
  };
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

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const selectHandler = (item: Option, value: string) => {
    setSortBy(value);
    console.log(item, sortBy);
    const sortedCourses = [...filteredCourses];

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

    setFilteredCourses(sortedCourses);
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

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );
  const levels = Array.from(new Set(courses.map((course) => course.level)));
  const instructors = Array.from(
    new Set(courses.map((course) => course.instructorName))
  );

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
          .icon-items, .client-img i img {
            border-radius: 50%;
          }
            .courses-image {
            position: relative;
            height: 200px; /* Increased height */
            overflow: hidden;
          }
          
          .courses-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .courses-card-items:hover .courses-image img {
            transform: scale(1.1);
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
          
        `}
      </style>
      <section className="courses-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            <div className="col-xl-3 col-lg-4">
              <div className="courses-main-sidebar-area">
                <div className="courses-main-sidebar">
                  <div className="courses-sidebar-items">
                    <div className="wid-title style-2">
                      <h5>Search</h5>
                    </div>
                    <div className="search-widget">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <input
                          type="text"
                          placeholder="Search courses"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button title="Search" type="submit">
                          <i className="fal fa-search"></i>
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="courses-sidebar-items">
                    <div className="wid-title">
                      <h5>Category</h5>
                    </div>
                    <div className="courses-list">
                      {categories.map((category) => (
                        <label key={category} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedCategory.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">{category}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="courses-sidebar-items">
                    <div className="wid-title">
                      <h5>Course Level</h5>
                    </div>
                    <div className="courses-list">
                      {levels.map((level) => (
                        <label key={level} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedLevel.includes(level)}
                                onChange={() => handleLevelChange(level)}
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">{level}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="courses-sidebar-items">
                    <div className="wid-title">
                      <h5>Price</h5>
                    </div>
                    <div className="courses-list">
                      {["Free", "Paid"].map((price) => (
                        <label key={price} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="radio"
                                name="price"
                                checked={selectedPrice === price}
                                onChange={() => handlePriceChange(price)}
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">{price}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="courses-sidebar-items">
                    <div className="wid-title">
                      <h5>Instructors</h5>
                    </div>
                    <div className="courses-list">
                      {instructors.map((instructor) => (
                        <label key={instructor} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedInstructor.includes(
                                  instructor
                                )}
                                onChange={() =>
                                  handleInstructorChange(instructor)
                                }
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">
                              {instructor.replace("|", " ")}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="courses-sidebar-items">
                    <div className="wid-title">
                      <h5>Rating</h5>
                    </div>
                    <div className="courses-list">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedRating.includes(rating)}
                                onChange={() => handleRatingChange(rating)}
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">
                              <span className="star">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <i
                                    key={i}
                                    className={`fas fa-star ${
                                      i < rating ? "" : "color-2"
                                    }`}
                                  ></i>
                                ))}
                              </span>
                              <span className="ratting-text">
                                (
                                {
                                  courses.filter(
                                    (c) => Math.floor(c.reviews) === rating
                                  ).length
                                }
                                )
                              </span>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={clearFilters} className="theme-btn">
                  <i className="far fa-times-circle"></i> Clear All Filters
                </button>
              </div>
            </div>

            <div className="col-xl-9 col-lg-8">
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
                {currentCourses.map((course) => (
                  <div key={course.id} className="col-xl-4 col-lg-6 col-md-6">
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
                              Learn With {course.level} {course.title} Course
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
                          </ul>
                        </div>
                      </div>
                      <div className="courses-card-items-hover">
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
                              Learn With {course.level} {course.title} Course
                            </Link>
                          </h5>
                          <h4>${course.price}</h4>
                          <span>
                            Education is only empowers people to pursue career
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
                              {course.instructorName.replace("|", " ")}
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
              <div className="page-nav-wrap pt-5">
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
          </div>
        </div>
      </section>
    </>
  );
}

export default CoursesGridArea;
