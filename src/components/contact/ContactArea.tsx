const ContactArea = () => {
  return (
    <>
      <section className="contact-section section-padding pt-0 fix">
        <div className="container">
          <div className="section-title text-center">
            <h6 className="wow fadeInUp">Get In Touch</h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Need More Information?
            </h2>
          </div>
          <div className="row">
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="contact-box-items">
                <div className="icon">
                  <i className="flaticon-map"></i>
                </div>
                <h5>Academic Location</h5>
                <div className="image">
                  <img src="assets/img/small-line.png" alt="img" />
                </div>
                <h4>
                  National School of Applied Sciences, Avenue My Abdallah Km 5{" "}
                  <br />
                  Imouzzer Road, Fez BP 72.
                </h4>{" "}
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <div className="contact-box-items">
                <div className="icon">
                  <i className="flaticon-send-data"></i>
                </div>
                <h5>Email Address</h5>
                <div className="image">
                  <img src="assets/img/small-line.png" alt="img" />
                </div>
                <h4>
                  <a href="mailto:helpdesk.elearningapp@gmail.com">
                    help.luminara@gmail.com
                  </a>
                </h4>
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".7s"
            >
              <div className="contact-box-items">
                <div className="icon">
                  <img src="assets/img/call.png" alt="img" />
                </div>
                <h5>Emergency</h5>
                <div className="image">
                  <img src="assets/img/small-line.png" alt="img" />
                </div>
                <h4>
                  <a href="tel:+212626952247">+212 626-95-22-47</a> <br />
                  <a href="tel:+212695722547">+212 695-72-25-47</a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactArea;
