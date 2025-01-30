import MarqueeFour from "../../../common/MarqueeFour";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterFive from "../../../layouts/footers/FooterFive";
import HeaderFive from "../../../layouts/headers/HeaderFive";
import PartnarsHomeThree from "../home-3/PartnarsHomeThree";
import AboutHomeFive from "./AboutHomeFive";
import CategoryHomeFive from "./CategoryHomeFive";
import ChooseHomeFive from "./ChooseHomeFive";
import CounterHomeFive from "./CounterHomeFive";
import CoursesHomeFive from "./CoursesHomeFive";
import EventsHomeFive from "./EventsHomeFive";
import FaqHomeFive from "./FaqHomeFive";
import HeroHomeFive from "./HeroHomeFive";
import TeamHomeFive from "./TeamHomeFive";
import TestimonialHomeFive from "./TestimonialHomeFive";

 
const HomeFive = () => {
	return (
		<>
		<Preloader />
			<HeaderFive />
			<HeroHomeFive />
			<CategoryHomeFive />
			<AboutHomeFive />
			<CounterHomeFive />
			<CoursesHomeFive />
			<ChooseHomeFive />
			<TeamHomeFive />
			<MarqueeFour />
			<EventsHomeFive />
			<FaqHomeFive />
			<TestimonialHomeFive />
			<PartnarsHomeThree style_2={true} />
			<FooterFive />
			<ScrollTop />
		</>
	);
};

export default HomeFive;
