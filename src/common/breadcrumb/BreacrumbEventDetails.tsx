import { Link } from "react-router-dom";

 

const BreacrumbEventDetails = () => {
  return (
    <>
       <section className="breadcrumb-wrapper style-2 style-event">
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
                    <li><Link to="/">Home</Link></li>
                    <li>Event</li>
                    <li className="style-2"> Event Details</li>
                </ul>
                <div className="breadcrumb-content">
                    <h1>Mastering Study Techniques A <br /> Workshop for Academic Success</h1>
                </div>
            </div>
        </div>
        </section>
    </>
  );
};

export default BreacrumbEventDetails;