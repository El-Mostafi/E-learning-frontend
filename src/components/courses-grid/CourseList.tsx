// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { courseDataGenerale } from "../../services/coursService";

interface CourseListProps {
  courses: courseDataGenerale[];
}

function CourseList({ courses }: CourseListProps) {
  const navigate = useNavigate();

  return (
    <div className="row">
      <div className="col-lg-12">
        {courses.map((course) => (
          <div key={course.id} className="courses-list-items p-3">
            <div className="thumb">
              <img
                src={
                  course.thumbnailPreview ||
                  "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
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
                  to="/courses-details"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/courses-details", {
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
                            ? "Eduspace"
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
                        ? "Eduspace"
                        : course.instructorName!.replace("|", " ")}
                    </Link>
                  </div>
                </li>
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
        ))}
      </div>
    </div>
  );
}

export default CourseList;