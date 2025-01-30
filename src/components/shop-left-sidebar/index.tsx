import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import FooterOne from "../../layouts/footers/FooterOne";
import HeaderOne from "../../layouts/headers/HeaderOne";
import ShopLeftSidebarArea from "./ShopLeftSidebarArea";

 

const ShopLeftSidebar = () => {
  return (
    <>
    <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Shop Left Sidebar" subtitle="Shop Left Sidebar" />
      <ShopLeftSidebarArea />
      <MarqueeOne style_2={true} />
      <FooterOne />
      <ScrollTop />
    </>
  );
};

export default ShopLeftSidebar;