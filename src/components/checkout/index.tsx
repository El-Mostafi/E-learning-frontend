import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CheckoutArea from "./CheckoutArea";

 
const Checkout = () => {
  return (
    <>
    <Preloader />
       <HeaderOne />
      <BreadcrumbShop title="Checkout" subtitle="Checkout" />
      <CheckoutArea />
      <MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default Checkout;