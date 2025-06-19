import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  Star,
  Users,
  DollarSign,
  EyeOff,
  X,
  Eye,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { FilterOptions } from "../types";
import axios from "axios";
import { coursService } from "../../../../services/coursService";
import CreateCours from "../../Create Cours";

// Import your course service and types
interface Course {
  id: string;
  title: string;
  numberOfSections: number;
  category: string;
  instructor: string;
  numberOfStudents: number;
  averageRating: number;
  revenue: number;
  status: "Published" | "Draft";
  createdAt: string;
}

interface GetAllCoursesResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
  totalCourses: number;
}

interface CourseFilterOptions extends FilterOptions {
  level?: string;
  language?: string;
}

interface CourseManagementProps {
  coursesData: GetAllCoursesResponse;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ coursesData }) => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(
    coursesData.courses
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CourseFilterOptions>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(coursesData.currentPage);
  const [totalPages, setTotalPages] = useState(coursesData.totalPages);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [totalCourses, setTotalCourses] = useState(coursesData.totalCourses);
  const [loadingStatusCourseId, setLoadingStatusCourseId] = useState<
    string | null
  >(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  // Available levels and languages - you can fetch these from your backend too
  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  useEffect(() => {
    console.log(coursesData.courses);
    const fetchCategories = async () => {
      try {
        const response = await coursService.getAllCategories();
        setCategories(response);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();

    const fetchLanguages = async () => {
      try {
        const response = await coursService.getAllLanguages();
        setLanguages(response);
        console.log(response);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterCourses(term, filters, currentPage);
  };

  // Filter functionality
  const filterCourses = async (
    search: string,
    filterOptions: CourseFilterOptions,
    currentPage: number
  ) => {
    try {
      setIsLoadingCourses(true);
      setCourseError(null);
      const response = await coursService.getAllCourses({
        page: currentPage,
        limit: 8,
        status: filterOptions.status,
        search: search,
        category: filterOptions.category,
        level: filterOptions.level,
        language: filterOptions.language,
      });
      setFilteredCourses(response.courses);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalCourses(response.totalCourses);
      setCourseError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setCourseError(
          err.response?.data?.message || "Failed to fetch courses data."
        );
      } else {
        console.error("Unexpected error:", err);
        setCourseError("Unexpected error occurred");
      }
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (
    key: keyof CourseFilterOptions,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    };
    setFilters(newFilters);
    filterCourses(searchTerm, newFilters, currentPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    filterCourses(searchTerm, filters, pageNumber);
  };

  // Toggle course status (publish/unpublish)
  const handleToggleCourseStatus = async (courseId: string) => {
    try {
      setLoadingStatusCourseId(courseId);
      setStatusError(null);

      const response = await coursService.togglePublishCourse(courseId);
      setFilteredCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                status: response.isPublished ? "Published" : ("Draft" as const),
              }
            : course
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setStatusError(
          err.response?.data?.message || "Failed to update course status."
        );
      } else {
        console.error("Unexpected error:", err);
        setStatusError("Failed to update course status.");
      }
    } finally {
      setLoadingStatusCourseId(null);
    }
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Title",
        "Category",
        "Instructor",
        "Students",
        "Rating",
        "Revenue",
        "Status",
        "Created Date",
      ],
      ...filteredCourses.map((course) => [
        course.title,
        course.category,
        course.instructor,
        course.numberOfStudents.toString(),
        course.averageRating.toString(),
        course.revenue.toString(),
        course.status,
        course.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    console.log("Deleting course with ID:", courseId);
    setShowDeleteModal(true);
    setSelectedCourseId(courseId);
  };
  const confirmDelete = async () => {
    if (!selectedCourseId) return;
    setIsDeleting(true);
    try {
      await coursService.deleteCours(selectedCourseId);
      filterCourses(searchTerm, filters, currentPage);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("API Error:", err.response?.data);
        setDeleteError(
          err.response?.data?.message || "Failed to delete the course."
        );
      } else {
        console.error("Unexpected error:", err);
        setDeleteError("Unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle successful course creation/update

  const CourseListSkeleton = () => {
    return (
      <div className="w-full py-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{courseError}</p>
      <button
        onClick={() => {
          filterCourses(searchTerm, filters, currentPage);
        }}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );

  if (courseError || !filteredCourses) return <ErrorDisplay />;
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Course Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and monitor all platform courses
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setShowAddModal(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </button>
            <button
              onClick={() => {
                filterCourses(searchTerm, filters, currentPage);
              }}
              disabled={isLoadingCourses}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isLoadingCourses ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative flex-1 ">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                title="Status"
                value={filters.status || "all"}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              <select
                title="Category"
                value={filters.category || "all"}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                title="Level"
                value={filters.level || "all"}
                onChange={(e) => handleFilterChange("level", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All </option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                title="Language"
                value={filters.language || "all"}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>

              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {deleteError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600">⚠️ {deleteError}</div>
              <button
                onClick={() => setDeleteError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {statusError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600">⚠️ {statusError}</div>
              <button
                onClick={() => setStatusError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoadingCourses ? (
              <CourseListSkeleton />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => {
                    const isLoadingStatus = loadingStatusCourseId === course.id;

                    return (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.numberOfSections} sections
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.instructor.replace("|", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                            {course.numberOfStudents}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {course.averageRating.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                            ${course.revenue.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Unpublish Button (only for published courses) */}

                            <button
                              title={
                                course.status === "Published"
                                  ? "Unpublish Course"
                                  : "Publish Course"
                              }
                              onClick={() =>
                                handleToggleCourseStatus(course.id)
                              }
                              disabled={isLoadingStatus}
                              className={`p-1 rounded transition-colors ${
                                course.status === "Published"
                                  ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50"
                                  : "text-green-600 hover:text-green-900 hover:bg-green-50"
                              } ${
                                isLoadingStatus
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isLoadingStatus ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
                              ) : course.status === "Published" ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>

                            {/* Edit Button */}
                            <button
                              title="Edit Course"
                              onClick={() => {
                                setSelectedCourse(course);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setShowEditModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              title="Delete Course"
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {totalCourses} courses
        </div>

        {/* Pagination */}
        <div className="page-nav-wrap pt-5 text-center">
          <ul className="inline-flex gap-2 justify-center items-center">
            {currentPage > 1 && (
              <li>
                <a
                  title="Previous"
                  className="page-numbers"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                >
                  <i className="far fa-arrow-left"></i>
                </a>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pageNum) => {
                return (
                  pageNum <= 2 || // first 2
                  pageNum > totalPages - 2 || // last 2
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) // around current
                );
              })
              .reduce((acc, pageNum, idx, arr) => {
                if (idx > 0 && pageNum - arr[idx - 1] > 1) {
                  acc.push("...");
                }
                acc.push(pageNum);
                return acc;
              }, [] as (number | string)[])
              .map((item, index) => (
                <li key={index}>
                  {item === "..." ? (
                    <span className="page-numbers dots">...</span>
                  ) : (
                    <a
                      className={`page-numbers ${
                        item === currentPage ? "current" : ""
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof item === "number") {
                          handlePageChange(item);
                        }
                      }}
                    >
                      {item}
                    </a>
                  )}
                </li>
              ))}

            {currentPage < totalPages && (
              <li>
                <a
                  title="Next"
                  className="page-numbers"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                >
                  <i className="far fa-arrow-right"></i>
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Create Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-4xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create New Course
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CreateCours />
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-4xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit Course
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCourse(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CreateCours mode="edit" courseId={selectedCourse.id} />
            </div>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this course ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                {isDeleting ? (
                  <>
                    Deleting{" "}
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseManagement;
