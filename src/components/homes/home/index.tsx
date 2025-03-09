import MarqueeOne from "../../../common/MarqueeOne";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterTwo from "../../../layouts/footers/FooterTwo";
import HeaderOne from "../../../layouts/headers/HeaderOne";
import AboutHomeOne from "./AboutHomeOne";
import BlogHomeOne from "./BlogHomeOne";
import BrandsHomeOne from "./BrandsHomeOne";
import ChooseHomeOne from "./ChooseHomeOne";
import FeatureHomeOne from "./FeatureHomeOne";
import HeroHomeOne from "./HeroHomeOne";
import NewsletterHomeOne from "./NewsletterHomeOne";
import PopularCoursesHomeOne from "./PopularCoursesHomeOne";
import TeamHomeOne from "./TeamHomeOne";
import TestimonialHomeOne from "./TestimonialHomeOne";
import TopCategoryHomeOne from "./TopCategoryHomeOne";
import { useAuth } from "../../../context/AuthContext";
import FooterOne from "../../../layouts/footers/FooterOne";

const HomeOne = () => {
  const { user } = useAuth();

  return (
    <>
      <Preloader />
      <HeaderOne />
      <HeroHomeOne />
      <FeatureHomeOne />
      <TopCategoryHomeOne />
      <AboutHomeOne />
      <PopularCoursesHomeOne />
      <MarqueeOne />
      <ChooseHomeOne />
      <TeamHomeOne />
      <NewsletterHomeOne />
      <TestimonialHomeOne />
      <BrandsHomeOne />
      <BlogHomeOne />
      <MarqueeOne />
      {user!==null ? <FooterOne /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default HomeOne;
