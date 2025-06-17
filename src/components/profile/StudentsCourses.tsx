import React, { useEffect, useState } from "react";
import { ChevronRight, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  courseData,
  enrollmentService,
} from "../../services/enrollmentService";

// interface Course {
//   id: string;
//   title: string;
//   progress: number;
//   completed: boolean;
//   completedAt: Date | null;
//   startedAt: Date;
//   thumbnailPreview: string;
//   sections: {
//     id: string;
//     title: string;
//     lectures: {
//       id: string;
//       title: string;
//       duration: number;
//     }[];
//   }[];
// }

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<courseData[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await enrollmentService.getEnrolledCourses();
        console.log("Enrolled courses", courses)
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-8">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          My Courses
        </h2>
        <Link
          to="/my-courses"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                Course Title
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                Progress
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course, index) => (
              <tr
                onClick={() => {
                  navigate("/courses-details", {
                    state: { courseId: course.id },
                  });
                }}
                key={index}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        course.thumbnailPreview ||
                        "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                      }
                      alt={course.title}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full max-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 min-w-[40px]">
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {course.completed ? "Completed" : "In Progress"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
