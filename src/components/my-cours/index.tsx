import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import MyCoursesAreaInstructor from "./InstructorCourses/InstructorCoursesArea";
import { useAuth } from "../../context/AuthContext";
import StudentCoursesAreaTow from "./StudentCourses/StudentCoursesAreaTow";
import FooterTwo from "../../layouts/footers/FooterTwo";

const MyCourses = () => {

  const { user } = useAuth();

  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbCourses title="My Courses" subtitle="Courses" />
      {user !== null && user.role === "student" ? (
        <StudentCoursesAreaTow />
      ) : (
        <MyCoursesAreaInstructor />
      )}
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default MyCourses;
