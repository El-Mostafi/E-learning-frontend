import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Accordion, Button } from "react-bootstrap";
import axios from "axios";
import {
  X,
  Award,
  CheckCircle,
  Download,
  Play,
  FileQuestion,
  GraduationCap,
} from "lucide-react";

// Services
import {
  QuizQuestion,
  Review,
  coursService,
  courseData,
} from "../../services/coursService";
import axiosInstance from "../../services/api";
import { enrollmentService } from "../../services/enrollmentService";

// Components
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import CouponInput from "./CouponInput";
import QuizComponent from "./QuizComponent";
import ModernReviewForm from "./Review/ModernReviewForm";
import ReviewsList from "./Review/ReviewsList";
import CertificatePreview from "./CertificatePreview";
import { completedSection } from "../../services/interfaces/enrollment.interface";
import { useAuth } from "../../context/AuthContext";
import { isTokenValid } from "../../utils/ProtectedRoutes";

interface CoursesDetailsAreaProps {
  setBreadcrumbData: (data: courseData) => void;
}

const QUIZ_PASS_THRESHOLD = 70;

const CoursesDetailsArea: React.FC<CoursesDetailsAreaProps> = ({
  setBreadcrumbData,
}) => {
  const { user } = useAuth();
  // Core state
  const [course, setCourse] = useState<courseData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Course navigation state
  const [currentSectionId, setCurrentSectionId] = useState<string>("");
  const [currentLectureId, setCurrentLectureId] = useState<string>("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState<number>(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [currentLectureTitle, setCurrentLectureTitle] = useState<string>("");

  // User enrollment state
  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [lectureCount, setLectureCount] = useState<number>(0);
  const [lectureCountCompleted, setLectureCountCompleted] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<
    completedSection[]
  >([]);

  // Cart state
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartChecking, setCartChecking] = useState(true);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [takeCertificate, setTakeCertificate] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Review state
  const [isReviewSubmitting, setIsReviewSubmitting] = useState<boolean>(false);
  const [reviewStatusMessage, setReviewStatusMessage] = useState<string>("");
  const [reviewStatusType, setReviewStatusType] = useState<string>("success");

  // Certificate state
  const [showCertificatePreview, setShowCertificatePreview] =
    useState<boolean>(false);

  // Refs and constants
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const styleSuffixes = ["one", "two", "three", "four", "five"];

  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId;

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        navigate("/");
        return;
      }
      try {
        const response = await coursService.getCourseDetails(
          courseId,
          user && user.role === "student" ? user.userId : undefined
        );
        setCourse(response);
        setBreadcrumbData(response);
        console.log("Course data:", response);
        setAppliedCoupon(
          response.appliedCoupon === undefined ? null : response.appliedCoupon
        );

        if (
          response.sections.length > 0 &&
          response.sections[0].lectures.length > 0
        ) {
          const firstSection = response.sections[0];
          const firstLecture = firstSection.lectures[0];

          setCurrentSectionId(firstSection.id);
          setCurrentLectureId(firstLecture.id);
          setCurrentLectureTitle(firstLecture.title);
          setCurrentSectionIndex(0);
          setCurrentLectureIndex(0);

          if (response.isUserEnrolled) {
            setCurrentVideoUrl(firstLecture.videoUrl || "");
            setProgress(response.progress ?? 0);
            setCompleted(response.completed ?? false);
          }
        } else {
          setError("Course content is not available.");
        }

        setIsUserEnrolled(response.isUserEnrolled);

        const totalLectures = response.sections.reduce(
          (total, section) => total + section.lectures.length,
          0
        );
        setLectureCount(totalLectures);
      } catch (err) {
        console.error("Error fetching course:", err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch course data"
          );
        } else {
          setError("Failed to fetch course data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, setBreadcrumbData, navigate, user]);

  // Check cart status
  useEffect(() => {
    const checkCartStatus = async () => {
      if (!courseId || !user || !isTokenValid()) return;
      try {
        const response = await axiosInstance.get("/cart");
        const cartItems = response.data.courses;
        const inCart = cartItems.some(
          (item: { _id: string }) => item._id === courseId
        );
        setIsInCart(inCart);
      } catch (err) {
        console.error("Error checking cart status:", err);
      } finally {
        setCartChecking(false);
      }
    };
    checkCartStatus();
  }, [courseId, user]);

  // Fetch enrollment data
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!courseId || !isUserEnrolled) return;

      try {
        const response = await enrollmentService.getEnrolledCourseById(
          courseId
        );
        setCompletedSections(response.completedSections);
        setLectureCountCompleted(response.completedSections.length);
        setTakeCertificate(response.hasPassedQuizze);
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message
          : "Failed to fetch enrollment data";
        setError(
          (prevError) =>
            prevError || message || "Failed to fetch enrollment data"
        );
      }
    };

    if (isUserEnrolled) {
      fetchEnrollment();
    }
  }, [courseId, isUserEnrolled]);

  // Course navigation methods
  const markLectureComplete = async () => {
    if (!course || !courseId) return;

    try {
      const result = await enrollmentService.updateProgress(
        courseId,
        currentSectionId,
        currentLectureId
      );

      const updatedProgress = Math.min(Math.max(result.progress, 0), 100);
      setProgress(updatedProgress);
      setCompleted(result.completed);
      setCompletedSections(result.completedSections);
      setLectureCountCompleted(result.completedSections.length);

      const currentSec = course.sections[currentSectionIndex];
      let nextSecIdx = currentSectionIndex;
      let nextLecIdx = currentLectureIndex;

      if (currentLectureIndex < currentSec.lectures.length - 1) {
        nextLecIdx = currentLectureIndex + 1;
      } else if (currentSectionIndex < course.sections.length - 1) {
        nextSecIdx = currentSectionIndex + 1;
        nextLecIdx = 0;
      }

      if (
        !result.completed ||
        nextSecIdx !== currentSectionIndex ||
        nextLecIdx !== currentLectureIndex
      ) {
        const nextSectionData = course.sections[nextSecIdx];
        const nextLectureData = nextSectionData.lectures[nextLecIdx];

        setCurrentSectionIndex(nextSecIdx);
        setCurrentLectureIndex(nextLecIdx);
        setCurrentSectionId(nextSectionData.id);
        setCurrentLectureId(nextLectureData.id);
        setCurrentVideoUrl(nextLectureData.videoUrl || "");
        setCurrentLectureTitle(nextLectureData.title);
      }
    } catch (err) {
      console.error("Error marking lecture as complete:", err);
      setError("Failed to mark lecture as complete. Please try again.");
    }
  };

  const handlePreviousLecture = () => {
    if (!course) return;

    const isFirstLectureInCurrentSection = currentLectureIndex === 0;

    let prevSectionIndex = currentSectionIndex;
    let prevLectureIndex = currentLectureIndex - 1;

    if (isFirstLectureInCurrentSection) {
      if (currentSectionIndex === 0) return;
      prevSectionIndex = currentSectionIndex - 1;
      prevLectureIndex = course.sections[prevSectionIndex].lectures.length - 1;
    }

    const targetSection = course.sections[prevSectionIndex];
    const targetLecture = targetSection.lectures[prevLectureIndex];

    handleLectureSelect(
      targetSection.id,
      targetLecture.id,
      targetLecture.videoUrl,
      targetLecture.title,
      prevSectionIndex,
      prevLectureIndex
    );
  };

  const handleLectureSelect = (
    sectionId: string,
    lectureId: string,
    videoUrl: string,
    title: string,
    sectionIndex: number,
    lectureIndex: number
  ) => {
    setCurrentSectionId(sectionId);
    setCurrentLectureId(lectureId);
    setCurrentVideoUrl(videoUrl || "");
    setCurrentLectureTitle(title);
    setCurrentSectionIndex(sectionIndex);
    setCurrentLectureIndex(lectureIndex);

    scrollToVideoPlayer();
  };

  // Cart methods
  const handleCartAction = async () => {
    if (!courseId) {
      setCartError("Course ID is missing");
      return;
    }
    setCartLoading(true);
    setCartError("");
    try {
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
      setIsInCart(!isInCart);
    } catch (err) {
      console.error("Cart action error:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : `Failed to ${isInCart ? "remove" : "add"} course.`;
      setCartError(message || "An unexpected error occurred.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setBuyNowLoading(true);
      setCartError("");

      if (!courseId) {
        throw new Error("Course ID is missing");
      }

      if (!isInCart) {
        await axiosInstance.post("/cart/add", { courseId });

        if (appliedCoupon) {
          await axiosInstance.post("/cart/apply-coupon", {
            courseId,
            couponCode: appliedCoupon.code,
          });
        }

        setIsInCart(true);
      }

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
      if (!code || !courseId) {
        return { success: false, error: "Please enter a coupon code" };
      }

      const discount = await coursService.verifyCoupon(courseId, code);
      if (!discount) {
        return { success: false, error: "Invalid or expired coupon code" };
      }

      setAppliedCoupon({
        code: code,
        discountPercentage: discount,
      });

      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
        return {
          success: false,
          error: error.response?.data?.errors[0].message || "Coupon error",
        };
      } else {
        return { success: false, error: "Invalid or expired coupon code" };
      }
    }
  };

  // Review methods
  const handleSubmitReview = async (reviewData: {
    rating: number;
    comment: string;
  }) => {
    if (!courseId) {
      setReviewStatusMessage("Course ID is missing");
      setReviewStatusType("error");
      return;
    }
    setIsReviewSubmitting(true);
    setReviewStatusMessage("");
    setReviewStatusType("success");
    try {
      const reviewToSubmit: Review = { ...reviewData, createdAt: new Date() };
      const responseMessage = await coursService.rateCourse(
        courseId,
        reviewToSubmit
      );

      setReviewStatusMessage(
        responseMessage || "Review submitted successfully!"
      );
      setReviewStatusType("success");

      const updatedCourse = await coursService.getCourseDetails(courseId);
      setCourse(updatedCourse);
    } catch (err) {
      console.error("Review submission error:", err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Failed to submit review.";
      setReviewStatusMessage(message || "An unexpected error occurred.");
      setReviewStatusType("error");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Quiz methods
  const handleQuizComplete = async (score: number) => {
    if (!courseId) return;
    try {
      if (score >= QUIZ_PASS_THRESHOLD) {
        const response = await enrollmentService.markQuizPassed(
          courseId,
          score
        );
        setTakeCertificate(response.hasPassedQuizze);
      }
    } catch (err) {
      console.error("Failed to save quiz results:", err);
    }
  };

  const handleShowQuiz = async () => {
    if (!courseId) return;
    setShowQuiz(true);
    if (quizQuestions.length === 0) {
      try {
        setLoadingQuiz(true);
        const response = await coursService.getQuiz(courseId);
        setQuizQuestions(response.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoadingQuiz(false);
      }
    }
  };

  // Certificate methods
  const handleShowCertificate = () => {
    setShowCertificatePreview(true);
  };

  // Utility methods
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= Math.round(rating) ? "" : "color-2"}`}
        />
      );
    }
    return stars;
  };

  const calculatePercentage = (count: number) => {
    return course?.reviewsLenght && course.reviewsLenght > 0
      ? (count / course.reviewsLenght) * 100
      : 0;
  };

  const formatDuration = (totalSeconds: number = 0) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (hours === 0 && (seconds > 0 || totalSeconds === 0 || minutes === 0)) {
      parts.push(`${seconds}s`);
    }
    return parts.length > 0 ? parts.join(" ") : "0s";
  };

  const getProgressStyleClass = (
    currentStars: number,
    ratingsCounts: number[] | undefined
  ) => {
    if (!ratingsCounts || ratingsCounts.length !== 5) {
      return `style-${styleSuffixes[2]}`;
    }
    const ratingsWithDetails = ratingsCounts.map((count, index) => ({
      stars: index + 1,
      count: count,
    }));
    const sortedRatings = [...ratingsWithDetails].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.stars - a.stars;
    });
    const rank = sortedRatings.findIndex((item) => item.stars === currentStars);
    return rank !== -1 && rank < styleSuffixes.length
      ? `style-${styleSuffixes[rank]}`
      : `style-${styleSuffixes[2]}`;
  };

  const scrollToVideoPlayer = () => {
    videoPlayerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Render quiz section
  const renderQuizSection = () => {
    if (!isUserEnrolled || !completed) return null;
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
                  isOpen={showQuiz}
                  onClose={() => setShowQuiz(false)}
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                  handleGetCertificate={() => {
                    setShowQuiz(false);
                    setShowCertificatePreview(true);
                  }}
                  courseName={course?.title}
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

  const currentCourseSection = course.sections[currentSectionIndex];

  const isLastLectureInCourse =
    currentSectionIndex === course.sections.length - 1 &&
    currentLectureIndex === currentCourseSection?.lectures.length - 1;

  let nextButtonText: React.ReactNode = (
    <>
      {" "}
      Next Lecture <i className="fas fa-arrow-right ms-2" />{" "}
    </>
  );
  let nextButtonVariant: "primary" | "success" = "primary";
  const nextButtonDisabled = completed && isLastLectureInCourse;

  if (isLastLectureInCourse) {
    nextButtonText = completed ? "Completed" : "Complete Course";
    if (completed) nextButtonVariant = "success";
  }

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
                        course.sections[0]?.lectures[0]?.videoUrl ||
                        ""
                      }
                      poster={course.thumbnailPreview}
                      title={
                        currentLectureTitle ||
                        course.sections[0]?.lectures[0]?.title ||
                        "Course Video"
                      }
                      duration={course.duration}
                      isLocked={!isUserEnrolled}
                      onComplete={markLectureComplete}
                    />
                  </div>

                  {isUserEnrolled && currentCourseSection && (
                    <>
                      <div className="video-navigation mt-3 mb-4 d-flex justify-content-between">
                        <Button
                          className="btn btn-outline-primary d-flex align-items-center"
                          variant="outline-secondary"
                          disabled={
                            currentSectionIndex === 0 &&
                            currentLectureIndex === 0
                          }
                          onClick={handlePreviousLecture}
                        >
                          <i className="fas fa-arrow-left me-2" />
                          Previous Lecture
                        </Button>

                        <div className="d-flex align-items-center">
                          <span className="mx-3 text-muted">
                            Lecture {currentLectureIndex + 1} /{" "}
                            {currentCourseSection.lectures.length} (Section{" "}
                            {currentSectionIndex + 1})
                          </span>
                        </div>

                        <Button
                          className="btn d-flex align-items-center"
                          variant={nextButtonVariant}
                          disabled={nextButtonDisabled}
                          onClick={markLectureComplete}
                        >
                          {nextButtonText}
                        </Button>
                      </div>

                      <div className="course-progress mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="m-0">Course Progress</h5>
                          <span className="progress-percentage">
                            {progress.toFixed(0)}%
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
                          />
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
                          />
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
                                    <i className="fas fa-check-circle" />{" "}
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
                                      <i className="fas fa-check-circle" />{" "}
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
                            <Accordion
                              defaultActiveKey={
                                isUserEnrolled ? "0" : undefined
                              }
                            >
                              {course.sections.map((section, secIdx) => (
                                <Accordion.Item
                                  key={`section-${section.id}-${secIdx}`}
                                  eventKey={String(secIdx)}
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
                                      {section.lectures?.map(
                                        (lecture, lecIdx) => (
                                          <li
                                            className="cursor-pointer"
                                            onClick={() =>
                                              isUserEnrolled
                                                ? handleLectureSelect(
                                                    section.id,
                                                    lecture.id,
                                                    lecture.videoUrl,
                                                    lecture.title,
                                                    secIdx,
                                                    lecIdx
                                                  )
                                                : undefined
                                            }
                                            key={lecture.id}
                                          >
                                            <span>
                                              <i className="fas fa-file-alt" />{" "}
                                              Lesson {lecIdx + 1}:{" "}
                                              {lecture.title}
                                            </span>
                                            <span>
                                              <i
                                                className={
                                                  !isUserEnrolled
                                                    ? "far fa-lock"
                                                    : completedSections.some(
                                                        (cs) =>
                                                          cs.lectureId.toString() ===
                                                          lecture.id.toString()
                                                      )
                                                    ? "far fa-check-circle text-green-500"
                                                    : "far fa-play-circle text-blue-500"
                                                }
                                              />
                                              (
                                              {formatDuration(lecture.duration)}
                                              )
                                            </span>
                                          </li>
                                        )
                                      )}
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
                                  "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                                }
                                alt={
                                  course.instructorName?.replace("|", " ") ===
                                  "Admin"
                                    ? "LUMINARA"
                                    : course.instructorName?.replace(
                                        "|",
                                        " "
                                      ) || "Instructor"
                                }
                              />
                            </div>
                            <div className="content">
                              <h4>
                                {course.instructorName?.replace("|", " ") ===
                                "Admin"
                                  ? "LUMINARA"
                                  : course.instructorName?.replace("|", " ") ||
                                    "Instructor"}
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
                                    {course.reviews?.toFixed(1) || "0.0"}
                                  </span>
                                </h2>
                                <div className="star">
                                  {renderStars(course.reviews || 0)}
                                </div>
                                <p>{course.reviewsLenght || 0}+ Reviews</p>
                              </div>
                              <div className="reviews-ratting-right">
                                {[5, 4, 3, 2, 1].map((starValue) => {
                                  const countForThisStar =
                                    course.ratingsCount?.[starValue - 1] || 0;
                                  const progressStyle = getProgressStyleClass(
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
                                          className={`progress-value ${progressStyle}`}
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
                            {isUserEnrolled && progress >= 25 && (
                              <ModernReviewForm
                                onSubmit={handleSubmitReview}
                                isSubmitting={isReviewSubmitting}
                                statusMessage={reviewStatusMessage}
                                statusType={reviewStatusType}
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
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 shadow-lg">
                      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                      <div className="relative z-10">
                        <img
                          src={
                            course.thumbnailPreview ||
                            "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                          }
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        />
                        <div className="mt-4 space-y-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.category || "Not Specified!"}
                          </div>
                          <h4 className="text-xl font-bold text-white mt-2">
                            {course.title}
                          </h4>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-20 blur-2xl"></div>
                    </div>

                    {!isUserEnrolled && user && user.role === "student" ? (
                      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                        <p
                          className="text-gray-600 mb-4 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: course.description
                              ? course.description.substring(0, 80) + "..."
                              : "",
                          }}
                        ></p>

                        <div className="flex items-center justify-between mb-6">
                          <div className="text-2xl font-bold text-gray-900">
                            {appliedCoupon ? (
                              <div className="flex items-center gap-2">
                                <span className="line-through text-gray-400">
                                  ${course.price?.toFixed(2)}
                                </span>
                                <span className="text-green-600">
                                  $
                                  {(
                                    course.price *
                                    (1 - appliedCoupon.discountPercentage / 100)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              `$${course.price?.toFixed(2) || "XXXX"}`
                            )}
                          </div>
                        </div>

                        <CouponInput onApplyCoupon={handleApplyCoupon} />

                        <div className="space-y-3 mt-6">
                          {cartChecking ? (
                            <button
                              className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium"
                              disabled
                            >
                              Checking Cart...
                            </button>
                          ) : (
                            <button
                              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                isInCart
                                  ? "bg-red-600 hover:bg-red-700 text-white"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                              onClick={handleCartAction}
                              disabled={cartLoading}
                            >
                              {cartLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  {isInCart ? "Removing..." : "Adding..."}
                                </div>
                              ) : isInCart ? (
                                "Remove from Cart"
                              ) : (
                                "Add to Cart"
                              )}
                            </button>
                          )}

                          <button
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            onClick={handleBuyNow}
                            disabled={buyNowLoading}
                          >
                            {buyNowLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Redirecting...
                              </div>
                            ) : (
                              "Buy Course"
                            )}
                          </button>
                        </div>

                        {cartError && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {cartError}
                          </div>
                        )}
                      </div>
                    ) : isUserEnrolled && user && user.role === "student" ? (
                      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                        <div className="relative">
                          {completed && (
                            <div className="absolute -top-3 -right-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            {completed ? (
                              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle className="w-7 h-7" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Play className="w-7 h-7" />
                              </div>
                            )}
                            <div>
                              <h3
                                className={`text-lg font-bold ${
                                  completed ? "text-green-800" : "text-blue-800"
                                }`}
                              >
                                {completed
                                  ? "Course Completed!"
                                  : "In Progress"}
                              </h3>
                              <p
                                className={`text-sm ${
                                  completed ? "text-green-600" : "text-blue-600"
                                }`}
                              >
                                {completed
                                  ? "Great achievement!"
                                  : "Keep learning!"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                ref={progressRef}
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  completed ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                              <span
                                className={`font-medium ${
                                  completed ? "text-green-600" : "text-blue-600"
                                }`}
                              >
                                {Math.round(progress)}% Complete
                              </span>
                              <span className="text-gray-500">
                                Your Progress
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3">
                            {!completed && (
                              <button
                                onClick={() =>
                                  videoPlayerRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  })
                                }
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                Continue Learning
                              </button>
                            )}

                            {completed && takeCertificate && (
                              <button
                                onClick={handleShowCertificate}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <Award className="w-5 h-5" />
                                Get Certificate
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            {completed && !takeCertificate && (
                              <button
                                onClick={handleShowQuiz}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <FileQuestion className="w-5 h-5" />
                                Take Final Quiz
                              </button>
                            )}

                            {completed && (
                              <button
                                onClick={() =>
                                  videoPlayerRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  })
                                }
                                className="w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                              >
                                <Play className="w-4 h-4" />
                                Review Course
                              </button>
                            )}
                          </div>

                          {completed && (
                            <div className="mt-6 flex justify-center">
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                🏆 Achievement Unlocked
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      (!user || !isTokenValid()) && (
                        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                          <p
                            className="text-gray-600 mb-4 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: course.description
                                ? course.description.substring(0, 80) + "..."
                                : "",
                            }}
                          ></p>

                          <div className="flex items-center justify-between mb-6">
                            <div className="text-2xl font-bold text-gray-900">
                              {`$${course.price?.toFixed(2) || "XXXX"}`}
                            </div>
                          </div>

                          <div className="space-y-3 mt-6">
                            <button
                              onClick={() => navigate("/sign-in")}
                              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <GraduationCap className="w-4 h-4" />
                              Start Learning
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">
                      Course Includes:
                    </h5>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-chalkboard-teacher"></i>
                          <span>Instructor</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {course.instructorName!.replace("|", " ") === "Admin"
                            ? "LUMINARA"
                            : course.instructorName!.replace("|", " ")}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-book-open"></i>
                          <span>Lessons</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {course.sections.reduce(
                            (total, section) => total + section.lectures.length,
                            0
                          )}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-clock"></i>
                          <span>Duration</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {formatDuration(course.duration)}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-user"></i>
                          <span>Students</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {course.students}+
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-globe"></i>
                          <span>Language</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          English
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-calendar-alt"></i>
                          <span>Created</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="far fa-signal-alt"></i>
                          <span>Skill Level</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {course.level}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-600">
                          <i className="fal fa-medal"></i>
                          <span>Certifications</span>
                        </div>
                        <span className="text-gray-900 font-medium">Yes</span>
                      </li>
                    </ul>

                    <button className="mt-6 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <i className="fas fa-share"></i>
                      Share this course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview Modal */}
      {showCertificatePreview && course && (
        <CertificatePreview
          isOpen={showCertificatePreview}
          onClose={() => setShowCertificatePreview(false)}
          courseId={courseId}
          courseTitle={course.title}
        />
      )}
    </>
  );
};

export default CoursesDetailsArea;
