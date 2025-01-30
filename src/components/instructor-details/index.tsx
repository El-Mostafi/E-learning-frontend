import BreadcrumbInstructor from "../../common/breadcrumb/BreadcrumbInstructor";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesDetailsArea from "./CoursesDetailsArea";
import InstructorDetailsArea from "./InstructorDetailsArea";

 
const InstructorDetails = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
			<BreadcrumbInstructor />
      <InstructorDetailsArea />       
      <CoursesDetailsArea />       
			<MarqueeOne style_2={true} />
			<FooterOne />
      <ScrollTop />
    </>
  );
};

export default InstructorDetails;