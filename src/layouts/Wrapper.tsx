

import { useEffect } from "react";
import ScrollToTop from "../common/ScrollToTop";    
import WOW from "wow.js"; 

const Wrapper = ({ children }: any) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import bootstrap's JavaScript bundle
      import("bootstrap/dist/js/bootstrap.bundle.min.js")
        .then(() => {
          console.log('Bootstrap JS loaded');
        })
        .catch(error => console.error('Error loading Bootstrap JS:', error));
    }
  }, []);
 
  useEffect(() => {
    // Initialize WOW.js for animations
    const wow = new WOW({ live: false });
    wow.init();
  }, []);
 
  return (
    <> 
      {children}
      <ScrollToTop /> 
    </>
  );
};

export default Wrapper;
 