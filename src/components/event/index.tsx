import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import EventLisrArea from "./EventLisrArea";

 

const Event = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbEvent title="Event List" subtitle="Event List" />
      <EventLisrArea />
			<MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default Event;