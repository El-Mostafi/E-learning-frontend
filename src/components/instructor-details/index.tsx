// pages/instructor-details/InstructorDetails.tsx

import { useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import InstructorService from "../../services/instructorsService";
import { Instructor } from "../../services/interfaces/user.interface";
import { InstructorSummary } from "../../services/interfaces/instructor.interface";
import Preloader from "../../common/Preloader";
import HeaderOne from "../../layouts/headers/HeaderOne";
import BreadcrumbInstructor from "../../common/breadcrumb/BreadcrumbInstructor";
import InstructorDetailsArea from "./InstructorDetailsArea";
import CoursesDetailsArea from "./CoursesDetailsArea";
import MarqueeOne from "../../common/MarqueeOne";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
// (Keep all your other imports: Breadcrumb, Header, Footer, etc.)

const InstructorDetails = () => {
  const { user } = useAuth();
  const location = useLocation();
  // Standardize to camelCase for consistency
  const instructorId = location.state?.instructorId || location.state?.InstructorId; 

  // --- State for ALL data needed on this page ---
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [instructorSummary, setInstructorSummary] = useState<InstructorSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instructorId) return;

    const fetchAllInstructorData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both sets of data in parallel for better performance
        const [profileData, summaryData] = await Promise.all([
          InstructorService.getInstructorById(instructorId),
          InstructorService.getInstructorStats(instructorId),
        ]);
        
        setInstructor(profileData);
        setInstructorSummary(summaryData);
      } catch (err) {
        console.error("Failed to fetch instructor data:", err);
        setError("Could not load instructor data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllInstructorData();
  }, [instructorId]);

  // --- Handle loading and error states for the whole page ---
  if (loading) {
    return (
      <>
        <Preloader />
        <HeaderOne />
        <div className="container text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        {user ? <FooterOne user={user} /> : <FooterTwo />}
      </>
    );
  }
  
  if (error || !instructorId || !instructor) {
    // This now catches missing ID, fetch errors, and null instructor results
    return (
      <div style={{ minHeight: "100vh", /* ... your error styles ... */ }}>
        {/* Your existing error/not-found JSX */}
      </div>
    );
  }

  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbInstructor />

      {/* --- Pass the fetched data down to the children --- */}
      <InstructorDetailsArea 
        instructor={instructor} 
        instructorSummary={instructorSummary} 
      />
      <CoursesDetailsArea 
        instructorSummary={instructorSummary} 
      />

      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default InstructorDetails;