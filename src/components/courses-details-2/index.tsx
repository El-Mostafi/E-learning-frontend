import BreadcrumbCoursesDetailsTwo from "../../common/breadcrumb/BreadcrumbCoursesDetailsTwo";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import RelatedCourses from "../courses-details/RelatedCourses";
import CoursesDetailsTwoArea from "./CoursesDetailsTwoArea";

const CoursesDetailsTwo = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCoursesDetailsTwo />
			<CoursesDetailsTwoArea />
			<RelatedCourses />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default CoursesDetailsTwo;
