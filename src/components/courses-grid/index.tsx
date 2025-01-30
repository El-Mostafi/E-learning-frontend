import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesGridArea from "./CoursesGridArea";

 

const CoursesGrid = () => {
  return (
    <>
    <Preloader />
    <HeaderOne />
    <BreadcrumbCourses title="Courses - Grid Style" subtitle="Courses Grid" />
    <CoursesGridArea /> 
    <FooterOne />  
    <ScrollTop />    
    </>
  );
};

export default CoursesGrid;