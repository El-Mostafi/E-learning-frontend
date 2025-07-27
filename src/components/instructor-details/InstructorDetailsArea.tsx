import { Link } from "react-router-dom";
import { Instructor } from "../../services/interfaces/user.interface";
import { InstructorSummary } from "../../services/interfaces/instructor.interface";

// 1. Updated props to receive the actual data objects, not just an ID.
//    The parent component is now responsible for fetching this data.
interface InstructorDetailsProps {
  instructor: Instructor | null;
  instructorSummary: InstructorSummary | null;
}

// 2. A small, reusable component for rendering the star rating cleanly.
const StarRating = ({ rating = 0 }: { rating?: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="star">
            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
            {halfStar && <i className="fas fa-star-half-alt"></i>}
            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
        </div>
    );
};


const InstructorDetailsArea: React.FC<InstructorDetailsProps> = ({ instructor, instructorSummary }) => {
  // 3. REMOVED all useState and useEffect hooks.
  //    This component no longer manages its own state or fetches data.

  // 4. A guard clause. If the parent is still loading the data,
  //    this component will render nothing, preventing errors.
  //    The parent component will be showing a main loading spinner.
  if (!instructor) {
    return null; 
  }

  // 5. The JSX now uses the props directly.
  return (
    <section className="team-details-section section-padding pt-0">
      <div className="container">
        <div className="team-details-wrapper">
          <div className="team-details-items">
            <div className="details-image h-[300px] w-[300px] overflow-hidden">
              <img 
                className="object-cover"
                src={instructor.profileImg || "/assets/img/team/details-1.jpg"}
                alt={instructor.userName.replace("|", " ")} 
              />
            </div>
            <div className="team-details-content">
              <h2>{instructor.userName.replace("|", " ")}</h2>
              <span>{instructor.expertise} Instructor</span>
              <ul className="details-list">
                <li>
                  <i className="far fa-user"></i>
                  {/* Use the summary data directly from props. Default to 0 if summary is not available. */}
                  {instructorSummary ? instructorSummary.totalStudents - 1 : 0}+ Students
                </li>
                <li>
                  <StarRating rating={instructorSummary?.averageRating} />
                  ({instructorSummary?.averageRating.toFixed(1) || '0.0'}) Reviews
                </li>
              </ul>
              <h3>About Me</h3>
              <p className="mt-4">
                {instructor.biography}
              </p>
              <div className="details-area">
                <Link to="/contact" className="theme-btn">
                  Contact Me
                </Link>
                <h5>
                  {/* This link should probably not be here or should go to a different page */}
                  <Link to="#">Follow Me</Link>
                </h5>
                <div className="social-icon d-flex align-items-center">
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-dribbble"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-behance"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorDetailsArea;