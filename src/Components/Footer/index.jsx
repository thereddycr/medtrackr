import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./footer.css";
const Footer = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  function openWhatsAppChat() {
    window.open("https://wa.me/447405908255", "_blank");
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //   setShowPopup(true);
    setEmail("");
    window.alert("You have successfully subscribed!");
  };
  function openEmailApp() {
    window.location.href = "mailto:info@medtrakr.com";
  }
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content pt-5 pb-5">
          <div className="row">
            <div className="col-xl-4 col-lg-4 mb-50">
              <div className="footer-widget">
                <div className="footer-logo">
                  <a href="#Home-section">
                    <img src="White.png" className="img-fluid" alt="logo" />
                  </a>
                </div>
                <div className="footer-social-icon">
                  <span>Follow us</span>
                  <a href="#">
                    <i className="fab fa-facebook-f facebook-bg"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter twitter-bg"></i>
                  </a>

                  <a onClick={openWhatsAppChat}>
                    <i className="fab fa-whatsapp whatsapp-bg"></i>
                  </a>
                  <a onClick={openEmailApp}>
                    <i className="fas fa-envelope email-bg"></i>
                  </a>
                </div>
              </div>
                            <button class="btn mt-4 w-full hero-btn mb-4 mb-lg-0">
                                  <img Name="pt-sm-2 pb-sm-2 pt-1 pb-1 img-fluid" src="Apple.png"/>
                                </button>
                                
                                                      
                              <button className="btn mt-4   ms-sm-3  mb-4 ms-lg-0   mb-lg-0  ms-xxl-3    ms-0  w-full hero-btn">
                                <img className="pt-sm-2 pb-sm-2 pt-1 pb-1 img-fluid" src="Playstore.png"/>
                              </button>


            </div>

            <div className="col-xl-4 col-lg-4 mb-50 d-flex flex-column">
              <div className="col-xl-4 col-md-4 mb-3 mb-md-4">
                <div className="single-cta  d-flex align-items-center">
                  <i className="fas fa-phone"></i>
                  <div className="cta-text">
                    <h4>+447405908255</h4>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-4 mb-3 mb-md-4">
                <div className="single-cta  d-flex align-items-center">
                  <i className="far fa-envelope-open"></i>
                  <div className="cta-text">
                    <h4>info@medtrakr.com</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Subscribe</h3>
                </div>
                <div className="footer-text mb-25">
                  <p>
                    Don’t miss to subscribe to our new feeds, kindly fill the
                    form below.
                  </p>
                </div>
                <div className="subscribe-form">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <button type="submit">
                      <i className="fab fa-telegram-plane"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 text-center text-lg-left">
              <div className="copyright-text">
                <p>Copyright &copy; 2023, All Right Reserved </p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
              <div className="footer-menu">
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <Link className="nav-item" to="/terms">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-item" to="/privacy">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-item" to="/gdpr">
                      GDPR
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-item" to="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="subscription-popup">
          <div className="popup-content">
            <p>You have successfully subscribed!</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
