import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ForgotPasswordForm from "./ForgotPasswordForm";

 ;

const ForgotPassword = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="Forgot Password" subtitle="Forgot Password" />
			<ForgotPasswordForm />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default ForgotPassword;
