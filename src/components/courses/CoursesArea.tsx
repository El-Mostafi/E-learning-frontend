import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseDataGenerale } from "../../services/coursService";
import { Star } from "lucide-react";
import axiosInstance from "../../services/api";
import { cartService } from "../../services/cartService";
import { cartDetails } from "../../services/interfaces/cart.interface";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { enrollmentService } from "../../services/enrollmentService";
import { isTokenValid } from "../../utils/ProtectedRoutes";

const CoursesArea = () => {
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 9;
  const [totalCourses, setTotalCourses] = useState(0);

  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cart, setCart] = useState<cartDetails | null>(null);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchCourses = async (page: number, sortOption?: string) => {
    console.log("Sort Option", sortOption);
    try {
      setLoading(true);
      const { courses, totalCount } = await coursService.getGeneralDataCourses(
        page,
        coursesPerPage,
        sortOption
      );

      console.log(courses);
      setCourses(courses);
      setTotalPages(Math.ceil(totalCount / coursesPerPage));
      setTotalCourses(totalCount);
    } catch (err) {
      setError("Failed to load courses. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchMyEnrollments = async () => {
    if (user !== null && user.role === "student" && isTokenValid()) {
      setLoading(true);
      try {
        const response = await enrollmentService.getMyEnrollmentsIds();
        setMyEnrollments(response);
        console.log("My Enrollments:", response);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error("Failed to fetch my enrollments:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setMyEnrollments([]);
    }
  };

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // The useEffect will automatically call fetchCourses when currentPage changes
  };

  const selectHandler = (item: Option) => {
    setSortBy(item.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };
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
    if (user !== null && user.role === "student" && isTokenValid()) {
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
      // setIsInCart((prevIsInCart) => {
      //   const newIsInCart = new Map(prevIsInCart);
      //   newIsInCart.set(courseId, !newIsInCart.get(courseId));
      //   return newIsInCart;
      // });
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

  // Remove client-side pagination since server handles it
  const indexOfFirstCourse = (currentPage - 1) * coursesPerPage;
  const indexOfLastCourse = Math.min(
    indexOfFirstCourse + coursesPerPage,
    totalCourses
  );

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
          
          /* Fix for uniform card heights */
          .courses-card-main-items {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .courses-card-items {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .courses-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .courses-content h3 {
            flex: 1;
          }
          
          .post-class {
            margin-top: auto;
          }
        `}
      </style>
      <section className="popular-courses-section fix section-padding">
        <div className="container">
          <div className="coureses-notices-wrapper">
            <div className="courses-showing">
              <div className="icon-items">
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/courses-grid", {
                      state: {
                        viewType: "grid",
                        currentPage: currentPage,
                        sortBy: sortBy,
                      },
                    });
                  }}
                >
                  <i className="fas fa-th"></i>
                </Link>

                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/courses-grid", {
                      state: {
                        viewType: "list",
                        currentPage: currentPage,
                        sortBy: sortBy,
                      },
                    });
                  }}
                >
                  <i className="fas fa-bars"></i>
                </Link>
              </div>
              <h5>
                Showing{" "}
                <span>
                  {indexOfFirstCourse + 1}-{indexOfLastCourse}
                </span>{" "}
                Of <span>{totalCourses}</span> Results
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
          <div className="row">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="col-xl-4 col-lg-6 col-md-6"
                data-wow-delay={`${0.2 + (index % 4) * 0.2}s`}
              >
                <div className="courses-card-main-items">
                  <div className="courses-card-items style-2">
                    <div className="courses-image h-[250px] overflow-hidden">
                      <img
                        className="object-cover "
                        src={
                          course.thumbnailPreview ||
                          "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1749755600/y6cvmgqd7kcpoogmravr.png"
                        }
                        alt="img"
                      />
                      <h3 className="courses-title px-2">{course.title}</h3>
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
                        <Link
                          to="/course-details"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/course-details", {
                              state: { courseId: course.id },
                            });
                          }}
                        >
                          {`Learn With ${course.level} ${course.title} Course`.substring(
                            0,
                            80
                          ) + "..."}
                        </Link>
                      </h3>
                      <div className="client-items">
                        <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                          <img
                            src={
                              course.instructorImg ||
                              "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                            }
                            alt={course.instructorName!.replace("|", " ")}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p>
                          <Link
                            to={"/instructor-details/" + course.InstructorId}
                          >
                            {course.instructorName!.replace("|", " ") ===
                            "Admin"
                              ? " "
                              : course.instructorName!.replace("|", " ")}
                          </Link>
                        </p>
                      </div>
                      <ul className="post-class">
                        <li>
                          <i className="far fa-user"></i>
                          {course.students} Students
                        </li>
                        <li>
                          {user &&
                          isTokenValid() &&
                          user.role === "student" &&
                          !myEnrollments.includes(course.id) ? (
                            <button
                              onClick={() => handleAddToCart(course.id)}
                              className={`theme-btn `}
                              disabled={updatingCourseId === course.id}
                            >
                              <i className="far fa-shopping-basket"></i>{" "}
                              {updatingCourseId === course.id
                                ? coursesInCart.includes(course.id)
                                  ? "Removing..."
                                  : "Adding..."
                                : coursesInCart.includes(course.id)
                                ? "In Cart"
                                : "Add to Cart"}
                            </button>
                          ) : (
                            <li>
                              <i className="far fa-books"></i>
                              lessons
                            </li>
                          )}
                        </li>
                        <li>
                          <Link
                            to="/course-details"
                            className="theme-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/course-details", {
                                state: { courseId: course.id },
                              });
                            }}
                          >
                            {user && user.role === "student" && isTokenValid()
                              ? myEnrollments.includes(course.id)
                                ? "Continue Learning"
                                : "Enroll"
                              : user === null
                              ? "Enroll Now"
                              : "See Details"}
                          </Link>
                        </li>
                      </ul>
                      {cartError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                          {cartError}
                        </div>
                      )}
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
                .filter((pageNum) => {
                  return (
                    pageNum <= 2 || // first 2
                    pageNum > totalPages - 2 || // last 2
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) // around current
                  );
                })
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
      </section>
    </>
  );
};

export default CoursesArea;
