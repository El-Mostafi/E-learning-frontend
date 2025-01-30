import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ProgramArea from "./ProgramArea";

 

const Program = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
			<BreadcrumbEvent title="Program" subtitle="Program" />
      <ProgramArea />       
			<MarqueeOne style_2={true} />
			<FooterOne />
      <ScrollTop />
    </>
  );
};

export default Program;