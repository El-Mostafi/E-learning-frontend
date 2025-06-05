import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import {
  courseData,
  enrollmentService,
} from "../../../services/enrollmentService";
import CourseCard from "./CourseCard";
import CourseSorter from "./CourseSorter";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const sortOptions = [
  { value: "default", text: "Sort by: Default" },
  { value: "progress", text: "Sort by progress" },
  { value: "rating", text: "Sort by rating" },
  { value: "newest", text: "Sort by newest" },
  { value: "title", text: "Sort by title" },
];

const StudentCoursesAreaTow: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<courseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<courseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 6;

  // Navigate to course details
  const navigateToCourse = (courseId: string) => {
    navigate("/courses-details", { state: { courseId } });
  };

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const fetchedCourses = await enrollmentService.getEnrolledCourses();
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(
          "An error occurred while loading your courses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle sorting and filtering
  useEffect(() => {
    if (courses.length === 0) return;

    let result = [...courses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.instructorName.toLowerCase().includes(query)
      );
    }
    console.log("here");

    // Apply sorting
    switch (sortBy) {
      case "progress":
        result.sort((a, b) => b.progress - a.progress);
        break;
      case "rating":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default sorting (could be by enrollment date or whatever makes sense)
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filtering changes
  }, [courses, searchQuery, sortBy]);

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of course section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              My Courses
            </h1>
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{filteredCourses.length}</span> of{" "}
              <span className="font-medium">{courses.length}</span> courses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort dropdown */}
            <CourseSorter
              options={sortOptions}
              onChange={(value) => setSortBy(value)}
            />
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  navigateToCourse={navigateToCourse}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyState
            message={
              searchQuery
                ? `No results found for "${searchQuery}". Try a different search term.`
                : "You haven't enrolled in any courses yet."
            }
          />
        )}
      </div>
    </section>
  );
};

export default StudentCoursesAreaTow;
