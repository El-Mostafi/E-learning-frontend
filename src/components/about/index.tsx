import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import TeamHomeFive from "../homes/home-5/TeamHomeFive";
import BrandsHomeOne from "../homes/home/BrandsHomeOne";
import NewsletterHomeOne from "../homes/home/NewsletterHomeOne";
import TestimonialHomeOne from "../homes/home/TestimonialHomeOne";
import AboutArea from "./AboutArea";
import AboutCounter from "./AboutCounter";
import FeatureArea from "./FeatureArea";

 

const About = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbEvent title="About" subtitle="About" />
      <AboutArea />
      <FeatureArea />
      <TeamHomeFive style_2={true} />
      <AboutCounter />
      <TestimonialHomeOne />
			<BrandsHomeOne />
      <NewsletterHomeOne />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default About;
