import { Link, useNavigate } from "react-router-dom";
import NiceSelect from "../../ui/NiceSelect";
import { useEffect, useState } from "react";
import {
  courseData,
  enrollmentService,
} from "../../services/enrollmentService";

const StudentCoursesArea = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<courseData[]>([]);

  const selectHandler = () => {};

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await enrollmentService.getEnrolledCourses();
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="popular-courses-section fix section-padding">
      <div className="container">
        <div className="coureses-notices-wrapper">
          <div className="courses-showing">
            <h5>
              Showing <span>1-{courses.length}</span> Of{" "}
              <span>{courses.length}</span> Results
            </h5>
          </div>
          <div className="form-clt">
            <NiceSelect
              className="category"
              options={[
                { value: "01", text: "Sort by : Default" },
                { value: "02", text: "Sort by popularity" },
                { value: "03", text: "Sort by average rating" },
                { value: "04", text: "Sort by latest" },
              ]}
              defaultCurrent={0}
              onChange={selectHandler}
              name=""
              placeholder=""
            />
          </div>
        </div>
        <div className="row">
          {courses.map((course) => (
            <div key={course.id} className="col-xl-4 col-lg-6 col-md-6">
              <div className="courses-card-main-items">
                <div className="courses-card-items style-2">
                  <div className="courses-image">
                    <img
                      src={
                        course.thumbnailPreview || "assets/img/courses/09.jpg"
                      }
                      alt={course.title}
                    />
                    <h3 className="courses-title">{course.category.name}</h3>
                    <h4 className="topic-title">{course.title}</h4>
                    <div className="arrow-items">
                      {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div
                          key={index}
                          className={`GlidingArrow delay${index - 1}`}
                        >
                          <img
                            src={`assets/img/courses/a${index}.png`}
                            alt="decoration"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="courses-content">
                    <ul className="post-cat">
                      <li>
                        <Link to={`/courses/${course.id}`}>
                          {course.category.name}
                        </Link>
                      </li>
                      <li>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} 
                          className={star<course.rating! ? "fas fa-star" : "far fa-star"}>

                          </i>
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
                        dangerouslySetInnerHTML={{
                          __html: `${course.description.substring(0, 60)}...`,
                        }}
                      ></Link>
                    </h3>
                    <div className="client-items">
                      <div
                        className="client-img bg-cover"
                        style={{
                          background: `url(${
                            course || "/assets/img/courses/client-1.png"
                          })`,
                        }}
                      ></div>
                      <p>{course.instructorName || "Unknown Instructor"}</p>
                    </div>
                    <ul className="post-class">
                      <li>
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              Progress
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${course.progress}%`,
                              }}
                            />
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {/* {course.completedSections.length} of{" "}
                            {course.sections.reduce(
                              (total, section) =>
                                total + section.lectures.length,
                              0
                            )}{" "}
                            lessons completed{" "} */}
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link
                          to="/courses-details"
                          className="theme-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/courses-details", {
                              state: { courseId: course.id },
                            });
                          }}
                        >
                          {course.progress === 100 ? (
                            <span className="text-green-500">Completed</span>
                          ) : (
                            <span>
                              <span className="text-blue-500">Continue</span>
                              <i className="fas fa-arrow-right"></i>
                            </span>
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="page-nav-wrap pt-5 text-center">
          <ul>
            {[1, 2, 3, 4].map((page) => (
              <li key={page}>
                <a className="page-numbers" href="#">
                  {page}
                </a>
              </li>
            ))}
            <li>
              <a className="page-numbers" href="#">
                <i className="far fa-arrow-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StudentCoursesArea;
