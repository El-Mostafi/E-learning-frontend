import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { enrollmentService } from "../../../services/enrollmentService";
import CourseCard from "./CourseCard";
import CourseSorter from "./CourseSorter";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import {
  EnrolledCoursesResponse,
  EnrolledCoursesSortOption,
  GetEnrolledCoursesOptions,
} from "../../../services/interfaces/enrollment.interface";

const sortOptions = [
  { value: "newest", text: "Sort by: Newest" },
  { value: "title", text: "Sort by: Title" },
  { value: "progress", text: "Sort by: Progress" },
  { value: "rating", text: "Sort by: Rating" },
];

const StudentCoursesAreaTwo: React.FC = () => {
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState<EnrolledCoursesResponse>({
    courses: [],
    totalPages: 0,
    currentPage: 1,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<EnrolledCoursesSortOption>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchDebounce, setSearchDebounce] = useState<string>("");

  const coursesPerPage = 6;

  const navigateToCourse = (courseId: string) => {
    navigate("/course-details", { state: { courseId } });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchDebounce, sortBy]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const options: GetEnrolledCoursesOptions = {
          page: currentPage,
          limit: coursesPerPage,
          sort: sortBy,
          ...(searchDebounce && { search: searchDebounce }),
        };

        const response = await enrollmentService.getEnrolledCourses(options);
        setCoursesData(response);
        console.log("Courses Data:", response);
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
  }, [currentPage, searchDebounce, sortBy]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as EnrolledCoursesSortOption);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading && coursesData.courses.length === 0) {
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
              <span className="font-medium">{coursesData.courses.length}</span>{" "}
              of <span className="font-medium">{coursesData.totalCourses}</span>{" "}
              courses
              {searchDebounce && <span> matching "{searchDebounce}"</span>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-black w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <CourseSorter
              options={sortOptions}
              defaultValue={sortBy}
              onChange={handleSortChange}
            />
          </div>
        </div>

        {loading && coursesData.courses.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {coursesData.courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  navigateToCourse={navigateToCourse}
                />
              ))}
            </div>

            {coursesData.totalPages > 1 && (
              <Pagination
                currentPage={coursesData.currentPage}
                totalPages={coursesData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyState
            message={
              searchDebounce
                ? `No results found for "${searchDebounce}". Try a different search term.`
                : "You haven't enrolled in any courses yet."
            }
          />
        )}
      </div>
    </section>
  );
};

export default StudentCoursesAreaTwo;
