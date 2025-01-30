import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import SignInForm from "./SignInForm";

 ;

const SignIn = () => {
	return (
		<>
		<Preloader />
			<HeaderOne />
			<BreadcrumbCourses title="Sign In" subtitle="Sign In" />
			<SignInForm />
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default SignIn;
