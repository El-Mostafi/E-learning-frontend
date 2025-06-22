import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesContainer from "./CoursesContainer";
 

const CoursesGrid = () => {
  const { user } = useAuth();
  return (
    <>
    <Preloader />
    <HeaderOne />
    <BreadcrumbCourses title="Courses - Grid Style" subtitle="Courses Grid" />
    <CoursesContainer /> 
    {user ? <FooterOne user={user} /> : <FooterTwo />}
    <ScrollTop />    
    </>
  );
};

export default CoursesGrid;