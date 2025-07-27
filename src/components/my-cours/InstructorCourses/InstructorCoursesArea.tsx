import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NiceSelect, { Option } from "../../../ui/NiceSelect";
import { coursService, courseInstructor } from "../../../services/coursService";
import { X, Star, AlertCircle, Search, BookOpen } from "lucide-react";
import CreateCours from "../../profile/Create Cours/index";
import {
  FindAllInstructorCoursesOptions,
  InstructorCoursesResponse,
  InstructorCoursesSortOption,
} from "../../../services/interfaces/course.interface";
import LoadingState from "../StudentCourses/LoadingState";
import ErrorState from "../StudentCourses/ErrorState";
function InstructorCoursesArea() {
    const navigate = useNavigate();
  
  const [coursesData, setCoursesData] = useState<InstructorCoursesResponse>({
    courses: [],
    totalPages: 0,
    currentPage: 1,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<courseInstructor | null>(
    null
  );
  const [courseToEditId, setCourseToEditId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<InstructorCoursesSortOption>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchDebounce, setSearchDebounce] = useState<string>("");
  const coursesPerPage = 6;

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
    const fetchInstructorCours = async () => {
      setLoading(true);
      setError("");
      try {
        const options: FindAllInstructorCoursesOptions = {
          page: currentPage,
          limit: coursesPerPage,
          sort: sortBy,
          ...(searchDebounce && { search: searchDebounce }),
        };
        const response = await coursService.getInstructorCourses(options);
        setCoursesData(response);
        console.log("Courses Data:", response);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCours();
  }, [currentPage, searchDebounce, sortBy]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleSortChange = (item: Option) => {
    setSortBy(item.value as InstructorCoursesSortOption);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (course: courseInstructor) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleEdit = (courseId: string) => {
    setCourseToEditId(courseId);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      const response = await coursService.deleteCours(courseToDelete.id);
      console.log(response.data);
      setCoursesData({
        ...coursesData,
        courses: coursesData.courses.filter(
          (course) => course.id !== courseToDelete.id
        ),
      });
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      setError("Failed to delete course. Please try again later.");
      console.log(err);
    }
    setIsDeleting(false);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

  if (loading && coursesData.courses.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <>
      <style>
        {`
          .icon-items {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .icon-items i {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            background-color: #C3F499;
            font-size: 14px;
          }
          .icon-items i img {
            border-radius: 50%;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
          }
          .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            max-width: 500px;
            width: 90%;
          }
            .courses-card-main-items {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .courses-card-items {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .courses-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .courses-content h3 {
            flex: 1;
          }
          
          .post-class {
            margin-top: auto;
          }
        `}
      </style>

      <section className="popular-courses-section fix section-padding">
        <div className="container">
          <div className="coureses-notices-wrapper ">
            <div className="courses-showing">
              <h5>
                Showing{" "}
                <span>
                  {indexOfFirstCourse + 1}-
                  {Math.min(indexOfLastCourse, coursesData.totalCourses)}
                </span>{" "}
                Of <span>{coursesData.totalCourses}</span> Results
              </h5>
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-3 w-full sm:flex-1">
              <div className="form-clt">
                <NiceSelect
                  className="category"
                  options={[
                    { value: "title", text: "Sort by : Default" },
                    { value: "popularity", text: "Sort by popularity" },
                    { value: "rating", text: "Sort by average rating" },
                    { value: "newest", text: "Sort by newest" },
                  ]}
                  defaultCurrent={0}
                  onChange={handleSortChange}
                  name=""
                  placeholder=""
                />
              </div>
              <div className="relative w-full max-w-sm  ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="text-black w-full pl-10 pr-4 py-[18px]  text-sm text-gray-700 bg-white border rounded-[10px] box-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {loading && coursesData.courses.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!loading && coursesData.courses.length === 0 && (
            <div className="flex flex-col items-center justify-center  p-10 text-center mt-[50px]">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-50">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Courses Found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">You haven't create any courses yet</p>
              <button
                onClick={() => navigate("/profile")}
                className="theme-btn"
              >
                Create your first course
              </button>
            </div>
          )}
          <div className="row">
            {coursesData.courses.map((cours, index) => (
              <div
                key={cours.id}
                className="col-xl-4 col-lg-6 col-md-6"
                data-wow-delay={`${0.2 + (index % 4) * 0.2}s`}
              >
                <div className="courses-card-main-items">
                  <div className="courses-card-items style-2">
                    <div className="courses-image">
                      <img
                        src={
                          cours.thumbnailPreview ||
                          "https://res.cloudinary.com/dtcdlthml/image/upload/v1746612580/lbmdku4h7bgmbb5gp2wl.png"
                        }
                        alt="img"
                      />
                      <h3 className="courses-title">{cours.title}</h3>
                      <h4 className="topic-title">{cours.level}</h4>
                      <div className="arrow-items">
                        <div className="GlidingArrow">
                          <img src="assets/img/courses/a1.png" alt="img" />
                        </div>
                        <div className="GlidingArrow delay1">
                          <img src="assets/img/courses/a2.png" alt="img" />
                        </div>
                        <div className="GlidingArrow delay2">
                          <img src="assets/img/courses/a3.png" alt="img" />
                        </div>
                        <div className="GlidingArrow delay3">
                          <img src="assets/img/courses/a4.png" alt="img" />
                        </div>
                        <div className="GlidingArrow delay4">
                          <img src="assets/img/courses/a5.png" alt="img" />
                        </div>
                        <div className="GlidingArrow delay5">
                          <img src="assets/img/courses/a6.png" alt="img" />
                        </div>
                      </div>
                    </div>
                    <div className="courses-content">
                      <ul className="post-cat">
                        <li>
                          <Link to="/courses">{cours.category}</Link>
                        </li>
                        <li className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < cours.reviews
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </li>
                      </ul>
                      <h3>
                        <Link to="/course-details">{cours.title}</Link>
                      </h3>
                      <div className="client-items">
                        <div className="icon-items">
                          <i>
                            <img
                              src={
                                cours.instructorImg ||
                                "https://res.cloudinary.com/dkqkxtwuf/image/upload/v1740161005/defaultAvatar_iotzd9.avif"
                              }
                              alt="img"
                            />
                          </i>
                        </div>
                        <p>
                          <Link to="/instructor-details">
                            {cours.instructorName?.replace("|", " ")}
                          </Link>
                        </p>
                      </div>
                      <ul className="post-class">
                        <li>
                          <i className="far fa-books"></i>
                          Lessons
                        </li>
                        <li>
                          <i className="far fa-user"></i>
                          {cours.students} Students
                        </li>
                        <li>
                          <button
                            onClick={() => handleEdit(cours.id)}
                            className="theme-btn"
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(cours)}
                            className="theme-btn red-btn"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

              {Array.from({ length: coursesData.totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  return (
                    pageNum <= 2 || // first 2
                    pageNum > coursesData.totalPages - 2 || // last 2
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

              {currentPage < coursesData.totalPages && (
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
        </div>
      </section>

      {showDeleteModal && (
        <div className="modal-overlay backdrop-blur-sm">
          <div className="modal-content">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            <p className="mb-6">
              Are you sure you want to delete the course "
              {courseToDelete?.title}"? This action cannot be undone.
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
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-4xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Course
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <CreateCours mode="edit" courseId={courseToEditId} />
          </div>
        </div>
      )}
    </>
  );
}

export default InstructorCoursesArea;
