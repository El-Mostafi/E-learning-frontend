import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ProfileForm from "./ProfileForm";

 

const Profile = () => {
	return (
		<>
		<Preloader />
			<HeaderOne /> 
			<BreadcrumbCourses title="Profile" subtitle="Profile" />
			<ProfileForm />       
			<MarqueeOne style_2={true} />
			<FooterOne />
			<ScrollTop />
		</>
	);
};

export default Profile;
