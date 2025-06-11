import React, { useState, useEffect } from "react";
import { CourseProvider, useCourse } from "./context/CourseContext";
import CourseDetailsForm from "./components/CourseDetailsForm";
import SectionBuilder from "./components/SectionBuilder";
import QuizBuilder from "./components/QuizBuilder";
import CoursePreview from "./components/CoursePreview";
import ProgressBar from "./components/common/ProgressBar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { GraduationCap as Graduation } from "lucide-react";
import { courseToEdit, coursService } from "../../../services/coursService";
import { CourseState } from "./types";
import { useAuth } from "../../../context/AuthContext";

interface CourseCreatorProps {
  mode?: "create" | "edit";
  courseId?: string;
}

const CourseCreator: React.FC<CourseCreatorProps> = ({
  mode = "create",
  courseId,
}) => {
  const { state, dispatch } = useCourse();
  const { currentStep } = state;
  const [course, setCourse] = useState<courseToEdit>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if (mode === "edit" && courseId) {
      const fetchCourse = async () => {
        try {
          if (!courseId) {
            setError("Course ID is missing");
            setLoading(false);
            return;
          }

          const response = await coursService.getCourseToEdit(courseId);
          console.log(response);
          setCourse(response);
        } catch (err) {
          setError("Failed to load course. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [mode, courseId]);
  useEffect(() => {
    if (mode === "edit" && course) {
      try {
        const mockCourseData: CourseState = {
          id: course.id,
          courseDetails: {
            title: course.title,
            thumbnail: null,
            thumbnailPreview: course.thumbnailPreview,
            imgPublicId: course.imgPublicId,
            secureUrl: course.thumbnailPreview,
            category: course.category.name,
            level: course.level,
            language: course.language,
            description: course.description,
          },
          sections: course.sections.map((section) => ({
            id: section.orderIndex.toString(),
            title: section.title,
            description: section.description,
            videos: section.lectures.map((lecture) => ({
              id: lecture.id.toString(),
              publicId: lecture.publicId,
              secureUrl: lecture.videoUrl,
              progress: 100,
              preview: lecture.videoUrl,
              duration: lecture.duration,
              title: lecture.title,
              description: lecture.description,
            })),
          })),
          quizQuestions:
            course.quizQuestions?.map((question) => ({
              id: question.id.toString(),
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
            })) ?? [],
          currentStep: 0,
          isPublished: false,
          pricing: {
            isFree: course.pricing.isFree,
            price: course.pricing.price,
          },
          oldPrice: course.oldPrice,
          coupons: course.coupons || [],
        };
        dispatch({ type: "INITIALIZE_COURSE", payload: mockCourseData });
      } catch (err) {
        console.error("Error processing course data:", err);
        setError("An error occurred while processing the course data.");
      }
    }
  }, [course, dispatch, mode]);

  const handleContinue = () => {
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: currentStep + 1,
    });
    window.scrollTo({
      top: user?.role === "admin" ? 0 : 300,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: currentStep - 1,
    });
    window.scrollTo({
      top: user?.role === "admin" ? 0 : 300,
      behavior: "smooth",
    });
  };

  const handleStepClick = (step: number) => {
    if (mode === "edit") {
      dispatch({
        type: "SET_CURRENT_STEP",
        payload: step,
      });
      window.scrollTo({
        top: user?.role === "admin" ? 0 : 300,
        behavior: "smooth",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CourseDetailsForm onContinue={handleContinue} />;
      case 1:
        return (
          <SectionBuilder onContinue={handleContinue} onBack={handleBack} />
        );
      case 2:
        return <QuizBuilder onContinue={handleContinue} onBack={handleBack} />;
      case 3:
        return <CoursePreview onBack={handleBack} mode={mode} />;
      default:
        return <CourseDetailsForm onContinue={handleContinue} />;
    }
  };
  if (loading && mode === "edit") {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && mode === "edit") {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!course && mode === "edit") {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">Course not found</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto mb-4 sm:mb-8">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="bg-blue-600 text-white p-2 sm:p-3 rounded-full mr-2 sm:mr-3">
            <Graduation className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {mode === "create" ? "Course Creator" : "Edit Course"}
          </h1>
        </div>

        <div className="px-2 sm:px-0">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={4}
            labels={["Course Details", "Content", "Quiz", "Publish"]}
            onStepClick={mode === "edit" ? handleStepClick : undefined}
          />
        </div>
      </div>

      <ErrorBoundary>{renderStep()}</ErrorBoundary>
    </div>
  );
};

function App({ mode, courseId }: CourseCreatorProps) {
  return (
    <CourseProvider>
      <CourseCreator mode={mode} courseId={courseId} />
    </CourseProvider>
  );
}

export default App;
