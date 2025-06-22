import MarqueeOne from "../../../common/MarqueeOne";
import Preloader from "../../../common/Preloader";
import ScrollTop from "../../../common/ScrollTop";
import FooterTwo from "../../../layouts/footers/FooterTwo";
import HeaderOne from "../../../layouts/headers/HeaderOne";
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
import TrendingCourses from "./TrendingCourses";
import RecommendedCourses from "./RecommendedCourses";
import AboutHomeOne from "./AboutHomeOne";


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
      {user!==null ? (user.role === "student" ? <RecommendedCourses /> : null) : null}
      <PopularCoursesHomeOne />
      <TrendingCourses />
      <MarqueeOne />
      <ChooseHomeOne />
      <TeamHomeOne />
      {!user ? <NewsletterHomeOne />: null}
      <TestimonialHomeOne />
      {/* <BrandsHomeOne /> */}
      {/* <BlogHomeOne /> */}
      <MarqueeOne />
      {user!==null ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default HomeOne;
