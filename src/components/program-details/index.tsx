import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ProgramDetailsArea from "./ProgramDetailsArea";
import ProgramRelatedArea from "./ProgramRelatedArea";

 

const ProgramDetails = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbEvent title="Program Details" subtitle="Program Details" />
			<ProgramDetailsArea />
			<ProgramRelatedArea />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default ProgramDetails;
