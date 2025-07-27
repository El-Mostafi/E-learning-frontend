// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { courseDataGenerale } from "../../services/coursService";
import { useAuth } from "../../context/AuthContext";

interface CourseGridProps {
  courses: courseDataGenerale[];
  handleAddToCart: (courseId: string) => Promise<void>;
  myEnrollments: string[];
  updatingCourseId: string | null;
  coursesInCart: string[];
  cartError: string;
}

function CourseGrid({
  courses,
  handleAddToCart,
  myEnrollments,
  updatingCourseId,
  coursesInCart,
  cartError,
}: CourseGridProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <>
      <style>
        {`
      .cart-icon-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
      `}
      </style>
      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-xl-4 col-lg-6 col-md-6">
            <div className="courses-card-main-items">
              <div className="courses-card-items">
                <div className="courses-image">
                  <img
                    className="pb-3"
                    src={
                      course.thumbnailPreview ||
                      "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1749755600/y6cvmgqd7kcpoogmravr.png"
                    }
                    alt="course thumbnail"
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
                  <div className="client-items">
                    <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                      <img
                        src={
                          course.instructorImg ||
                          "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                        }
                        alt={course.instructorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p>
                      <Link to={`/instructor-details/${course.InstructorId}`}>
                        {course.instructorName!.replace("|", " ") === "Admin"
                          ? "LUMINARA"
                          : course.instructorName!.replace("|", " ")}
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
                  <span>
                    Education is only empowers people to pursue career
                  </span>
                  <div className="client-items">
                    <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                      <img
                        src={
                          course.instructorImg ||
                          "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                        }
                        alt={
                          course.instructorName!.replace("|", " ") === "Admin"
                            ? "LUMINARA"
                            : course.instructorName!.replace("|", " ")
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Link
                      to={"/instructor-details/" + course.InstructorId}
                      className={"text-white"}
                    >
                      {course.instructorName!.replace("|", " ") === "Admin"
                        ? "LUMINARA"
                        : course.instructorName!.replace("|", " ")}
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
                              coursesInCart.includes(course.id) ? "red-btn" : ""
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
    </>
  );
}

export default CourseGrid;
