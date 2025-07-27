import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseDataGenerale } from "../../../services/coursService";
import ModelService from "../../../services/modelService";
import { useAuth } from "../../../context/AuthContext";
import { enrollmentService } from "../../../services/enrollmentService";
import { cartDetails } from "../../../services/interfaces/cart.interface";
import { cartService } from "../../../services/cartService";
import axiosInstance from "../../../services/api";
import axios from "axios";
import { isTokenValid } from "../../../utils/ProtectedRoutes";

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
            .cart-icon-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
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

const RecommendedCourses = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cart, setCart] = useState<cartDetails | null>(null);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);

  const navigate = useNavigate();

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  useEffect(() => {
    if (!user || !isTokenValid()) {
      return;
    }
    const fetchCourses = async () => {
      try {
        const data = await ModelService.getRecommendedCourses(user.userId, 8);
        setCourses(data.data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchMyEnrollments = async () => {
    if (user !== null && user.role === "student") {
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
  if (!user || !isTokenValid()) {
    return null;
  }

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
          <div className="section-title-area align-items-end flex flex-wrap">
            <div className="section-title">
              <h6 className="wow fadeInUp">Recommended Courses</h6>
              <h2 className="wow fadeInUp" data-wow-delay=".3S">
                Explore Recommended Courses
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
                              to="/course-details"
                              className="line-clamp-2 min-h-[51px]"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/course-details", {
                                  state: { courseId: course.id },
                                });
                              }}
                            >
                              <div className="course-title">{course.title}</div>
                            </Link>
                          </h5>
                          <div className="client-items">
                            <div className="icon-items">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                                  }
                                  alt="img"
                                />
                              </i>
                            </div>
                            <p>
                              <Link
                                to={`/instructor-details/${course.InstructorId}`}
                              >
                                {course.instructorName?.replace("|", " ")}
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
                          {cartError && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                              {cartError}
                            </div>
                          )}
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
                              to="/course-details"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/course-details", {
                                  state: { courseId: course.id },
                                });
                              }}
                            >
                              <div className="course-title">
                                Learn With {course.level} {course.title} Course
                              </div>
                            </Link>
                          </h5>
                          <h4>${course.price}</h4>
                          <span className="line-clamp-3">
                            {course.description.replace(/<\/?[^>]+(>|$)/g, "")}
                          </span>
                          <div className="client-items">
                            <div className="client-img bg-cover">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                                  }
                                  alt="img"
                                />
                              </i>
                            </div>
                            <Link
                              to={"/instructor-details/" + course.InstructorId}
                              className={"text-white"}
                            >
                              {course.instructorName?.replace("|", " ")}
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
                          <ul className="post-class">
                            <li>
                              <Link
                                to="/course-details"
                                className="theme-btn yellow-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/course-details", {
                                    state: { courseId: course.id },
                                  });
                                }}
                              >
                                {user && user.role === "student"
                                  ? myEnrollments.includes(course.id)
                                    ? "Continue Learning"
                                    : "Enroll Now"
                                  : user === null
                                  ? "Enroll Now"
                                  : "See Details"}
                              </Link>
                            </li>
                            <li>
                              {user &&
                                user.role === "student" &&
                                !myEnrollments.includes(course.id) && (
                                  <button
                                    onClick={() => handleAddToCart(course.id)}
                                    className={`theme-btn cart-icon-btn ${
                                      coursesInCart.includes(course.id)
                                        ? "red-btn"
                                        : ""
                                    }`}
                                    disabled={updatingCourseId === course.id}
                                    title={
                                      updatingCourseId === course.id
                                        ? coursesInCart.includes(course.id)
                                          ? "Removing from cart..."
                                          : "Adding to cart..."
                                        : coursesInCart.includes(course.id)
                                        ? "Remove from cart"
                                        : "Add to cart"
                                    }
                                  >
                                    <i
                                      className={`far ${
                                        updatingCourseId === course.id
                                          ? "fa-spinner fa-spin"
                                          : coursesInCart.includes(course.id)
                                          ? "fa-times"
                                          : "fa-shopping-basket"
                                      }`}
                                    ></i>
                                  </button>
                                )}
                            </li>
                          </ul>
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

export default RecommendedCourses;
