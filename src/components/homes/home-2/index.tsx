import MarqueeOne from "../../../common/MarqueeOne";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterTwo from "../../../layouts/footers/FooterTwo";
import HeaderTwo from "../../../layouts/headers/HeaderTwo";
import BlogHomeTwo from "./BlogHomeTwo";
import CertificateHomeTwo from "./CertificateHomeTwo";
import ChooseHomeTwo from "./ChooseHomeTwo";
import CoursesHomeTwo from "./CoursesHomeTwo";
import EventHomeTwo from "./EventHomeTwo";
import FaqHomeTwo from "./FaqHomeTwo";
import HeroHomeTwo from "./HeroHomeTwo";
import PopularCoursesHomeTwo from "./PopularCoursesHomeTwo";
import TeamHomeTwo from "./TeamHomeTwo";
import TestimonialHomeTwo from "./TestimonialHomeTwo";
import TopCategoryHomeTwo from "./TopCategoryHomeTwo";

 

const HomeTwo = () => {
	return (
		<>
		<Preloader />
			<MarqueeOne />
			<HeaderTwo />
			<HeroHomeTwo />
			<TopCategoryHomeTwo />
			<PopularCoursesHomeTwo />
			<MarqueeOne />
			<EventHomeTwo />
			<ChooseHomeTwo />
			<TeamHomeTwo />
			<CertificateHomeTwo />
			<CoursesHomeTwo />
			<MarqueeOne />
			<TestimonialHomeTwo />
			<FaqHomeTwo />
			<BlogHomeTwo />
			<MarqueeOne />
			<FooterTwo />
			<ScrollTop />
		</>
	);
};

export default HomeTwo;
