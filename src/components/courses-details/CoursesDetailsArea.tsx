import { useNavigate } from "react-router-dom";
import {
  QuizQuestion,
  Review,
  coursService,
  courseData,
} from "../../services/coursService";
import axiosInstance from "../../services/api";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, Button } from "react-bootstrap";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import {
  enrollmentService,
  completedSection,
} from "../../services/enrollmentService";
import CouponInput from "./CouponInput";
import axios from "axios";
import QuizComponent from "./QuizComponent";
import { X, Award, CheckCircle, Download, Play } from "lucide-react";
import ModernReviewForm from "./Review/ModernReviewForm";
import ReviewsList from './Review/ReviewsList';

const CoursesDetailsArea = ({
  setBreadcrumbData,
}: {
  setBreadcrumbData: (data: courseData) => void;
}) => {
  const [course, setCourse] = useState<courseData>();
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);
  const [, setCouponError] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartChecking, setCartChecking] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const courseId = location.state?.courseId;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentSectionId, setCurrentSectionId] = useState<string>("");
  const [currentLectureId, setCurrentLectureId] = useState<string>("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [currentLectureTitle, setCurrentLectureTitle] = useState<string>("");
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);

  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<string>("success");
  const [lectureCount, setLectureCount] = useState<number>(0);
  const [lectureCountCompleted, setLectureCountCompleted] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<
    completedSection[]
  >([]);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [takeCertificate, setTakeCertificate] = useState<boolean>(false);
  const [quizzeQuestions, setQuizzeQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [animate, ] = useState(true);
  const styleSuffixes = ["one", "two", "three", "four", "five"];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          setCartError("Course ID is missing");
          setLoading(false);
          return;
        }
        const response = await coursService.getCourseDetails(courseId);
        setCourse(response);
        setBreadcrumbData(response);
        setCurrentSectionId(response.sections[0].id);
        setCurrentLectureId(response.sections[0].lectures[0].id);
        setCurrentLectureTitle(response.sections[0].lectures[0].title);
        setCurrentSectionIndex(0);
        setCurrentLectureIndex(0);

        if (response.isUserEnrolled) {
          setCurrentVideoUrl(
            response.sections[0]!.lectures[0]!.videoUrl! || ""
          );
          setProgress(response.progress!);
          setCompleted(response.completed!);
        }

        setIsUserEnrolled(response.isUserEnrolled);
        const lectureCount = response.sections.reduce(
          (total, section) => total + section.lectures.length,
          0
        );
        setLectureCount(lectureCount);

        // console.log("Course Response", response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data);
          setError(error.response?.data?.message);
        } else {
          console.error("Unexpected error:", error);
          setError("Failed to fetch course data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, setBreadcrumbData]);

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        if (!courseId) return;

        const response = await axiosInstance.get("/cart");
        const cartItems = response.data.courses;
        const inCart = cartItems.some((item: { _id: string }) => item._id === courseId);
        setIsInCart(inCart);
      } catch (error) {
        console.error("Error checking cart status:", error);
      } finally {
        setCartChecking(false);
      }
    };

    checkCartStatus();
  }, [courseId]);
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        if (!courseId) return;

        const response = await enrollmentService.getEnrolledCourseById(
          courseId
        );
        setCompletedSections(response.completedSections);
        setLectureCountCompleted(response.completedSections.length);
        setTakeCertificate(response.hasPassedQuizze);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("API Error:", error.response?.data);
          setError(error.response?.data?.message);
        } else {
          console.error("Unexpected error:", error);
          setError("Failed to fetch enrollment data");
        }
      }
    };

    fetchEnrollment();
  }, [courseId]);
  const markLectureComplete = async () => {
    try {
      if (!course) {
        return;
      }
      const result = await enrollmentService.updateProgress(
        courseId,
        currentSectionId,
        currentLectureId
      );
      console.log(courseId, currentSectionId, currentLectureId);

      // Ensure progress is within 0-100 range
      const updatedProgress = Math.min(Math.max(result.progress, 0), 100);
      setProgress(updatedProgress);
      setCompleted(result.completed);
      setCompletedSections(result.completedSections);
      setLectureCountCompleted(result.completedSections.length);

      const currentSection = course.sections[currentSectionIndex];
      let nextSectionIndex = currentSectionIndex;
      let nextLectureIndex = currentLectureIndex;

      if (currentLectureIndex < currentSection.lectures.length - 1) {
        nextLectureIndex = currentLectureIndex + 1;
      } else if (currentSectionIndex < course.sections.length - 1) {
        nextSectionIndex = currentSectionIndex + 1;
        nextLectureIndex = 0;
      }

      // Update state in one batch
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentLectureIndex(nextLectureIndex);
      setCurrentSectionId(course.sections[nextSectionIndex].id);
      setCurrentLectureId(
        course.sections[nextSectionIndex].lectures[nextLectureIndex].id
      );
      setCurrentVideoUrl(
        course.sections[nextSectionIndex].lectures[nextLectureIndex]
          .videoUrl! || ""
      );
      setCurrentLectureTitle(
        course.sections[nextSectionIndex].lectures[nextLectureIndex].title
      );
    } catch (error) {
      console.error("Error marking lecture as complete:", error);
      setError("Failed to mark lecture as complete. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    // console.log("Rating:", rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? "" : "color-2"}`}
        ></i>
      );
    }
    // console.log("Stars:", stars);
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

  const handleLectureSelect = (
    sectionId: string,
    lectureId: string,
    videoUrl: string,
    title: string,
    sectionIndex: number = 0,
    lectureIndex: number = 0
  ) => {
    setCurrentSectionId(sectionId);
    setCurrentLectureId(lectureId);
    setCurrentVideoUrl(videoUrl || "");
    setCurrentLectureTitle(title);
    setCurrentSectionIndex(sectionIndex);
    setCurrentLectureIndex(lectureIndex);

    // Scroll to video player
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleCartAction = async () => {
    try {
      setCartLoading(true);
      setCartError("");

      if (!courseId) throw new Error("Course ID is missing");

      if (isInCart) {
        await axiosInstance.delete("/cart/remove", { data: { courseId } });
      } else {
        await axiosInstance.post("/cart/add", { courseId });
        if (appliedCoupon) {
          await axiosInstance.post("/cart/apply-coupon", {
            courseId,
            couponCode: appliedCoupon.code,
          });
        }
      }

      // Toggle the cart state after successful operation
      setIsInCart(!isInCart);
      alert(
        `Course ${isInCart ? "removed from" : "added to"} cart successfully!`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setCartError(error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
        setCartError(
          `Failed to ${isInCart ? "remove" : "add"} course. Please try again.`
        );
      }
      console.error(error);
    } finally {
      setCartLoading(false);
      setAppliedCoupon(null);
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuyNowLoading(true);
      setCartError("");

      if (!courseId) {
        throw new Error("Course ID is missing");
      }

      // Add to cart if not already added
      if (!isInCart) {
        await axiosInstance.post("/cart/add", { courseId });

        // Apply coupon if exists
        if (appliedCoupon) {
          await axiosInstance.post("/cart/apply-coupon", {
            courseId,
            couponCode: appliedCoupon.code,
          });
        }

        setIsInCart(true);
      }

      // Redirect to cart page
      navigate("/shop-cart");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setCartError(error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
        setCartError("Failed to proceed to checkout. Please try again.");
      }
      console.error(error);
    } finally {
      setBuyNowLoading(false);
      setAppliedCoupon(null);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    try {
      console.log("Applying coupon:", code, courseId);
      setCouponError("");
      if (!code || !courseId) {
        setCouponError("Please enter a coupon code");
        return false;
      }

      const discount = await coursService.verifyCoupon(courseId, code);
      if (!discount) {
        setCouponError("Invalid or expired coupon code");
        return false;
      }

      setAppliedCoupon({
        code: code,
        discountPercentage: discount,
      });
      console.log("Coupon applied successfully:", discount);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setCouponError(error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
        setCouponError("Invalid or expired coupon code");
      }
      setAppliedCoupon(null);
      return false;
    }
  };

  const handleSubmitReview = async (reviewData: {
    rating: number;
    comment: string;
  }) => {
    setIsSubmitting(true);
    setStatusMessage("");
    setStatusType("success");

    try {
      if (!courseId) {
        setStatusMessage("Course ID is missing");
        setStatusType("error");
        return;
      }

      const reviewToSubmit: Review = {
        ...reviewData,
        createdAt: new Date(),
      };

      const response = await coursService.rateCourse(courseId, reviewToSubmit);
      if (response) {
        console.log("Review submitted successfully:", response);
        setStatusMessage(response);
        setStatusType("success");
        const updatedCourse = await coursService.getCourseDetails(courseId);
        setCourse(updatedCourse);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        setStatusMessage(error.response?.data?.message);
      } else {
        console.error("Unexpected error:", error);
        setStatusMessage("Failed to submit review");
      }
      setStatusType("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleQuizComplete = async (score: number) => {
    try {
      console.log("Quiz completed with score:", score);

      if (score >= 70) {
        console.log("User passed the quiz!");

        const response = await enrollmentService.markQuizPassed(
          courseId,
          score
        );
        setTakeCertificate(response.hasPassedQuizze);
        console.log("Course marked as completed.");
      } else {
        console.log("User did not pass the quiz.");
      }
    } catch (err) {
      console.error("Failed to save quiz results:", err);
    }
  };
  const handleShowQuiz = async () => {
    setShowQuiz(true);

    if (quizzeQuestions.length === 0) {
      try {
        setLoadingQuiz(true);
        const response = await coursService.getQuiz(courseId);
        setQuizzeQuestions(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoadingQuiz(false);
      }
    }
  };
  const getProgressStyleClass = (
    currentStars: number,
    ratingsCounts: number[]
  ) => {
    if (!ratingsCounts || ratingsCounts.length !== 5) {
      return `style-${styleSuffixes[2]}`;
    }

    const ratingsWithDetails = ratingsCounts.map((count, index) => ({
      stars: index + 1,
      count: count,
      originalIndex: index,
    }));

    const sortedRatings = [...ratingsWithDetails].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return b.stars - a.stars;
    });

    const rank = sortedRatings.findIndex((item) => item.stars === currentStars);

    if (rank !== -1 && rank < styleSuffixes.length) {
      return `style-${styleSuffixes[rank]}`;
    }

    return `style-${styleSuffixes[2]}`;
  };

  const GetCertificate = () => {
    console.log("takeCertificate", takeCertificate);
  };
  const renderQuizSection = () => {
    if (!isUserEnrolled) return null;

    if (!completed) return null;

    return (
      <>
        <div className="mt-8">
          <div className="text-center mb-8">
            <div className="bg-green-50 rounded-lg p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                🎉 Congratulations on completing the course!
              </h3>
              <p className="text-green-700 mb-6">
                You've watched all the lectures. Ready to test your knowledge?
              </p>
              <button
                onClick={handleShowQuiz}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Take Final Quiz
              </button>
            </div>
          </div>
        </div>
        {showQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-4xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Final Quiz
                </h2>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {loadingQuiz ? (
                <p className="text-center text-gray-600">Loading quiz...</p>
              ) : (
                <QuizComponent
                  questions={quizzeQuestions}
                  onComplete={handleQuizComplete}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
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

  const currentSection = course.sections[currentSectionIndex];
  // const currentLecture = currentSection?.lectures[currentLectureIndex];

  return (
    <>
      <style>
        {`
        .thumb img {
        border-radius: 50% !important;
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
                      src={
                        currentVideoUrl ||
                        course.sections[0].lectures[0].videoUrl ||
                        ""
                      }
                      poster={course.thumbnailPreview}
                      title={
                        currentLectureTitle ||
                        course.sections[0].lectures[0].title
                      }
                      duration={course.duration}
                      isLocked={!isUserEnrolled}
                      onComplete={() => markLectureComplete()}
                    />
                  </div>
                  {isUserEnrolled && (
                    <>
                      <div className="video-navigation mt-3 mb-4 d-flex justify-content-between">
                        <Button
                          className="btn btn-outline-primary d-flex align-items-center"
                          variant="outline-secondary"
                          disabled={
                            currentSectionIndex === 0 &&
                            currentLectureIndex === 0
                          }
                          onClick={() => {
                            const newIndex =
                              currentLectureIndex > 0
                                ? currentLectureIndex - 1
                                : course.sections[currentSectionIndex - 1]
                                    ?.lectures.length - 1;
                            const newSection =
                              currentLectureIndex > 0
                                ? currentSectionIndex
                                : currentSectionIndex - 1;

                            handleLectureSelect(
                              course.sections[newSection].id,
                              course.sections[newSection].lectures[newIndex].id,
                              course.sections[newSection].lectures[newIndex]
                                .videoUrl,
                              course.sections[newSection].lectures[newIndex]
                                .title,
                              newSection,
                              newIndex
                            );
                          }}
                        >
                          <i className="fas fa-arrow-left me-2"></i>
                          Previous Lecture
                        </Button>
                        <div className="d-flex align-items-center">
                          <span className="mx-3 text-muted">
                            {currentLectureIndex + 1} / {lectureCount}
                          </span>
                        </div>
                        <Button
                          className="btn btn-primary d-flex align-items-center"
                          disabled={
                            currentSectionIndex ===
                              course.sections.length - 1 &&
                            currentLectureIndex ===
                              currentSection.lectures.length - 1 &&
                            completed
                          }
                          variant={
                            currentSectionIndex ===
                              course.sections.length - 1 &&
                            currentLectureIndex ===
                              currentSection.lectures.length - 1 &&
                            completed
                              ? "success"
                              : "primary"
                          }
                          onClick={markLectureComplete}
                        >
                          {currentSectionIndex === course.sections.length - 1 &&
                          currentLectureIndex ===
                            currentSection.lectures.length - 1 &&
                          !completed ? (
                            "Complete Course"
                          ) : currentSectionIndex ===
                              course.sections.length - 1 &&
                            currentLectureIndex ===
                              currentSection.lectures.length - 1 &&
                            completed ? (
                            "Completed"
                          ) : (
                            <>
                              Next Lecture
                              <i className="fas fa-arrow-right ms-2"></i>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="course-progress mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="m-0">Course Progress</h5>
                          <span className="progress-percentage">
                            {progress}%
                          </span>
                        </div>

                        <div
                          className="progress"
                          style={{ height: "7px", borderRadius: "5px" }}
                        >
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{
                              width: `${progress}%`,
                              background: "linear-gradient( #4481eb, #04befe)",
                              borderRadius: "5px",
                              height: "7px",
                            }}
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>

                        <div className="d-flex justify-content-between mt-2 text-muted">
                          <small>
                            Completed: {lectureCountCompleted} lectures
                          </small>
                          <small>Total: {lectureCount} lectures</small>
                        </div>
                      </div>
                    </>
                  )}
                  {renderQuizSection()}

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
                          <p
                            className="mb-3"
                            dangerouslySetInnerHTML={{
                              __html: course.description,
                            }}
                          ></p>
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
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleLectureSelect(
                                              section.id,
                                              lecture.id,
                                              lecture.videoUrl,
                                              lecture.title,
                                              sectionIndex,
                                              i
                                            )
                                          }
                                          key={lecture.id}
                                        >
                                          <span>
                                            <i className="fas fa-file-alt"></i>
                                            Lesson {i + 1}: {lecture.title}
                                          </span>
                                          <span>
                                            <i
                                              className={
                                                !isUserEnrolled
                                                  ? "far fa-lock"
                                                  : completedSections.some(
                                                      (section) =>
                                                        section.lectureId.toString() ===
                                                        lecture.id.toString()
                                                    )
                                                  ? "far fa-check-circle text-green-500"
                                                  : "far fa-play-circle text-blue-500"
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
                                alt={course.instructorName!.replace("|", " ")}
                              />
                            </div>
                            <div className="content">
                              <h4>
                                {course.instructorName!.replace("|", " ")}
                              </h4>
                              <span>
                                {course.instructorExpertise ||
                                  "Lead Instructor"}
                              </span>
                              <p>
                                {course.instructorBiography ||
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
                                {[1, 2, 3, 4, 5].map((starValue) => {
                                  const countForThisStar =
                                    course.ratingsCount[starValue - 1];
                                  const progressStyleClass =
                                    getProgressStyleClass(
                                      starValue,
                                      course.ratingsCount
                                    );

                                  return (
                                    <div
                                      className="reviews-ratting-item"
                                      key={starValue}
                                    >
                                      <div className="star">
                                        {renderStars(starValue)}
                                      </div>
                                      <div className="progress">
                                        <div
                                          className={`progress-value ${progressStyleClass}`}
                                          style={{
                                            width: `${calculatePercentage(
                                              countForThisStar
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>({countForThisStar})</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {
                              /* Review Form */
                              // Allowed to rate the course only if the participant has a progress >= 25%
                            }

                            {isUserEnrolled && progress >= 25 && (
                              <ModernReviewForm
                                onSubmit={handleSubmitReview}
                                isSubmitting={isSubmitting}
                                statusMessage={statusMessage}
                                statusType={statusType}
                              />
                            )}
                            <ReviewsList reviews={course.feedbacks || []} />
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
                    <div
                      className="courses-image"
                      style={{
                        backgroundColor: "#4B0082",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <img
                        src={
                          course.thumbnailPreview || "assets/img/courses/22.jpg"
                        }
                        alt={course.title}
                        style={{
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <h3
                        className="courses-title"
                        style={{ color: "#AAAF00" }}
                      >
                        {course.category || "Not Specified!"}
                      </h3>
                      <h4 className="topic-title" style={{ color: "#AA00FF" }}>
                        {course.title}
                      </h4>
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
                              style={{ filter: "brightness(1.2)" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {!isUserEnrolled ? (
                      <div className="courses-content">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: course.description
                              ? course.description.substring(0, 80) + "..."
                              : "",
                          }}
                        ></p>

                        <h3>
                          {appliedCoupon ? (
                            <>
                              <s>${course.price?.toFixed(2)}</s> $
                              {(
                                course.price *
                                (1 - appliedCoupon.discountPercentage / 100)
                              ).toFixed(2)}
                            </>
                          ) : (
                            `$${course.price?.toFixed(2) || "XXXX"}`
                          )}
                        </h3>
                        {/* Coupon Section */}
                        <CouponInput onApplyCoupon={handleApplyCoupon} />

                        {/* Buttons */}
                        <div className="courses-btn">
                          {cartChecking ? (
                            <button className="theme-btn" disabled>
                              Checking Cart...
                            </button>
                          ) : (
                            <button
                              className={`theme-btn ${
                                isInCart ? "bg-danger border-danger" : ""
                              }`}
                              onClick={handleCartAction}
                              disabled={cartLoading}
                              style={
                                isInCart
                                  ? {
                                      backgroundColor: "#dc3545",
                                      borderColor: "#dc3545",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              {cartLoading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  {isInCart ? "Removing..." : "Adding..."}
                                </>
                              ) : isInCart ? (
                                "Remove from Cart"
                              ) : (
                                "Add to Cart"
                              )}
                            </button>
                          )}
                          <button
                            className="theme-btn style-2"
                            onClick={handleBuyNow}
                            disabled={buyNowLoading}
                          >
                            {buyNowLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Redirecting...
                              </>
                            ) : (
                              "Buy Course"
                            )}
                          </button>
                        </div>
                        {/* Display cart error below buttons */}
                        {cartError && (
                          <div
                            className="alert alert-danger mt-3"
                            role="alert"
                            style={{
                              borderRadius: "5px",
                              padding: "10px",
                              fontSize: "0.9rem",
                            }}
                          >
                            {cartError}
                          </div>
                        )}
                      </div>
                    ) : (
                      // For enrolled users
                      <>
                        <div className="enrolled-course-card">
                          {completed && (
                            <div className="completion-badge">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            {completed ? (
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse-slow">
                                <CheckCircle className="w-6 h-6" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Play className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <h3
                                className={`font-bold ${
                                  completed
                                    ? "text-emerald-800"
                                    : "text-blue-800"
                                }`}
                              >
                                {completed
                                  ? "Course Completed!"
                                  : "In Progress"}
                              </h3>
                              <p
                                className={`text-sm ${
                                  completed
                                    ? "text-emerald-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {completed
                                  ? "Great achievement!"
                                  : "Keep learning!"}
                              </p>
                            </div>
                          </div>

                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                ref={progressRef}
                                className="progress-fill"
                                style={{
                                  width: animate ? `${progress}%` : "0%",
                                }}
                              />
                            </div>
                            <div className="progress-stats">
                              <div className="flex justify-between items-center">
                                <span>{Math.round(progress)}% Complete</span>
                                <span className="text-xs opacity-75">
                                  Your Progress
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            {!completed && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (videoPlayerRef.current) {
                                    videoPlayerRef.current.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                  }
                                }}
                                className="continue-learning-btn"
                              >
                                <Play className="w-4 h-4" />
                                Continue Learning
                              </button>
                            )}

                            {completed && takeCertificate && (
                              <button
                                onClick={GetCertificate}
                                className="certificate-btn"
                              >
                                <Award className="w-5 h-5" />
                                Get Certificate
                                <Download className="w-4 h-4" />
                              </button>
                            )}

                            {completed && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (videoPlayerRef.current) {
                                    videoPlayerRef.current.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    });
                                  }
                                }}
                                className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                              >
                                <Play className="w-4 h-4" />
                                Review Course
                              </button>
                            )}
                          </div>

                          {completed && (
                            <div className="mt-4 flex justify-center">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                🏆 Achievement Unlocked
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="courses-category-items">
                    <h5>Course Includes:</h5>
                    <ul>
                      <li>
                        <span>
                          <i className="far fa-chalkboard-teacher"></i>{" "}
                          Instructor
                        </span>
                        <span className="text">
                          {course.instructorName!.replace("|", " ")}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-book-open"></i> Lessons
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
                          <i className="far fa-clock"></i> Duration
                        </span>
                        <span className="text">
                          {formatDuration(course.duration)}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-user"></i> Students
                        </span>
                        <span className="text">{course.students}+</span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-globe"></i> Language
                        </span>
                        <span className="text">English</span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-calendar-alt"></i> Created
                        </span>
                        <span className="text">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-signal-alt"></i> Skill Level
                        </span>
                        <span className="text">{course.level}</span>
                      </li>
                      <li>
                        <span>
                          <i className="fal fa-medal"></i>
                          Certifications
                        </span>
                        <div className="certificate-container">
                          <span className="text">Yes</span>
                        </div>
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
