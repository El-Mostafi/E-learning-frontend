import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ResetPasswordForm from "./ResetPasswordForm";

 ;

const ResetPassword = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="Reset Password" subtitle="Reset Password" />
			<ResetPasswordForm />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default ResetPassword;
