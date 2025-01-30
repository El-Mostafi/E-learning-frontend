import BreadcrumbCoursesDetails from "../../common/breadcrumb/BreadcrumbCoursesDetails";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesDetailsArea from "./CoursesDetailsArea";
import RelatedCourses from "./RelatedCourses";

 

const CoursesDetails = () => {
  return (
    <>
    <Preloader />
    <HeaderOne />
    <BreadcrumbCoursesDetails />
    <CoursesDetailsArea />
    <RelatedCourses />
    <MarqueeOne style_2={true} />
    <FooterOne /> 
    <ScrollTop />     
    </>
  );
};

export default CoursesDetails;