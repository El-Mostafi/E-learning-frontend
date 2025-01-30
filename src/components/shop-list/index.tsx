import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ShopListArea from "./ShopListArea";

 

const ShopList = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Shop Page" subtitle="Shop List View" />
      <ShopListArea />
      <MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default ShopList;