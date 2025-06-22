import BreadcrumbShop from "../../common/breadcrumb/BreadcrumbShop";
import MarqueeOne from "../../common/MarqueeOne";
import Preloader from "../../common/Preloader";
import ScrollTop from "../../common/ScrollTop";
import { useAuth } from "../../context/AuthContext";
import FooterOne from "../../layouts/footers/FooterOne";
import FooterTwo from "../../layouts/footers/FooterTwo";
import HeaderOne from "../../layouts/headers/HeaderOne";
import CheckoutArea from "./CheckoutArea";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
  const {user} = useAuth();
  return (
    <>
      <Preloader />
      <HeaderOne />
      <BreadcrumbShop title="Checkout" subtitle="Checkout" />
      <Elements stripe={stripePromise}>
        <CheckoutArea />
      </Elements>
      <MarqueeOne style_2={true} />
      {user ? <FooterOne user={user} /> : <FooterTwo />}
      <ScrollTop />
    </>
  );
};

export default Checkout;
