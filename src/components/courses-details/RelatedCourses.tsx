import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { courseDataGenerale } from "../../services/coursService";
import ModelService from "../../services/modelService";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cartDetails } from "../../services/interfaces/cart.interface";
import { enrollmentService } from "../../services/enrollmentService";
import { cartService } from "../../services/cartService";
import axiosInstance from "../../services/api";
import axios from "axios";

const RelatedCourses = () => {
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cart, setCart] = useState<cartDetails | null>(null);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;

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
  }else{
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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await ModelService.getSimilarCourses(courseId, 5);
        if (data.data.length === 0) {
          setError("No Similar Courses Found");
        }
        setCourses(data.data);
        console.log(" Courses Data:", data.data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
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
      <section className="popular-courses-section fix section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h2 className="wow fadeInUp">Related Courses</h2>
          </div>
          <Swiper
            spaceBetween={30}
            speed={1500}
            loop={true}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            pagination={{
              el: ".dot",
              clickable: true,
            }}
            modules={[Pagination, Autoplay]}
            breakpoints={{
              1199: {
                slidesPerView: 3,
              },
              991: {
                slidesPerView: 2,
              },
              767: {
                slidesPerView: 2,
              },
              575: {
                slidesPerView: 1,
              },
              0: {
                slidesPerView: 1,
              },
            }}
            className="swiper courses-slider"
          >
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="col-xl-4 col-lg-6 col-md-6"
                data-wow-delay={`${0.2 + (index % 4) * 0.2}s`}
              >
                <SwiperSlide key={course.id} className="swiper-slide">
                  <div className="courses-card-main-items">
                    <div className="courses-card-items style-2">
                      <div className="courses-image h-[250px] overflow-hidden ">
                        <img
                          className="object-cover"
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
                            className="line-clamp-2"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/course-details", {
                                state: { courseId: course.id },
                              });
                              window.scrollTo(0, 0);
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
                                ? "LUMINARA "
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
                                window.location.reload();
                              }}
                            >
                              {user && user.role === "student"
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
                </SwiperSlide>
              </div>
            ))}
            <div className="swiper-dot text-center mt-5">
              <div className="dot"></div>
            </div>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default RelatedCourses;
