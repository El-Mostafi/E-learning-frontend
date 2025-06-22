import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InstructorService from "../../services/instructorsService";
import { Instructor } from "../../services/interfaces/user.interface";

const InstructorArea = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await InstructorService.getAllInstructors();
        setInstructors(data);
      } catch (err) {
        setError("Failed to load instructors. Please try again later." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // --- CSS to force uniform image size for this specific component ---
  const componentStyles = `
    .team-section-5 .team-card-items .thumb img {
      width: 100%;
      height: 300px !important;
      object-fit: cover;
      /*
       * THIS IS THE KEY CHANGE:
       * 'top' aligns the image to the top of the container.
       * Any cropping will now happen from the bottom, ensuring the
       * top of the image is always visible.
      */
      object-position: top; 
    }
  `;

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
      <style>{componentStyles}</style>

      <section className="team-section-5 fix section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="wow fadeInUp">Our Instructors</h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Meet Our Expert Instructors
            </h2>
          </div>
          <div className="row">
            {instructors.map((instructor, index) => (
              <div
                key={instructor._id}
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay={`${0.2 + (index % 4) * 0.2}s`}
              >
                <div className="team-card-items style-2">
                  <div className="thumb">
                    <img
                      src={
                        instructor.profileImg || "/assets/img/team/default.jpg"
                      }
                      alt={instructor.userName.replace("|", " ")}
                      className="img-fluid"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/assets/img/team/default.jpg";
                      }}
                    />
                    <div className="social-icon">
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                  <div className="content">
                    <h4>
                      <Link
                        to="/instructor-details"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/instructor-details", {
                            state: { InstructorId: instructor._id },
                          });
                        }}
                      >
                        {instructor.userName.replace("|", " ")}
                      </Link>
                    </h4>
                    <p>{instructor.expertise}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default InstructorArea;