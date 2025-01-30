import MarqueeTwo from "../../../common/MarqueeTwo";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterThree from "../../../layouts/footers/FooterThree";
import HeaderThree from "../../../layouts/headers/HeaderThree";
import AboutHomeThree from "./AboutHomeThree";
import BlogHomeThree from "./BlogHomeThree";
import ChooseHomeThree from "./ChooseHomeThree";
import CoursesHomeThree from "./CoursesHomeThree";
import CtaHomeThree from "./CtaHomeThree";
import EventHomeThree from "./EventHomeThree";
import FaqHomeThree from "./FaqHomeThree";
import HeroHomeThree from "./HeroHomeThree";
import InstagramHomeThree from "./InstagramHomeThree";
import PartnarsHomeThree from "./PartnarsHomeThree";
import TestimonialHomeThree from "./TestimonialHomeThree";

 

const HomeThree = () => {
  return (
    <>
    <Preloader />
      <HeaderThree />
      <HeroHomeThree />
      <AboutHomeThree />
      <MarqueeTwo />
      <CoursesHomeThree />
      <ChooseHomeThree />
      <EventHomeThree />
      <TestimonialHomeThree />
      <MarqueeTwo />
      <PartnarsHomeThree />
      <BlogHomeThree />
      <FaqHomeThree />
      <InstagramHomeThree />
      <CtaHomeThree />
      <MarqueeTwo />
      <FooterThree />
      <ScrollTop />
    </>
  );
};

export default HomeThree;