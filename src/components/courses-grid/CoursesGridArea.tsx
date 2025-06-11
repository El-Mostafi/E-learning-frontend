import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseDataGenerale } from "../../services/coursService";
import { Star } from "lucide-react";

function CoursesGridArea() {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);

  // --- STATE CHANGES FOR BETTER UX ---
  // 'initialLoading' is for the first page load only.
  const [initialLoading, setInitialLoading] = useState(true);
  // 'isFetching' tracks subsequent fetches without removing old content.
  const [isFetching, setIsFetching] = useState(false);

  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(location.state?.sortBy || "latest");

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(
    location.state?.currentPage || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 9;

  // Categories and other filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<({userName: string, id: string} | undefined)[]>([]);

  // --- REFS FOR PRESERVING SCROLL POSITION ---
  // A ref to the category list's DOM element.
  const categoryListRef = useRef<HTMLDivElement>(null);
  // A ref to store the scroll position value between renders.
  const scrollPositionRef = useRef<number>(0);

  // Fetch categories, levels, and instructors on component mount
  useEffect(() => {
    const fetchFilteringData = async () => {
      try {
        const filteringData = await coursService.getCoursesFilteringData();
        setCategories(filteringData.categories);
        setLevels(filteringData.levels);
        setInstructors(filteringData.instructors)
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchFilteringData();
  }, []);

  // Use a useCallback to memoize the fetch function
  const fetchCourses = useCallback(async () => {
    // If it's not the initial load, set 'isFetching' to true to show the overlay.
    if (!initialLoading) {
      setIsFetching(true);
    }

    try {
      const filterParams = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory.length > 0 && { categories: selectedCategory }),
        ...(selectedLevel.length > 0 && { levels: selectedLevel }),
        ...(selectedPrice && { price: selectedPrice }),
        ...(selectedInstructor.length > 0 && {
          instructors: selectedInstructor,
        }),
        ...(selectedRating.length > 0 && { ratings: selectedRating }),
      };

      // console.log("Filter Params:", filterParams);

      const { courses, totalCount } = await coursService.getGeneralDataCourses(
        currentPage,
        coursesPerPage,
        sortBy,
        filterParams
      );

      setCourses(courses);
      setTotalPages(Math.ceil(totalCount / coursesPerPage));
      setTotalCourses(totalCount);

      // Merge new filter options with existing ones to prevent them from disappearing
      const uniqueLevels = Array.from(
        new Set(courses.map((course) => course.level))
      );

    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      console.error(err);
    } finally {
      setInitialLoading(false); // Will only set to false once.
      setIsFetching(false); // Will be toggled for every subsequent fetch.
    }
  }, [
    currentPage,
    sortBy,
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedPrice,
    selectedInstructor,
    selectedRating,
    initialLoading,
  ]);

  // Main effect to trigger fetching
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // --- HANDLER MODIFICATION FOR SCROLL PRESERVATION ---
  const handleCategoryChange = (category: string) => {
    // Before updating state, save the current scroll position.
    if (categoryListRef.current) {
      scrollPositionRef.current = categoryListRef.current.scrollTop;
    }

    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  // This effect runs after the DOM is updated but before the browser paints.
  // It restores the saved scroll position, making the change invisible to the user.
  useLayoutEffect(() => {
    if (categoryListRef.current) {
      categoryListRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [isFetching]); // Runs after every fetch is completed.

  const handleLevelChange = (level: string) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice(price);
    setCurrentPage(1);
  };

  const handleInstructorChange = (instructor: string) => {
    setSelectedInstructor((prev) =>
      prev.includes(instructor)
        ? prev.filter((i) => i !== instructor)
        : [...prev, instructor]
    );
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory([]);
    setSelectedLevel([]);
    setSelectedPrice("");
    setSelectedInstructor([]);
    setSelectedRating([]);
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const selectHandler = (item: Option) => {
    setSortBy(item.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const indexOfFirstCourse = (currentPage - 1) * coursesPerPage;
  const indexOfLastCourse = Math.min(
    indexOfFirstCourse + coursesPerPage,
    totalCourses
  );

  // The full page loader now only shows on initial load.
  if (initialLoading) {
    return (
      <div
        className="container text-center py-5 d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
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
          .icon-items { display: flex; align-items: center; gap: 10px; }
          .icon-items i { width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 50%; background-color:rgb(255, 255, 255); font-size: 20px; }
          .icon-items, .client-img i img { border-radius: 50%; }
          .courses-image { position: relative; height: 200px; overflow: hidden; }
          .courses-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
          .courses-card-items:hover .courses-image img { transform: scale(1.1); }
          .courses-card-main-items { margin-bottom: 30px; transition: transform 0.3s ease; }
          .courses-card-items { border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
          .course-title { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4em; max-height: 2.8em; cursor: pointer; }

          /* ADDED: Styles for the non-intrusive loading state */
          .courses-grid-container {
            position: relative;
            transition: opacity 0.2s ease-in-out;
          }
          .courses-grid-container.is-fetching {
            opacity: 0.7; /* Dims the old content */
            pointer-events: none; /* Prevents clicking on old content while loading */
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
                      <form onSubmit={handleSearchSubmit}>
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
                    {/* Attach the ref to this scrollable div */}
                    <div
                      ref={categoryListRef}
                      className="courses-list max-h-[635px] overflow-y-auto"
                    >
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
                    <div className="courses-list max-h-[150px] overflow-y-auto">
                      {instructors.map((instructor) => (
                        <label key={instructor?.id} className="checkbox-single">
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedInstructor.includes(
                                  instructor?.id!
                                )}
                                onChange={() =>
                                  handleInstructorChange(instructor?.id!)
                                }
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">
                              {instructor!.replace("|", " ")==="Admin"?"Eduspace ":instructor!.replace("|", " ")}

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
                                ({rating}+ Stars)
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
                      {indexOfFirstCourse + 1}-{indexOfLastCourse || 1}
                    </span>{" "}
                    Of <span>{totalCourses || 1}</span> Results
                  </h5>
                </div>
                <div className="form-clt">
                  <NiceSelect
                    className="category"
                    options={[
                      { value: "latest", text: "Sort by latest" },
                      { value: "popularity", text: "Sort by popularity" },
                      { value: "rating", text: "Sort by average rating" },
                      {
                        value: "enrollmentCount",
                        text: "Sort by : Enrolled Students",
                      },
                    ]}
                    defaultCurrent={0}
                    onChange={selectHandler}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              {/* A wrapper around the grid and pagination */}
              <div
                className={`courses-grid-container ${
                  isFetching ? "is-fetching" : ""
                }`}
              >
                {/* The spinner now appears on top when fetching */}
                {isFetching && (
                  <div
                    style={{
                      position: "absolute",
                      top: "150px",
                      left: "50%",
                      zIndex: 10,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                <div className="row">
                  {courses.map((course) => (
                    <div key={course.id} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="courses-card-main-items">
                        <div className="courses-card-items ">
                          <div className="courses-image">
                            <img
                              className="pb-3"
                              src={
                                course.thumbnailPreview ||
                                "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                              }
                              alt="course thumbnail"
                            />
                            <h4 className="topic-title">{course.level}</h4>
                            <div className="arrow-items">
                              <div className="GlidingArrow">
                                <img
                                  src="assets/img/courses/a1.png"
                                  alt="img"
                                />
                              </div>
                              <div className="GlidingArrow delay1">
                                <img
                                  src="assets/img/courses/a2.png"
                                  alt="img"
                                />
                              </div>
                              <div className="GlidingArrow delay2">
                                <img
                                  src="assets/img/courses/a3.png"
                                  alt="img"
                                />
                              </div>
                              <div className="GlidingArrow delay3">
                                <img
                                  src="assets/img/courses/a4.png"
                                  alt="img"
                                />
                              </div>
                              <div className="GlidingArrow delay4">
                                <img
                                  src="assets/img/courses/a5.png"
                                  alt="img"
                                />
                              </div>
                              <div className="GlidingArrow delay5">
                                <img
                                  src="assets/img/courses/a6.png"
                                  alt="img"
                                />
                              </div>
                            </div>
                          </div>
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
                                  Learn With {course.level} {course.title}{" "}
                                  Course
                                </div>
                              </Link>
                            </h5>
                            <div className="client-items">
                              <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://via.placeholder.com/40x40"
                                  }
                                  alt={course.instructorName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/40x40";
                                  }}
                                />
                              </div>
                              <p>
                                <Link
                                  to={`/instructor-details/${course.InstructorId}`}
                                >
                                  {course.instructorName!.replace("|", " ")}
                                </Link>
                              </p>
                            </div>
                            <ul className="post-class">
                              <li>
                                <i className="far fa-books"></i>Lessons
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
                                  Learn With {course.level} {course.title}{" "}
                                  Course
                                </div>
                              </Link>
                            </h5>
                            <h4>${course.price}</h4>
                            <span>
                              Education is only empowers people to pursue career
                            </span>
                            <div className="client-items">
                              <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://via.placeholder.com/40x40"
                                  }
                                  alt={course.instructorName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/40x40";
                                  }}
                                />
                              </div>
                              <Link
                                to={
                                  "/instructor-details/" + course.InstructorId
                                }
                                className={"text-white"}
                              >
                                {course.instructorName!.replace("|", " ")}
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
                <div className="page-nav-wrap pt-5 text-center">
                  <ul className="inline-flex gap-2 justify-center items-center">
                    {currentPage > 1 && (
                      <li>
                        <a
                          title="Previous"
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (pageNum) =>
                          pageNum <= 2 ||
                          pageNum > totalPages - 2 ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                      )
                      .reduce((acc, pageNum, idx, arr) => {
                        if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                          acc.push("...");
                        }
                        acc.push(pageNum);
                        return acc;
                      }, [] as (number | string)[])
                      .map((item, index) => (
                        <li key={index}>
                          {item === "..." ? (
                            <span className="page-numbers dots">...</span>
                          ) : (
                            <a
                              className={`page-numbers ${
                                item === currentPage ? "current" : ""
                              }`}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (typeof item === "number") {
                                  handlePageChange(item);
                                }
                              }}
                            >
                              {item}
                            </a>
                          )}
                        </li>
                      ))}
                    {currentPage < totalPages && (
                      <li>
                        <a
                          title="Next"
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
        </div>
      </section>
    </>
  );
}

export default CoursesGridArea;
