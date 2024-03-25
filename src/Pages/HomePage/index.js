import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import VideoCard from "../../Components/VideoPlayback";
import Footer from "../../Components/Footer";
import DeliveryBox from "../../Components/deliveryBox/DeliveryBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { BsCheckCircle } from "react-icons/bs";

const useTawkTo = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6525469c6fcfe87d54b86625/1hccpnmnu";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};
const navItems = [
  { id: 1, label: "Home", link: "#Home-section" },
  { id: 2, label: "Delivery", link: "#delivery-section" },
  { id: 3, label: "MDS", link: "#appointments-section" },
  { id: 4, label: "Appointment", link: "#mds-section" },
  { id: 5, label: "Reports", link: "#reports-section" },
];
const serviceItems = [
  {
    id: 1,
    iconSrc: "save-time.png",
    text: "Save time",
  },
  {
    id: 2,
    iconSrc: "user-friendly.png",
    text: "User friendly",
  },
  {
    id: 3,
    iconSrc: "rating.png",
    text: "Feature Rich",
  },
];

const deliveryBoxesData = [
  {
    id: 1,
    imgSrc: "epod.png",
    title: "Enhanced Delivery with e-POD",
  },
  {
    id: 2,
    imgSrc: "location.png",
    title: "Geolocation and time stamps",
  },
  {
    id: 3,
    imgSrc: "phone.png",
    title: "Real time Delivery Tracking",
  },
  {
    id: 4,
    imgSrc: "booking1.png",
    title: "Effortless Appointment Bookings",
  },
  {
    id: 5,
    imgSrc: "pharmacy1.png",
    title: "Pharmacy intelligence for optimization",
  },
  {
    id: 6,
    imgSrc: "patient.png",
    title: "Powerful Automated Reports",
  },
  {
    id: 7,
    imgSrc: "automatic.png",
    title: "MDS RX Management",
  },
  {
    id: 8,
    imgSrc: "report.png",
    title: "Rx Collection Management",
  },
];
const listItems = [
  {
    id: 1,
    text: "Visualize deliveries on interactive maps to gain insights into geographical analysis",
  },
  {
    id: 2,
    text: "Optimize driver efficiency with metrics such as delivery time and deliveries per hour",
  },
  {
    id: 3,
    text: "Analyze delivery frequency to optimize operations and enhance efficiency",
  },
  {
    id: 4,
    text: "Simplify  deliveries with automated booking for order  management",
  },
  {
    id: 5,
    text: "Enhance route efficiency by tracking total miles and time per route",
  },
  {
    id: 6,
    text: "Generate multiple delivery reports tailored to your specific needs",
  },
  {
    id: 7,
    text: "Prompt failed delivery reports for quick resolution",
  },
];

const bookingItems = [
  {
    id: 1,
    text: "Clear visualization of available dates and times in a single window",
  },
  {
    id: 2,
    text: "Track  number of bookings  and customers who did not make appointments",
  },
  {
    id: 3,
    text: "Efficient booking and scheduling of services",
  },
  {
    id: 4,
    text: "Calendar view for easy management and visualization",
  },
  {
    id: 5,
    text: "Customizable settings per pharmacy to tailor the experience",
  },
  {
    id: 6,
    text: "Embrace complete control over  post-booking communication with  website",
  },
];

var settings = {
  dots: true,
  infinite: false,
  speed: 100,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HomePage = () => {
  useTawkTo();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };
  function closeNavbarDropdown() {
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  }

  return (
    <div>
      <div className="home-nav" id="Home-section">
        <nav className="navbar navbar-expand-lg ">
          <div className="container">
            <a href="#Home-section" className="nav-link">
              <img src="med.png" className="logo img-fluid"></img>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto  me-auto     mb-2 mb-lg-0">
                {navItems.map((item) => (
                  <li
                    className="nav-item  me-xl-3 ms-xl-3  me-md-1 ms-md-1 "
                    key={item.id}
                    onClick={() => closeNavbarDropdown()}
                  >
                    <a className="nav-link" href={item.link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <button type="button " class="btn btn-login">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      
      <VideoCard />

      <div className="services px-2">
        <div className="  container">
          <div className="row">
            <h1 className="text-center">
              Embrace a streamlined, error-free journey in your pharmacy
              operations today
            </h1>
            <p className="text-center">
              One-stop solution to manage your delivery tasks and accessing
              essential features effortlessly across multiple platforms
            </p>
            <div className="d-flex align-items-center justify-content-center mt-5">
              {serviceItems.map((item) => (
                <div key={item.id} className="me-sm-5 ms-sm-5 me-3 ms-3">
                  <img
                    src={item.iconSrc}
                    className="img-fluid services-box me-2"
                    alt="Service Icon"
                  />
                  <span className="services-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="delivery-features-main ">
        <div className="delivery-features container">
          <h1 className="text-center pb-5 ">
            MedTrakr's comprehensive features:
          </h1>
          <div className="row pt-1 ">
            {deliveryBoxesData.map((box) => (
              <DeliveryBox key={box.id} imgSrc={box.imgSrc} title={box.title} />
            ))}
          </div>
        </div>
      </div>

      <div className="del" id="delivery-section" name="Delivery">
        <div className="container-fluid">
          <div className="row  bg-white ">
            <div className="col-md-5 pe-0 ps-0 d-flex align-items-center">
              <img src="DeliveryHQ.jpg" className="img-fluid"></img>
            </div>
            <div className="col-md-7  pt-5 pb-4  align-items-center  ">
              <span className="text-center delivery-heading">Delivery</span>

              <h1 className="mt-4">
                Unlock the power of Pharmacy Intelligence for enhanced delivery
                operations
              </h1>
              <ul className="mt-4">
                {listItems.map((item) => (
                  <li key={item.id} className="mt-3 d-flex align-items-center">
                    <BsCheckCircle size={30} className="me-3 tick" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div name="Appointment" id="mds-section" className="booking ">
        <div className=" container">
          <div className="row">
            <div className="col-md-5">
              <img src="illustration.png" className="img-fluid"></img>
            </div>
            <div className="col-md-7">
              <span className="apointment-span">Appointment bookings</span>
              <h1 className="mt-4">
                Managing your service bookings becomes a breeze
              </h1>
              <ul className="mt-4">
                {bookingItems.map((item) => (
                  <li key={item.id} className="mt-3 d-flex align-items-center">
                    <BsCheckCircle size={30} className="me-3 tick" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div name="MDS" id="appointments-section" className="mds">
        <div className=" container">
          <div className="row">
            <div className="col-md-7">
              <span>MDS</span>
              <h2 className="mt-4">
                Welcome to the future of pharmacy management!
              </h2>

              <p className="mt-4">
                Say goodbye to paperwork and embrace the power of automation
                with our cutting-edge dossette box management system. Track
                every step of the process – from Rx requests to Rx received and
                dossette box preparation – all in one place.
              </p>
              <p className="mt-4">
                No more missed deadlines or forgotten tasks! Enjoy daily
                reminders for Rx requests, dossette box deliveries, and more,
                keeping you on track and efficient. And that's not all! Our
                system generates wonderful reports to give you valuable insights
                into your pharmacy's performance and efficiency.
              </p>
            </div>
            <div className="col-md-5">
              <img src="mds.png" className="img-fluid"></img>
            </div>
          </div>
        </div>
      </div>

      <div name="Reports" id="reports-section" className="reports">
        <div className=" container">
          <div className="row">
            <div className=" ms-auto col-md-6 align-self-center">
              {" "}
              <img src="ReportHQPNG.png" className="img-fluid mt-4"></img>
            </div>
            <div className="col-md-6">
              <span className="">Reports</span>
              <h2 className="mt-3">Automated Reports Generation</h2>
              <p className="mt-3">
                With MedTrakr, powerful reports are automatically generated at
                every step of your pharmacy business, empowering you to make
                informed decisions. You'll have access to detailed
                delivery-related reports, collections-related reports, and
                dossette box-related reports, all at your fingertips.
              </p>
              <p className="mt-3">
                Stay on top of your pharmacy's performance and streamline your
                decision-making process effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
