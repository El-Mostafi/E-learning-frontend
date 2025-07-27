import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";

import { InstructorSummary } from "../../services/interfaces/instructor.interface";
import { useAuth } from "../../context/AuthContext";
import { cartService } from "../../services/cartService";
import { enrollmentService } from "../../services/enrollmentService";
import axiosInstance from "../../services/api";

// --- Type Definitions ---
type PopularCourse = InstructorSummary["popularCourses"][0];

interface CoursesDetailsAreaProps {
  instructorSummary: InstructorSummary | null;
}

// --- Reusable Star Rating Helper Component (Unchanged as requested) ---
const StarRating = ({ rating = 0 }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
      {halfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
    </>
  );
};

// --- Reusable and Dynamic Course Card Component (Refactored) ---
// This card now matches the layout and functionality of the "RelatedCourses" card.
interface CourseCardProps {
  course: PopularCourse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // Type from useAuth context
  myEnrollments: string[];
  coursesInCart: string[];
  updatingCourseId: string | null;
  handleAddToCart: (courseId: string) => Promise<void>;
}

const CourseCard = ({ course, user, myEnrollments, coursesInCart, updatingCourseId, handleAddToCart }: CourseCardProps) => {
  const navigate = useNavigate();
  const defaultThumbnail = "/assets/img/courses/default-course.jpg";

  const handleNavigate = (courseId: string) => {
    navigate("/course-details", {
      state: { courseId: courseId },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="courses-card-main-items">
      <div className="courses-card-items style-2">
        <div className="courses-image h-[250px] overflow-hidden">
          <img
            src={course.thumbnail || defaultThumbnail}
            alt={course.title}
            className="object-cover" // Added class for consistent height
            onError={(e) => { (e.target as HTMLImageElement).src = defaultThumbnail; }}
          />
          <h3 className="courses-title px-2">{course.title}</h3>
          <h4 className="topic-title">{course.level}</h4>
          <div className="arrow-items">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`GlidingArrow delay${i}`}>
                <img src={`/assets/img/courses/a${i + 1}.png`} alt="arrow" />
              </div>
            ))}
          </div>
        </div>
        <div className="courses-content">
          <ul className="post-cat">
            <li>
              <Link to={`/courses?category=${course.category}`}>{course.category}</Link>
            </li>
            <li>
              <StarRating rating={course.rating} /> {/* Kept original star style */}
            </li>
          </ul>
          <h3>
            <a href="#" className="line-clamp-2" onClick={(e) => { e.preventDefault(); handleNavigate(course.id); }}>
              {`Learn With ${course.level} ${course.title} Course`.substring(0, 80) + "..."}
            </a>
          </h3>
          <ul className="post-class">
            <li>
              <i className="far fa-user"></i>
              {course.studentCount} Students
            </li>
            <li>
              {user && user.role === "student" && !myEnrollments.includes(course.id) ? (
                <button onClick={() => handleAddToCart(course.id)} className="theme-btn" disabled={updatingCourseId === course.id}>
                  <i className="far fa-shopping-basket"></i>{" "}
                  {updatingCourseId === course.id
                    ? coursesInCart.includes(course.id) ? "Removing..." : "Adding..."
                    : coursesInCart.includes(course.id) ? "In Cart" : "Add to Cart"}
                </button>
              ) : (
                <>
                  <i className="far fa-books"></i> lessons
                </>
              )}
            </li>
            <li>
              <a href="#" className="theme-btn" onClick={(e) => { e.preventDefault(); handleNavigate(course.id); }}>
                {user && user.role === "student"
                  ? myEnrollments.includes(course.id) ? "Continue Learning" : "Enroll"
                  : user === null ? "Enroll Now" : "See Details"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- The Main Component (Refactored with Swiper and State Logic) ---
const CoursesDetailsArea: React.FC<CoursesDetailsAreaProps> = ({ instructorSummary }) => {
  const { user } = useAuth();
  const [cartError, setCartError] = useState("");
  const [coursesInCart, setCoursesInCart] = useState<string[]>([]);
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [myEnrollments, setMyEnrollments] = useState<string[]>([]);

  // Fetch user's enrollments to update button states ("Enroll" vs "Continue Learning")
  useEffect(() => {
    const fetchMyEnrollments = async () => {
      if (user?.role === "student") {
        try {
          const response = await enrollmentService.getMyEnrollmentsIds();
          setMyEnrollments(response);
        } catch (err) {
          console.error("Failed to fetch my enrollments:", err);
        }
      } else {
        setMyEnrollments([]);
      }
    };
    fetchMyEnrollments();
  }, [user]);

  // Fetch user's cart to update button states ("Add to Cart" vs "In Cart")
  useEffect(() => {
    const fetchCart = async () => {
      if (user?.role === "student") {
        try {
          const cartData = await cartService.getCart();
          setCoursesInCart(cartData.courses.map(item => item._id));
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      } else {
        setCoursesInCart([]);
      }
    };
    fetchCart();
  }, [user]);

  // Handle adding/removing items from the cart
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
      const cartData = await cartService.getCart();
      setCoursesInCart(cartData.courses.map(item => item._id));
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : `Failed to update cart.`;
      setCartError(message || "An unexpected error occurred.");
    } finally {
      setUpdatingCourseId(null);
    }
  };

  if (!instructorSummary) {
    return null;
  }

  if (!instructorSummary.popularCourses || instructorSummary.popularCourses.length === 0) {
    return (
      <section className="popular-courses-section fix section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h2 className="wow fadeInUp">Courses By This Instructor</h2>
          </div>
          <div className="text-center py-5">
            <p>This instructor has no courses to display at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Render courses in a Swiper/carousel
  return (
    <section className="popular-courses-section fix section-padding pt-0">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="wow fadeInUp">Courses By This Instructor</h2>
        </div>
        <Swiper
          spaceBetween={30}
          speed={1500}
          loop={true}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          pagination={{ el: ".dot", clickable: true }}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            1199: { slidesPerView: 3 },
            991: { slidesPerView: 2 },
            767: { slidesPerView: 2 },
            575: { slidesPerView: 1 },
            0: { slidesPerView: 1 },
          }}
          className="swiper courses-slider"
        >
          {instructorSummary.popularCourses.map((course) => (
            <SwiperSlide key={course.id}>
              <CourseCard
                course={course}
                user={user}
                myEnrollments={myEnrollments}
                coursesInCart={coursesInCart}
                updatingCourseId={updatingCourseId}
                handleAddToCart={handleAddToCart}
              />
            </SwiperSlide>
          ))}
          <div className="swiper-dot text-center mt-5">
            <div className="dot"></div>
          </div>
        </Swiper>
        {cartError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
            {cartError}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesDetailsArea;