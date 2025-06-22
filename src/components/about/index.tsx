import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import MapArea from "../contact/MapArea";
import NewsletterHomeOne from "../homes/home/NewsletterHomeOne";
import TeamHomeOne from "../homes/home/TeamHomeOne";
import TestimonialHomeOne from "../homes/home/TestimonialHomeOne";
import AboutArea from "./AboutArea";
import AboutCounter from "./AboutCounter";
import FeatureArea from "./FeatureArea";

const About = () => {
  const { user } = useAuth();
  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbEvent title="About" subtitle="About" />
      <AboutArea />
      <FeatureArea />
      <TeamHomeOne />
      <br />
      <br />
      <AboutCounter />
      <TestimonialHomeOne />
      {/* <BrandsHomeOne /> */}
      {!user && <NewsletterHomeOne />}

      <MapArea />
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default About;
