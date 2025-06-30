import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseDataGenerale } from "../../services/coursService";
import CourseGrid from "./CourseGrid";
import CourseList from "./CourseList";
import { cartDetails } from "../../services/interfaces/cart.interface";
import { useAuth } from "../../context/AuthContext";
import { enrollmentService } from "../../services/enrollmentService";
import { cartService } from "../../services/cartService";
import axiosInstance from "../../services/api";
import axios from "axios";

interface CoursesContainerProps {
  initialViewType?: "grid" | "list";
}

function CoursesContainer({ initialViewType = "grid" }: CoursesContainerProps) {
  const location = useLocation();
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [viewType, setViewType] = useState<"grid" | "list">(
    location.state?.viewType || initialViewType
  );

  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(location.state?.sortBy || "latest");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(
    location.state?.viewType
      ? location.state?.viewType === "list"
        ? Math.ceil((location.state?.currentPage * 9 - 8) / 5)
        : location.state?.currentPage || 1
      : 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const coursesPerPage = viewType === "grid" ? 9 : 5;

  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<
    ({ userName: string; id: string } | undefined)[]
  >([]);

  const categoryListRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cart, setCart] = useState<cartDetails | null>(null);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFilteringData = async () => {
      try {
        const filteringData = await coursService.getCoursesFilteringData();
        setCategories(filteringData.categories);
        setLevels(filteringData.levels);
        setInstructors(filteringData.instructors);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchFilteringData();
  }, []);

  const fetchCourses = useCallback(async () => {
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

      const { courses, totalCount } = await coursService.getGeneralDataCourses(
        currentPage,
        coursesPerPage,
        sortBy,
        filterParams
      );

      setCourses(courses);
      setTotalPages(Math.ceil(totalCount / coursesPerPage));
      setTotalCourses(totalCount);
    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      console.error(err);
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
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
    coursesPerPage,
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const fetchMyEnrollments = async () => {
    if (user !== null && user.role === "student") {
      setIsFetching(true);
      try {
        const response = await enrollmentService.getMyEnrollmentsIds();
        setMyEnrollments(response);
        console.log("My Enrollments:", response);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error("Failed to fetch my enrollments:", err);
      } finally {
        setIsFetching(false);
      }
    } else {
      setMyEnrollments([]);
    }
  };

  useEffect(() => {
    fetchMyEnrollments();
  }, []);
  const fetchCart = async () => {
    const cartData = await cartService.getCart();
    setCart(cartData);

    const map: string[] = [];
    cartData.courses.forEach((item) => {
      map.push(item._id);
    });

    setCoursesInCart(map);
    console.log("Cart data:", cartData);
  };
  useEffect(() => {
    if (user !== null && user.role === "student") {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);
  const handleAddToCart = async (courseId: string) => {
    if (!courseId) {
      setCartError("Course ID is missing");
      return;
    }
    setUpdatingCourseId(courseId);
    setCartError("");
    try {
      if (coursesInCart.includes(courseId)) {
        await axiosInstance.delete("/cart/remove", { data: { courseId } });
      } else {
        await axiosInstance.post("/cart/add", { courseId });
      }
      fetchCart();
    } catch (err) {
      console.error("Cart action error:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : `Failed to ${
            coursesInCart.includes(courseId) ? "remove" : "add"
          } course.`;
      setCartError(message || "An unexpected error occurred.");
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleCategoryChange = (category: string) => {
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

  useLayoutEffect(() => {
    if (categoryListRef.current) {
      categoryListRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [isFetching]);

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

  const handleViewChange = (newViewType: "grid" | "list") => {
    if (viewType !== newViewType) {
      setViewType(newViewType);
      setCurrentPage(1);
    }
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
          .icon-items a.active { border: 1px solid #007bff !important; }
          .icon-items i.active { background-color:rgb(255, 255, 255); color:  #007bff; }
          /* Styles for the non-intrusive loading state */
          .courses-container {
            position: relative;
            transition: opacity 0.2s ease-in-out;
          }
          .courses-container.is-fetching {
            opacity: 0.7;
            pointer-events: none;
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
                    <div
                      ref={categoryListRef}
                      className={`courses-list overflow-y-auto ${
                        viewType === "grid" ? "max-h-[635px]" : "max-h-[350px]"
                      }`}
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
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                                  instructor?.id!
                                )}
                                onChange={() =>
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                                  handleInstructorChange(instructor?.id!)
                                }
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">
                              {instructor!.userName === "Admin"
                                ? "LUMINARA "
                                : instructor!.userName.replace("|", " ")}
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
                    <Link
                      to="/courses-grid"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewChange("grid");
                      }}
                      className={`${viewType === "grid" ? "active" : ""}`}
                    >
                      <i
                        className={`fas fa-th ${
                          viewType === "grid" ? "active" : ""
                        }`}
                      ></i>
                    </Link>

                    <Link
                      to="/courses-list"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewChange("list");
                      }}
                      className={`${viewType === "list" ? "active" : ""}`}
                    >
                      <i
                        className={`fas fa-bars ${
                          viewType === "list" ? "active" : ""
                        }`}
                      ></i>
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
                    value={sortBy}
                    onChange={selectHandler}
                    name=""
                    placeholder=""
                  />
                </div>
              </div>

              <div
                className={`courses-container ${
                  isFetching ? "is-fetching" : ""
                }`}
              >
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

                {viewType === "grid" ? (
                  <CourseGrid
                    courses={courses}
                    handleAddToCart={handleAddToCart}
                    myEnrollments={myEnrollments}
                    updatingCourseId={updatingCourseId}
                    coursesInCart={coursesInCart}
                    cartError={cartError}
                  />
                ) : (
                  <CourseList
                    courses={courses}
                    handleAddToCart={handleAddToCart}
                    myEnrollments={myEnrollments}
                    updatingCourseId={updatingCourseId}
                    coursesInCart={coursesInCart}
                    cartError={cartError}
                  />
                )}

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

export default CoursesContainer;
