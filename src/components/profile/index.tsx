import BreadcrumbCourses from "../../common/breadcrumb/BreadcrumbCourses";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ProfileForm from "./Profile Form/index";
// import ProfileForm from "./ProfileForm";

 

const Profile = () => {
	const { user } = useAuth();
	return (
		<>
		<Preloader />
			<HeaderOne /> 
			<BreadcrumbCourses title="Profile" subtitle="Profile" />
			<ProfileForm />       
			<MarqueeOne style_2={true} />
			{user ? <FooterOne user={user} /> : <FooterTwo />}
			<ScrollTop />
		</>
	);
};

export default Profile;
