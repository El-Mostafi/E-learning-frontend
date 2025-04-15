import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import MyCoursesAreaInstructor from "./InstructorCoursesArea";
import StudentCoursesArea from "./StudentCoursesArea";
import { useAuth } from "../../context/AuthContext";


 
const MyCourses = () => {
	const { user } = useAuth();

  return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="My Courses" subtitle="Courses" />
			{(user!==null && user.role === "student") ? <StudentCoursesArea /> : <MyCoursesAreaInstructor />}
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default MyCourses;