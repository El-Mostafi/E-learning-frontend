// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { courseDataGenerale } from "../../services/coursService";

interface CourseGridProps {
  courses: courseDataGenerale[];
}

function CourseGrid({ courses }: CourseGridProps) {
  const navigate = useNavigate();

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
                    "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
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
                    to="/courses-details"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/courses-details", {
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
                        ? "Eduspace"
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
                      Learn With {course.level} {course.title} Course
                    </div>
                  </Link>
                </h5>
                <h4>${course.price}</h4>
                <span>Education is only empowers people to pursue career</span>
                <div className="client-items">
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-100">
                    <img
                      src={
                        course.instructorImg ||
                        "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                      }
                      alt={
                        course.instructorName!.replace("|", " ") === "Admin"
                          ? "Eduspace"
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
                      ? "Eduspace"
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
  );
}

export default CourseGrid;