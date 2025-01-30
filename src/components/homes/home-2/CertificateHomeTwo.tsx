import { Link } from "react-router-dom";

 

const CertificateHomeTwo = () => {
  return (
    <>
      <div className="certificate-text wow fadeInUp" data-wow-delay=".3s">
            <h3>Get Your Quality Skills Certificate Through Eduspace</h3>
            <Link to="/register" className="theme-btn">Get Started Now</Link>
        </div>
    </>
  );
};

export default CertificateHomeTwo;