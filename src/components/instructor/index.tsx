import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import InstructorArea from "./InstructorArea";

 

const Instructor = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
			<BreadcrumbEvent title="Instructor" subtitle="Instructor" />
      <InstructorArea />       
			<MarqueeOne style_2={true} />
			<FooterOne />
      <ScrollTop />
    </>
  );
};

export default Instructor;