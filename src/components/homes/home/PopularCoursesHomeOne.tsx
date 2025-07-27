import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  courseDataGenerale,
  coursService,
} from "../../../services/coursService";
import Pagination from "../../pagination/Pagination";
import axios from "axios";
import axiosInstance from "../../../services/api";
import { cartService } from "../../../services/cartService";
import { enrollmentService } from "../../../services/enrollmentService";
import { useAuth } from "../../../context/AuthContext";
import { cartDetails } from "../../../services/interfaces/cart.interface";

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
  
  .courses-image {
    position: relative;
    height: 200px;
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
    height: 100%;
    position: relative;
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

  /* Enhanced description styling for hover overlay */
  .course-description-hover {
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.9);
    margin: 0.75rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 5.6em;
    text-overflow: ellipsis;
  }

  /* Fallback for browsers that don't support -webkit-line-clamp */
  .course-description-hover.fallback {
    display: block;
    max-height: 5.6em;
    overflow: hidden;
    position: relative;
  }

  .course-description-hover.fallback::after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(to right, transparent, #667eea 50%);
    padding-left: 20px;
  }
  
  .post-cat {
    height: 44px;
    margin-bottom: 1rem;
  }
  
  .category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 12px 0 10px 0;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    transform: translateY(10px);
    backface-visibility: hidden;
    overflow: auto;
    z-index: 10;
  }

  .courses-card-items-hover .courses-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    color: white;
  }

  .courses-card-main-items:hover .courses-card-items-hover {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .courses-card-items-hover .post-cat a {
    color: rgba(255, 255, 255, 0.9);
  }

  .courses-card-items-hover h5 a {
    color: white;
  }

  .courses-card-items-hover h4 {
    color: #ffd700;
    font-weight: bold;
  }

  .courses-card-items-hover span {
    color: rgba(255, 255, 255, 0.8);
  }

  .courses-card-items-hover .client-items a {
    color: white;
  }

  .courses-card-items-hover .post-class {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Custom scrollbar for hover content */
  .courses-card-items-hover::-webkit-scrollbar {
    width: 4px;
  }

  .courses-card-items-hover::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  .courses-card-items-hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
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
    text-decoration: none;
    margin-top: 1rem;
    flex-shrink: 0;
  }

  .theme-btn.yellow-btn:hover {
    background: #ffed4a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
    color: #000;
    text-decoration: none;
  }

  /* Client items styling */
  .client-items {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
    flex-shrink: 0;
  }

  .client-items .w-7 {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    overflow: hidden;
    background: #f1f1f1;
  }

  .client-items img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Post class styling */
  .post-class {
    display: flex;
    gap: 1rem;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.875rem;
    color: #666;
    flex-shrink: 0;
  }

  .courses-card-items-hover .post-class {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .post-class li {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .post-class i {
    font-size: 0.75rem;
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

// Function to truncate description intelligently
const truncateDescription = (text: string, maxLength: number = 120): string => {
  // Remove HTML tags first
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
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
  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cart, setCart] = useState<cartDetails | null>(null);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);
  const { user } = useAuth();
  const pageSize = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, totalCount } = await coursService.getPopularCourses(
          4.0,
          undefined,
          undefined,
          selectedCategory
        );

        setCourses(data);

        const uniqueCategories = Array.from(
          new Set(data.map((course) => course.category))
        );
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const trendingSection = document.getElementById("trending-courses-section");
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
            <div className="section-title w-full">
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

                          <div className="client-items">
                            <div className="icon-items">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
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
                          <div className="course-description-hover">
                            {truncateDescription(course.description)}
                          </div>
                          <div className="client-items">
                            <div className="client-img bg-cover">
                              <i>
                                <img
                                  src={
                                    course.instructorImg ||
                                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
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
