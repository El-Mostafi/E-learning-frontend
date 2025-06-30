import { Link } from "react-router-dom";
import { courseData } from "../../services/coursService";

const BreadcrumbCoursesDetails = ({ data }: { data: courseData }) => {
  if (!data) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">Course not found</div>
      </div>
    );
  }
  return (
    <>
      <style>
        {`        
          .client-image-items img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        `}
      </style>
      <section className="breadcrumb-wrapper style-2">
        <div className="shape-1">
          <img src="assets/img/breadcrumb/shape-1.png" alt="img" />
        </div>
        <div className="shape-2">
          <img src="assets/img/breadcrumb/shape-2.png" alt="img" />
        </div>
        <div className="dot-shape">
          <img src="assets/img/breadcrumb/dot-shape.png" alt="img" />
        </div>
        <div className="vector-shape">
          <img src="assets/img/breadcrumb/Vector.png" alt="img" />
        </div>
        <div className="container">
          <div className="page-heading">
            <ul className="breadcrumb-items">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/courses-grid">Courses</Link>
              </li>
              <li className="style-2"> Course Details</li>
            </ul>
            <div className="breadcrumb-content">
              <h1>
                {data.level} {data.title}
              </h1>
              <div className="courses-breadcrumb-items">
                <div className="client-image-items">
                  <img src={data.instructorImg} alt="img" />
                  <div className="client-content">
                    <span>Instructor</span>
                    <h5>{data.instructorName!.replace("|", " ")==="Admin"?"LUMINARA ":data.instructorName!.replace("|", " ")}</h5>
                  </div>
                </div>
                <div className="client-image-items">
                  <div className="client-content">
                    <span>Instructor</span>
                    <h5>{data.instructorExpertise || "Expertise"}</h5>
                  </div>
                </div>
                <div className="client-image-items">
                  <div className="client-content">
                    <span>Price</span>
                    <h5>${data.price}</h5>
                  </div>
                </div>
                <div className="client-image-items">
                  <div className="client-content">
                    <span>Reviews</span>
                    <div className="star">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`${i <= Math.round(data.reviews) ? "fas" : "far"} fa-star`}
                        />
                      ))}
                      <b>({data.reviewsLenght})</b>
                    </div>
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

export default BreadcrumbCoursesDetails;
