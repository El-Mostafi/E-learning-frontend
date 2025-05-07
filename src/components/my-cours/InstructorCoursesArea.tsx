import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NiceSelect, { Option } from "../../ui/NiceSelect";
import { coursService, courseInstructor } from "../../services/coursService";
import { X,Star, AlertCircle } from "lucide-react";
import CreateCours  from "../profile/Create Cours/index";
function InstructorCoursesArea() {
  const [courses, setCourses] = useState<courseInstructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<courseInstructor | null>(
    null
  );
  
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>("01");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 9;

  useEffect(() => {
    const fetchInstructorCours = async () => {
      try {
        coursService.getInstructorCourses().then((response) => {
          setCourses(response);
        });
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCours();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (course: courseInstructor) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleEdit = () => {
    
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      const response = await coursService.deleteCours(courseToDelete.id);
      console.log(response.data);
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      setError("Failed to delete course. Please try again later.");
      console.log(err);
    }
    setIsDeleting(false);
  };

  const selectHandler = (item: Option, value: string) => {
    setSortBy(value);
    const sortedCourses = [...courses];
    console.log(item, sortBy);
    switch (value) {
      case "02":
        sortedCourses.sort((a, b) => b.students - a.students);
        break;
      case "03":
        sortedCourses.sort((a, b) => b.reviews - a.reviews);
        break;
      case "04":
        sortedCourses.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        sortedCourses.sort((a, b) => a.id.localeCompare(b.id));
    }

    setCourses(sortedCourses);
    setCurrentPage(1);
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
        `}
      </style>

      <section className="popular-courses-section fix section-padding">
        <div className="container">
          <div className="coureses-notices-wrapper">
            <div className="courses-showing">
              <h5>
                Showing{" "}
                <span>
                  {indexOfFirstCourse + 1}-
                  {Math.min(indexOfLastCourse, courses.length)}
                </span>{" "}
                Of <span>{courses.length}</span> Results
              </h5>
            </div>
            <div className="form-clt">
              <NiceSelect
                className="category"
                options={[
                  { value: "01", text: "Sort by : Default" },
                  { value: "02", text: "Sort by popularity" },
                  { value: "03", text: "Sort by average rating" },
                  { value: "04", text: "Sort by latest" },
                ]}
                defaultCurrent={0}
                onChange={selectHandler}
                name=""
                placeholder=""
              />
            </div>
          </div>
          <div className="row">
            {currentCourses.map((cours, index) => (
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
                          cours.thumbnailPreview || "assets/img/courses/09.jpg"
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
                        <Link to="/courses-details">{cours.title}</Link>
                      </h3>
                      <div className="client-items">
                        <div className="icon-items">
                          <i>
                            <img
                              src={
                                cours.instructorImg ||
                                "assets/img/courses/c1.jpg"
                              }
                              alt="img"
                            />
                          </i>
                        </div>
                        <p>
                          <Link to="/instructor-details">
                            {cours.instructorName.replace("|", " ")}
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
                          <button onClick={() => handleEdit()} className="theme-btn">
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
            <ul>
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <li key={pageNum}>
                    <a
                      className={`page-numbers ${
                        pageNum === currentPage ? "current" : ""
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </a>
                  </li>
                )
              )}
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
        </div>
      </section>

      {showDeleteModal && (
        <div className="modal-overlay">
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
        <div  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-h-[90vh] w-full max-w-4xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Course</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label='Close'
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <CreateCours />
        </div>
      </div>
      )

      }
    </>
  );
}

export default InstructorCoursesArea;
