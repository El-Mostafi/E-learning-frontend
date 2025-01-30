import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ShopGridArea from "./ShopGridArea";

 

const ShopGrid = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Shop Page" subtitle="Shop" />
      <ShopGridArea />
      <MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default ShopGrid;