import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import VerificationCodeForm from "./VerificationCodeForm";

 ;

const Verification = () => {
	const { user } = useAuth();
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="Verify Code" subtitle="Verify Code" />
			<VerificationCodeForm />
			<MarqueeOne style_2={true} />
			{user ? <FooterOne user={user} /> : <FooterTwo />}
			<ScrollTop />
		</>
	);
};

export default Verification;
