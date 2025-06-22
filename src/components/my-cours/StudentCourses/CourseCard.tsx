import React from "react";
import { Calendar, Clock, BookOpen, Award, ChevronRight } from "lucide-react";
import { EnrolledCourse } from "../../../services/interfaces/enrollment.interface";

interface CourseCardProps {
  course: EnrolledCourse;
  navigateToCourse: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  navigateToCourse,
}) => {
  // Format duration from seconds to hours and minutes
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Get days since started
  const getDaysSinceStarted = (): string => {
    if (!course.startedAt) return "Not started";
    const startDate = new Date(course.startedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : `${diffDays} days ago`;
  };

  // Generate stars based on review rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`text-sm ${
            index < Math.floor(rating)
              ? "text-yellow-400"
              : index < rating
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      {/* Course thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            course.thumbnailPreview ||
            "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-0 left-0 p-2">
          <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {course.level}
          </span>
        </div>
        <div className="absolute top-0 right-0 p-2">
          <span className="inline-flex items-center gap-1 bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
            <Clock size={12} />
            {formatDuration(course.duration)}
          </span>
        </div>
      </div>

      {/* Course content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
            {course.category}
          </span>
          <div className="flex">{renderStars(course.reviews)}</div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[56px]">
          {course.title}
        </h3>

        <div
          className="text-sm text-gray-600 mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: course.description,
          }}
        />

        {/* Instructor info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-100">
            <img
              src={course.instructorImg || "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"}
              alt={course.instructorName.replace("|", " ")}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-700">{course.instructorName.replace("|", " ")}</span>
        </div>

        {/* Course stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{course.lectureTotal} lectures</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{getDaysSinceStarted()}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">
              {Math.round(course.progress)}% Complete
            </span>
            {course.completed && (
              <span className="flex items-center text-xs font-medium text-green-600">
                <Award size={12} className="mr-1" />
                Completed
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                course.completed ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.round(course.progress)}%` }}
            />
          </div>

          {/* Continue button */}
          <button
            onClick={() => navigateToCourse(course.id)}
            className={`w-full flex justify-between items-center text-sm font-medium px-4 py-2 rounded-md transition-colors ${
              course.completed
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <span>
              {course.completed ? "Review Course" : "Continue Learning"}
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;