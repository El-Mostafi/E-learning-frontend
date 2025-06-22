import BreacrumbEventDetails from "../../common/breadcrumb/BreacrumbEventDetails";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import EventDetailsArea from "./EventDetailsArea";

 

const EventDetails = () => {
	const { user } = useAuth();
	return (
		<>
		<Preloader />
			<HeaderOne />
      <BreacrumbEventDetails />
      <EventDetailsArea />
      <MarqueeOne style_2={true} />
			{user ? <FooterOne user={user} /> : <FooterTwo />}
			<ScrollTop />
		</>
	);
};

export default EventDetails;
