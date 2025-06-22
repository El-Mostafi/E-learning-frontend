import BreadcrumbEvent from "../../common/breadcrumb/BreadcrumbEvent";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ContactArea from "./ContactArea";
import ContactForm from "./ContactForm";
import MapArea from "./MapArea";

const Contact = () => {
  const { user } = useAuth();
  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbEvent title="Contact" subtitle="Contact" />
      <ContactArea />
      <MapArea />
      <ContactForm />
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default Contact;
