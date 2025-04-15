import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InstructorService from "../../services/instructorsService";
import { Instructor } from "../../services/interfaces/user.interface";

const InstructorDetailsArea = () => {
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<Instructor>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await InstructorService.getInstructorById(id!);
        setInstructor(data);
      } catch (err) {
        setError("Failed to load instructors. Please try again later."+err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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
      <section className="team-details-section section-padding pt-0">
        <div className="container">
          <div className="team-details-wrapper">
            <div className="team-details-items">
              <div className="details-image">
                <img 
                width={"1500px"}
                src={instructor?.profileImg || "/assets/img/team/details-1.jpg"}
                alt={instructor?.userName.replace("|", " ")} />
              </div>
              <div className="team-details-content">
                <h2>{instructor?.userName.replace("|", " ")}</h2>
                <span>{instructor?.expertise} Instructors</span>
                <ul className="details-list">
                  <li>
                    <i className="far fa-user"></i>
                    50+ Students
                  </li>
                  <li>
                    <div className="star">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    (320+ Reviews)
                  </li>
                </ul>
                <h3>About Me</h3>
                <p className="mt-4">
                  {instructor?.biography}
                </p>
                <div className="details-area">
                  <Link to="/contact" className="theme-btn">
                    Contact Me
                  </Link>
                  <h5>
                    <Link to="/instructor-details">Follow Me</Link>
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
    </>
  );
};

export default InstructorDetailsArea;
