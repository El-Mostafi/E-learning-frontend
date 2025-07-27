import React, { useEffect, useState } from "react";
import { ChevronRight, BookOpen, Clock, Award } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { enrollmentService } from "../../../services/enrollmentService";
import { courseStudentTable } from "../../../services/interfaces/enrollment.interface";

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<courseStudentTable[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const courses = await enrollmentService.getEnrolledCoursesOverview();
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (coursId: string) => {
    console.log("Navigate to course:", coursId);
    navigate("/course-details", { state: { courseId: coursId } });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <p className="text-sm text-gray-600 mt-1">
                Continue your learning journey
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/my-courses")} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="p-8 overflow-x-auto max-h-[550px] overflow-y-auto">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600">
              Start your learning journey by enrolling in a course.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  {/* Course Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        course.thumbnailPreview ||
                        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400"
                      }
                      alt={course.title}
                      className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    />
                    {course.completed && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {course.title}
                    </h3>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              Progress
                            </span>
                            <span className="text-xs font-bold text-gray-900">
                              {Math.round(course.progress)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                course.completed
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          {course.completed ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                              <Award className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">
                                Completed
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                              <Clock className="w-3 h-3 text-orange-600" />
                              <span className="text-xs font-semibold text-orange-700">
                                In Progress
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center transition-colors duration-200">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTable;
