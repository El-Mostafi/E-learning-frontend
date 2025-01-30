import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import RegisterForm from "./RegisterForm";

 

const Register = () => {
	return (
		<>
		<Preloader />
			<HeaderOne /> 
			<BreadcrumbCourses title="Register" subtitle="Register" />
			<RegisterForm />       
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default Register;
