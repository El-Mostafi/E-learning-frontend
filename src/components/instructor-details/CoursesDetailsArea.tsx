import { Link, useNavigate } from "react-router-dom";
import { InstructorSummary } from "../../services/interfaces/instructor.interface";

// 1. A more specific type for a single course from the summary array. This improves code readability.
type PopularCourse = InstructorSummary["popularCourses"][0];

// 2. The props interface is simplified. This component only needs the summary data.
interface CoursesDetailsAreaProps {
  instructorSummary: InstructorSummary | null; // Make it nullable to handle the parent's loading state.
}


// --- Reusable Star Rating Helper Component ---
// This small component cleanly handles the logic for displaying full, half, and empty stars.
const StarRating = ({ rating = 0 }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
      {halfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
    </>
  );
};


// --- Reusable and Dynamic Course Card Component ---
// This is the template for a single course card. It takes a `course` object and populates the UI.
const CourseCard = ({ course }: { course: PopularCourse }) => {
    const navigate = useNavigate();
  const defaultThumbnail = "/assets/img/courses/default-course.jpg";
  return (
    <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
      <div className="courses-card-main-items">
        <div className="courses-card-items style-2">
          <div className="courses-image">
            <img 
              src={course.thumbnail || defaultThumbnail} 
              alt={course.title}
              onError={(e) => { (e.target as HTMLImageElement).src = defaultThumbnail; }}
            />
            <h3 className="courses-title">{course.category}</h3>
            <h4 className="topic-title">{course.title}</h4>
            <div className="arrow-items">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`GlidingArrow delay${i}`}>
                  <img src={`/assets/img/courses/a${i + 1}.png`} alt="arrow" />
                </div>
              ))}
            </div>
          </div>
          <div className="courses-content">
            <ul className="post-cat">
              <li>
                <Link to={`/courses?category=${course.category}`}>{course.category}</Link>
              </li>
              <li>
                <StarRating rating={course.rating} />
              </li>
            </ul>
            <h3>
              <Link to={`/courses-details/${course.id}`}>{course.title}</Link>
            </h3>
            <ul className="post-class">
              <li>
                <i className="far fa-books"></i>
                {course.level}
              </li>
              <li>
                <i className="far fa-user"></i>
                {course.studentCount} Students
              </li>
              <li>
                <Link to="/courses-details"
                onClick={(e) => {
                        e.preventDefault();
                        navigate("/courses-details", {
                          state: { courseId: course.id },
                        });
                    }}
                >
                  View Course
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- The Main Component ---
// This component now acts as a container that decides what to render based on the props it receives.
const CoursesDetailsArea: React.FC<CoursesDetailsAreaProps> = ({ instructorSummary }) => {

  // Case 1: Data is still loading in the parent component.
  // We return null because the parent page is already showing a main loading spinner.
  if (!instructorSummary) {
    return null;
  }

  // Case 2: Data has loaded, but the instructor has no popular courses.
  // We display a user-friendly message.
  if (!instructorSummary.popularCourses || instructorSummary.popularCourses.length === 0) {
    return (
      <section className="popular-courses-section fix section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h2 className="wow fadeInUp">Courses By This Instructor</h2>
          </div>
          <div className="text-center py-5">
            <p>This instructor has no courses to display at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Case 3: Data is available. We map over the courses and render a card for each one.
  return (
    <section className="popular-courses-section fix section-padding pt-0">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="wow fadeInUp">Courses By This Instructor</h2>
        </div>
        <div className="row">
          {instructorSummary.popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesDetailsArea;