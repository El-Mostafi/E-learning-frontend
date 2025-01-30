import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ShopRightSidebarArea from "./ShopRightSidebarArea";

 

const ShopRightSidebar = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Shop Right Sidebar" subtitle="Shop Right Sidebar" />
      <ShopRightSidebarArea />
      <MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default ShopRightSidebar;