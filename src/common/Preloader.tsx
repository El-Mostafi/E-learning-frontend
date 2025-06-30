import { useState, useEffect } from "react";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timer to hide the preloader after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {isVisible && (
        <div id="preloader" className="preloader">
          <div className="animation-preloader">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="edu-preloader-icon">
                <img src="/assets/img/preloader.gif" alt="" />
              </div>
            </div>

            <div className="txt-loading">
              <span data-text-preloader="L" className="letters-loading">
                L
              </span>
              <span data-text-preloader="U" className="letters-loading">
                U
              </span>
              <span data-text-preloader="M" className="letters-loading">
                M
              </span>
              <span data-text-preloader="I" className="letters-loading">
                I
              </span>
              <span data-text-preloader="N" className="letters-loading">
                N
              </span>
              <span data-text-preloader="A" className="letters-loading">
                A
              </span>
              <span data-text-preloader="R" className="letters-loading">
                R
              </span>
              <span data-text-preloader="A" className="letters-loading">
                A
              </span>
            </div>
            <p className="text-center">Loading</p>
          </div>
          <div className="loader">
            <div className="row">
              <div className="col-3 loader-section section-left">
                <div className="bg"></div>
              </div>
              <div className="col-3 loader-section section-left">
                <div className="bg"></div>
              </div>
              <div className="col-3 loader-section section-right">
                <div className="bg"></div>
              </div>
              <div className="col-3 loader-section section-right">
                <div className="bg"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
