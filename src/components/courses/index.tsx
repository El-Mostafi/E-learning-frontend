import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CoursesArea from "./CoursesArea";

 
const Courses = () => {
  return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="All Courses" subtitle="Courses" />
			<CoursesArea />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default Courses;