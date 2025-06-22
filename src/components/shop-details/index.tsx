import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import RealatedProducts from "./RealatedProducts";
import ShopDetailsArea from "./ShopDetailsArea";

 

const ShopDetails = () => {
  const { user } = useAuth();
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Shop Details" subtitle="Shop Details" />
      <ShopDetailsArea />
      <RealatedProducts />
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default ShopDetails;