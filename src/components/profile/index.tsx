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
import { isTokenValid } from '../../utils/ProtectedRoutes';

 

const Profile = () => {
	const {user} = useAuth();
	return (
		<>
		<Preloader />
			<HeaderOne /> 
			<BreadcrumbCourses title={user && isTokenValid() && user.role === "admin" ? "Dashboard" : "Profile"} subtitle={user && isTokenValid() && user.role === "admin" ? "Dashboard" : "Profile"} />
			<ProfileForm />       
			<MarqueeOne style_2={true} />
			{user ? <FooterOne user={user} /> : <FooterTwo />}
			<ScrollTop />
		</>
	);
};

export default Profile;
