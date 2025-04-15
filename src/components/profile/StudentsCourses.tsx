import React from "react";
import { ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Course {
  title: string;
  progress: number;
  status: "In Progress" | "Completed";
  thumbnail: string;
}

const courses: Course[] = [
  {
    title: "Cookies & Sessions",
    progress: 0,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=96&h=96&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    title: "Spring Boot For Beginners",
    progress: 0,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?w=96&h=96&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    title: "Authentication Course",
    progress: 0,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=96&h=96&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    title: "NodeJS Crash Course",
    progress: 0,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=96&h=96&fit=crop&crop=faces&auto=format&q=80",
  },
  {
    title: "React Tutorial",
    progress: 100,
    status: "Completed",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=96&h=96&fit=crop&crop=faces&auto=format&q=80",
  },
];

const CourseTable: React.FC = () => {
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

      <div className="overflow-x-auto">
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
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail}
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
                          style={{ width: `${course.progress}%` }}
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
                      course.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {course.status}
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
