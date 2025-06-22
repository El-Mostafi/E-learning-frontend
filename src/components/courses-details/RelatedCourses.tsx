import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { courseDataGenerale } from "../../services/coursService";
import ModelService from "../../services/modelService";
import { Star } from "lucide-react";

const RelatedCourses = () => {
  const [courses, setCourses] = useState<courseDataGenerale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;

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
                    <div className="courses-image ">
                      <img
                        src={
                          course.thumbnailPreview ||
                          "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                        }
                        className="img-fluid min-h-[268px]"
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
                          to="/courses-details"
                          className="line-clamp-2"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/courses-details", {
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
                              ? "Eduspace "
                              : course.instructorName!.replace("|", " ")}
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
                            Enroll Now
                          </Link>
                        </li>
                      </ul>
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
