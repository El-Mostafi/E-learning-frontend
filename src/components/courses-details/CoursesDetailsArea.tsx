import { useState, useEffect, useRef,useCallback } from "react";
import { coursService, courseDataDetails } from "../../services/coursService";
import { Link, useLocation } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import VideoPlayer from './VideoPlayer/VideoPlayer';
import ReviewForm from "./ReviewForm";
import courseReviewService from "../../services/courseReviewService";
import CourseProgress from "./CourseProgress";
import VideoNavigation from "./VideoNavigation";
import courseProgressService from "../../services/courseProgressService";
import CouponInput from "./CouponInput";

const CoursesDetailsArea = ({
  setBreadcrumbData,
}: {
  setBreadcrumbData: (data: courseDataDetails) => void;
}) => {
  const [course, setCourse] = useState<courseDataDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const location = useLocation();
  const [currentLectureId, setCurrentLectureId] = useState<string>('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [currentLectureTitle, setCurrentLectureTitle] = useState<string>('');
  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);
  const [totalLectureCount, setTotalLectureCount] = useState<number>(0);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [progress, setProgress] = useState<{completedLectures: string[], totalLectures: number}>({
    completedLectures: [],
    totalLectures: 0
  });
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const courseId = location.state?.courseId;

  // Get all lectures as a flat array for navigation
  const getAllLectures = useCallback(() => {
    if (!course) return [];
    
    const allLectures: {id: string, videoUrl: string, title: string, sectionTitle: string}[] = [];
    
    course.sections.forEach(section => {
      section.lectures.forEach(lecture => {
        allLectures.push({
          id: lecture.id,
          videoUrl: lecture.videoUrl,
          title: lecture.title,
          sectionTitle: section.title
        });
      });
    });
    
    return allLectures;
  }, [course]);

  // Find lecture index in flat array
  const findLectureIndex = useCallback((lectureId: string) => {
    const allLectures = getAllLectures();
    return allLectures.findIndex(lecture => lecture.id === lectureId);
  }, [getAllLectures]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          setError("Course ID is missing");
          setLoading(false);
          return;
        }

        const response = await coursService.getCourseDetails(courseId);
        setCourse(response);
        setBreadcrumbData(response);
        
        const lectureCount = response.sections.reduce(
          (total, section) => total + section.lectures.length, 0
        );
        setTotalLectureCount(lectureCount);
        
        if (response.sections.length > 0 && response.sections[0].lectures.length > 0) {
          const firstLecture = response.sections[0].lectures[0];
          setCurrentLectureId(firstLecture.id);
          setCurrentVideoUrl(firstLecture.videoUrl);
          setCurrentLectureTitle(firstLecture.title);
        }
        
        // Check if course is purchased
        const purchased = await courseProgressService.hasUserPurchasedCourse(courseId);
        setHasPurchased(purchased);
        
        // Get course progress
        const courseProgress = await courseProgressService.getProgress(courseId);
        setProgress({
          completedLectures: courseProgress.completedLectures,
          totalLectures: lectureCount
        });
        
        // If user has a last watched lecture, show that instead
        if (purchased && courseProgress.lastWatchedLectureId) {
          // Find this lecture in the course
          let found = false;
          for (const section of response.sections) {
            for (const lecture of section.lectures) {
              if (lecture.id === courseProgress.lastWatchedLectureId) {
                setCurrentLectureId(lecture.id);
                setCurrentVideoUrl(lecture.videoUrl);
                setCurrentLectureTitle(lecture.title);
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
      } catch (err) {
        setError("Failed to load course. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, setBreadcrumbData]);

  // Update current lecture index when lecture changes
  useEffect(() => {
    if (currentLectureId) {
      const index = findLectureIndex(currentLectureId);
      setCurrentLectureIndex(index !== -1 ? index : 0);
    }
  }, [currentLectureId, findLectureIndex]);

  const handleApplyCoupon = async (code: string) => {
    try {
      // In a real app, this would validate the coupon with your backend
      const discount = 0.2; // 20% discount for demo
      if (course?.price) {
        setDiscountedPrice(course.price * (1 - discount));
      }
    } catch (err) {
      throw new Error('Invalid coupon code');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? "" : "color-2"}`}
        ></i>
      );
    }
    return stars;
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (count: number) => {
    return course!.reviewsLenght > 0
      ? (count / course!.reviewsLenght) * 100
      : 0;
  };
  
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
  
  const markLectureComplete = async (lectureId: string) => {
    if (!courseId || !hasPurchased) return;
    
    try {
      const updatedProgress = await courseProgressService.updateLectureProgress(
        courseId,
        lectureId,
        true,
        totalLectureCount
      );
      
      setProgress({
        completedLectures: updatedProgress.completedLectures,
        totalLectures: updatedProgress.totalLectures
      });
    } catch (err) {
      console.error("Failed to update lecture progress:", err);
    }
  };
  
  const handleLectureSelect = (lectureId: string, videoUrl: string, title: string) => {
    setCurrentLectureId(lectureId);
    setCurrentVideoUrl(videoUrl);
    setCurrentLectureTitle(title);
    
    // Scroll to video player
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
    }
  };
  
  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    if (!courseId) return Promise.reject("Course ID is missing");
    
    try {
      await courseReviewService.submitReview({
        courseId,
        rating: review.rating,
        comment: review.comment
      });
      
      // In a real app, you would refresh the reviews here
      return Promise.resolve();
    } catch (err) {
      console.error("Failed to submit review:", err);
      return Promise.reject(err);
    }
  };
  
  const handlePreviousVideo = () => {
    if (currentLectureIndex > 0) {
      const allLectures = getAllLectures();
      const prevLecture = allLectures[currentLectureIndex - 1];
      handleLectureSelect(prevLecture.id, prevLecture.videoUrl, prevLecture.title);
    }
  };
  
  const handleNextVideo = () => {
    const allLectures = getAllLectures();
    if (currentLectureIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentLectureIndex + 1];
      handleLectureSelect(nextLecture.id, nextLecture.videoUrl, nextLecture.title);
    }
  };
  
  const handlePurchaseCourse = () => {
    // In a real app, this would redirect to checkout
    // For demo purposes, we'll just mark as purchased
    if (courseId) {
      courseProgressService.markCoursePurchased(courseId);
      setHasPurchased(true);
    }
  };

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

  if (!course) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .thumb img {
            border-radius: 50% !important;
          }
          
          .video-navigation .btn {
            transition: all 0.3s ease;
          }
          
          .video-navigation .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .rating-container .fas {
            transition: color 0.2s ease;
          }
          
          .progress-bar {
            transition: width 0.5s ease-in-out;
          }
          
          .course-progress {
            animation: fadeIn 0.5s ease-in;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .continue-learning-btn {
            background: linear-gradient(45deg, #4481eb, #04befe);
            border: none;
            transition: all 0.3s ease;
          }
          
          .continue-learning-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 118, 255, 0.3);
          }
        `}
      </style>
      <section className="courses-details-section section-padding pt-0">
        <div className="container">
          <div className="courses-details-wrapper">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="courses-details-items">
                  <div ref={videoPlayerRef} className="courses-image">
                    <VideoPlayer
                      src={currentVideoUrl || course.sections[0].lectures[0].videoUrl}
                      poster={course.thumbnailPreview}
                      title={currentLectureTitle || course.sections[0].lectures[0].title}
                      duration={course.duration}
                      isLocked={!hasPurchased}
                      onComplete={() => markLectureComplete(currentLectureId)}
                    />
                  </div>
                  
                  {hasPurchased && (
                    <>
                      <VideoNavigation 
                        currentLectureIndex={currentLectureIndex}
                        totalLectures={totalLectureCount}
                        onPreviousVideo={handlePreviousVideo}
                        onNextVideo={handleNextVideo}
                      />
                      
                      <CourseProgress 
                        completedLectures={progress.completedLectures.length}
                        totalLectures={progress.totalLectures}
                      />
                    </>
                  )}
                  
                  <div className="courses-details-content">
                    <ul className="nav">
                      <li
                        className="nav-item wow fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <a
                          href="#Course"
                          data-bs-toggle="tab"
                          className="nav-link active"
                        >
                          Course Info
                        </a>
                      </li>
                      <li
                        className="nav-item wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <a
                          href="#Curriculum"
                          data-bs-toggle="tab"
                          className="nav-link"
                        >
                          Curriculum
                        </a>
                      </li>
                      <li
                        className="nav-item wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <a
                          href="#Instructors"
                          data-bs-toggle="tab"
                          className="nav-link"
                        >
                          Instructors
                        </a>
                      </li>
                      <li
                        className="nav-item wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <a
                          href="#Reviews"
                          data-bs-toggle="tab"
                          className="nav-link bb-none"
                        >
                          Reviews
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div id="Course" className="tab-pane fade show active">
                        <div className="description-content">
                          <h3>Description</h3>
                          <p className="mb-3">{course.description}</p>
                          <h3 className="mt-5">
                            What you'll learn in this course?
                          </h3>
                          <p className="mb-4">
                            This comprehensive course covers everything you need
                            to know about {course.title}.
                          </p>
                          <div className="row g-4 mb-5">
                            <div className="col-lg-6">
                              <ul className="list-item">
                                {course.sections?.slice(0, 5).map((section) => (
                                  <li key={section.id}>
                                    <i className="fas fa-check-circle"></i>
                                    {section.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-lg-6">
                              <ul className="list-item">
                                {course.sections
                                  ?.slice(5, 10)
                                  .map((section) => (
                                    <li key={section.id}>
                                      <i className="fas fa-check-circle"></i>
                                      {section.title}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                          <h3>How to Benefits in this Course</h3>
                          <p>
                            This {course.level} level course is designed to
                            provide you with practical skills and knowledge that
                            you can apply immediately. With{" "}
                            {formatDuration(course.duration)} of content, you'll
                            gain expertise in {course.category} that will help
                            advance your career.
                          </p>
                        </div>
                      </div>

                      <div id="Curriculum" className="tab-pane fade">
                        <div className="course-curriculum-items">
                          <h3>Course Curriculum</h3>
                          <div className="courses-faq-items">
                            <Accordion defaultActiveKey="0">
                              {course.sections.map((section, sectionIndex) => (
                                <Accordion.Item
                                  key={`section-${sectionIndex}`}
                                  eventKey={String(sectionIndex)}
                                >
                                  <Accordion.Header>
                                    {section.title}
                                  </Accordion.Header>
                                  <Accordion.Body
                                    style={{
                                      display: "block",
                                      visibility: "visible",
                                    }}
                                  >
                                    <ul>
                                      {section.lectures?.map((lecture, i) => (
                                        <li 
                                          className="cursor-pointer d-flex justify-content-between align-items-center hover:bg-gray-100" 
                                          onClick={() => handleLectureSelect(lecture.id, lecture.videoUrl, lecture.title)} 
                                          key={lecture.id}
                                          style={{
                                            backgroundColor: currentLectureId === lecture.id ? 'rgba(0,0,0,0.05)' : '',
                                           
                                          }}
                                        >
                                          <span className="d-flex align-items-center">
                                            <i className="fas fa-file-alt me-2"></i>
                                            <span>
                                              Lesson {i + 1}: {lecture.title}
                                              {progress.completedLectures.includes(lecture.id) && (
                                                <i className="fas fa-check-circle ms-2 text-success"></i>
                                              )}
                                            </span>
                                          </span>
                                          <span>
                                            <i
                                              className={
                                                !hasPurchased
                                                  ? "far fa-lock"
                                                  : lecture.isPreview
                                                  ? "far fa-play-circle"
                                                  : "far fa-unlock"
                                              }
                                            ></i>
                                            ({Math.floor(lecture.duration / 60)}
                                            :
                                            {Math.round(lecture.duration % 60)
                                              .toString()
                                              .padStart(2, "0")}{" "}
                                            min)
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          </div>
                        </div>
                      </div>
                      <div id="Instructors" className="tab-pane fade">
                        <div className="instructors-items">
                          <h3>Instructors</h3>
                          <div className="instructors-box-items">
                            <div className="thumb">
                              <img
                                src={
                                  course.instructorImg ||
                                  "assets/img/courses/instructors-1.png"
                                }
                                alt={course.instructorName.replace("|", " ")}
                              />
                            </div>
                            <div className="content">
                              <h4>{course.instructorName.replace("|", " ")}</h4>
                              <span>
                                {course.instructorExpertise ||
                                  "Lead Instructor"}
                              </span>
                              <p>
                                {course.instructorBaiography ||
                                  "Experienced instructor with expertise in this field."}
                              </p>
                              <div className="social-icon">
                                <Link to="#">
                                  <i className="fab fa-facebook-f"></i>
                                </Link>
                                <Link to="#">
                                  <i className="fab fa-instagram"></i>
                                </Link>
                                <Link to="#">
                                  <i className="fab fa-dribbble"></i>
                                </Link>
                                <Link to="#">
                                  <i className="fab fa-behance"></i>
                                </Link>
                                <Link to="#">
                                  <i className="fab fa-linkedin-in"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="Reviews" className="tab-pane fade">
                        <div className="courses-reviews-items">
                          <h3>Course Reviews</h3>
                          <div className="courses-reviews-box-items">
                            <div className="courses-reviews-box">
                              <div className="reviews-box">
                                <h2>
                                  <span className="count">
                                    {course.reviews.toFixed(1)}
                                  </span>
                                </h2>
                                <div className="star">
                                  {renderStars(Math.round(course.reviews))}
                                </div>
                                <p>{course.reviewsLenght}+ Reviews</p>
                              </div>
                              <div className="reviews-ratting-right">
                                {course.ratingsCount.map((count, index) => {
                                  const stars = 5 - index;
                                  return (
                                    <div
                                      className="reviews-ratting-item"
                                      key={stars}
                                    >
                                      <div className="star">
                                        {renderStars(stars)}
                                      </div>
                                      <div className="progress">
                                        <div
                                          className={`progress-value style-${stars}`}
                                          style={{
                                            width: `${calculatePercentage(
                                              count
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>({count})</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            {course.feedbacks?.map((review, index) => (
                              <div
                                className="instructors-box-items"
                                key={index}
                              >
                                <div className="thumb">
                                  <img
                                    src={
                                      review.userImg ||
                                      "assets/img/courses/instructors-3.png"
                                    }
                                    alt={review.userName}
                                  />
                                </div>
                                <div className="content">
                                  <h4>{review.userName}</h4>
                                  {/* <span>{review.fieldOfStudy}</span> */}
                                  <div className="star">
                                    {renderStars(review.rating)}
                                  </div>
                                  <p>"{review.comment}"</p>
                                </div>
                              </div>
                            ))}
                            
                            {/* Add review form for users who purchased the course */}
                            {hasPurchased && (
                              <ReviewForm 
                                courseId={courseId}
                                onSubmitReview={handleSubmitReview}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="courses-sidebar-area sticky-style">
                  <div className="courses-items">
                    <div className="courses-image">
                      <img
                        src={
                          course.thumbnailPreview || "assets/img/courses/22.jpg"
                        }
                        alt={course.title}
                      />
                      <h3 className="courses-title">
                        {course.category || "Development"}
                      </h3>
                      <h4 className="topic-title">{course.title}</h4>
                      <div className="arrow-items">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`GlidingArrow ${
                              i > 0 ? `delay${i}` : ""
                            }`}
                          >
                            <img
                              src={`assets/img/courses/a${i + 1}.png`}
                              alt="img"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="courses-content">
                      <h3>
                        ${discountedPrice?.toFixed(2) || course.price?.toFixed(2) || "XXXX"}
                        {discountedPrice && (
                          <span className="original-price text-muted text-decoration-line-through ms-2">
                            ${course.price?.toFixed(2)}
                          </span>
                        )}
                      </h3>
                      <p>{course.description?.substring(0, 80)}...</p>
                      
                      {!hasPurchased && (
                        <CouponInput onApplyCoupon={handleApplyCoupon} />
                      )}
                      
                      <div className="courses-btn">
                        {!hasPurchased ? (
                          <>
                            <a href="#" className="theme-btn" onClick={(e) => { e.preventDefault(); handlePurchaseCourse(); }}>
                              Add to Cart
                            </a>
                            <a href="#" className="theme-btn style-2" onClick={(e) => { e.preventDefault(); handlePurchaseCourse(); }}>
                              Buy Course
                            </a>
                          </>
                        ) : (
                          <>
                            <a href="#" className="theme-btn continue-learning-btn mr-4" onClick={(e) => {
                              e.preventDefault();
                              if (videoPlayerRef.current) {
                                videoPlayerRef.current.scrollIntoView({ 
                                  behavior: 'smooth',
                                  block: 'center' 
                                });
                              }
                            }}>
                              <i className="fas fa-play-circle me-2"></i>
                              Continue Learning
                            </a>
                            <div className="mt-3 d-flex justify-content-between">
                              <span className={progress.completedLectures.length === progress.totalLectures ? "text-success" : ""}>
                                <i className="fas fa-graduation-cap me-2"></i>
                                {Math.round((progress.completedLectures.length / progress.totalLectures) * 100)}% Complete
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="courses-category-items">
                    <h5>Course Includes:</h5>
                    <ul>
                      <li>
                        <span>
                          <i className="far fa-chalkboard-teacher"></i>
                          Instructor
                        </span>
                        <span className="text">
                          {course.instructorName.replace("|", " ")}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-user"></i>
                          Lesson
                        </span>
                        <span className="text">
                          {course.sections.reduce(
                            (total, section) => total + section.lectures.length,
                            0
                          )}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-clock"></i>
                          Duration
                        </span>
                        <span className="text">
                          {formatDuration(course.duration)}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-user"></i>
                          Students
                        </span>
                        <span className="text">{course.students}+</span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-globe"></i>
                          Language
                        </span>
                        <span className="text">English</span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-calendar-alt"></i>
                          Created
                        </span>
                        <span className="text">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-signal-alt"></i>
                          Skill Level
                        </span>
                        <span className="text">{course.level}</span>
                      </li>
                      <li>
                        <span>
                          <i className="fal fa-medal"></i>
                          Certifications
                        </span>
                        <span className="text">Yes</span>
                      </li>
                    </ul>
                    <a href="#" className="share-btn">
                      <i className="fas fa-share"></i> Share this course
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesDetailsArea;