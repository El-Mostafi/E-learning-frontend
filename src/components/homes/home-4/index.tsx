import MarqueeThree from "../../../common/MarqueeThree";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterOne from "../../../layouts/footers/FooterOne";
import HeaderFour from "../../../layouts/headers/HeaderFour";
import AboutHomeFour from "./AboutHomeFour";
import BlogHomeFour from "./BlogHomeFour";
import ChooseHomeFour from "./ChooseHomeFour";
import CoursesHomeFour from "./CoursesHomeFour";
import CtaHomeFour from "./CtaHomeFour";
import EventHomeThree from "./EventHomeThree";
import FunfactHomeFour from "./FunfactHomeFour";
import HeroHomeFour from "./HeroHomeFour";
import InstagramHomeFour from "./InstagramHomeFour";
import TeamHomeFour from "./TeamHomeFour";
import TestimonialHomeFour from "./TestimonialHomeFour";

 
const HomeFour = () => {
  return (
    <>
    <Preloader />
    <HeaderFour />
    <HeroHomeFour />
    <ChooseHomeFour />
    <AboutHomeFour />
    <CoursesHomeFour />
    <FunfactHomeFour />
    <MarqueeThree />
    <TeamHomeFour />
    <EventHomeThree />
    <TestimonialHomeFour />
    <InstagramHomeFour />
    <BlogHomeFour />
    <CtaHomeFour />  
    <FooterOne style_2={true} /> 
    <ScrollTop />   
    </>
  );
};

export default HomeFour;