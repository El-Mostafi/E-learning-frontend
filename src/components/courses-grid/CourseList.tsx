// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { courseDataGenerale } from "../../services/coursService";
import { useAuth } from "../../context/AuthContext";

interface CourseListProps {
  courses: courseDataGenerale[];
  handleAddToCart: (courseId: string) => Promise<void>;
  myEnrollments: string[];
  updatingCourseId: string | null;
  coursesInCart: string[];
  cartError: string;
}

function CourseList({
  courses,
  handleAddToCart,
  myEnrollments,
  updatingCourseId,
  coursesInCart,
  cartError,
}: CourseListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <style>
        {`
        .course-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.course-buttons .theme-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-buttons .theme-btn span {
  flex: 1;
}

/* Responsive adjustment */
@media (max-width: 768px) {
  .course-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .course-buttons .theme-btn {
    width: 100%;
    justify-content: center;
  }
}
      `}
      </style>
      <div className="row">
        <div className="col-lg-12">
          {courses.map((course) => (
            <div key={course.id} className="courses-list-items p-3">
              <div className="thumb h-[200px] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
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
              <div className="content w-100">
                <span className="price">${course.price}</span>
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
                    {course.title}
                  </Link>
                </h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: course.description
                      ? course.description.substring(0, 80) + "..."
                      : "",
                  }}
                ></p>
                <ul className="post-class">
                  <li>
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif";
                          }}
                        />
                      </div>
                      <Link to={"/instructor-details/" + course.InstructorId}>
                        {course.instructorName!.replace("|", " ") === "Admin"
                          ? "LUMINARA"
                          : course.instructorName!.replace("|", " ")}
                      </Link>
                    </div>
                  </li>
                  <div className="course-buttons">
                    {/* Primary Action Button */}
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

                    {/* Cart Button - Conditional rendering */}
                    {user &&
                      user.role === "student" &&
                      !myEnrollments.includes(course.id) && (
                        <button
                          onClick={() => handleAddToCart(course.id)}
                          className={`theme-btn ${
                            coursesInCart.includes(course.id) ? "in-cart" : ""
                          }`}
                          disabled={updatingCourseId === course.id}
                        >
                          <i className="far fa-shopping-basket"></i>
                          <span>
                            {updatingCourseId === course.id
                              ? coursesInCart.includes(course.id)
                                ? "Removing..."
                                : "Adding..."
                              : coursesInCart.includes(course.id)
                              ? "In Cart"
                              : "Add to Cart"}
                          </span>
                        </button>
                      )}
                  </div>
                </ul>
                {cartError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {cartError}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CourseList;
