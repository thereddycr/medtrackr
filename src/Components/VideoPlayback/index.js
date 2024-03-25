import React from "react";
import "./video.css"; 
import { Link } from "react-router-dom";
const VideoCard = () => {
  return (
    
    <>
      <div class="video-container">
        <video autoPlay loop muted id="background-video">
          <source src="desktop.mp4" type="video/mp4" />
        </video>
        <div class="text-content">
          <h1 className="">Effortless Pharmacy Management</h1>
          <p className="mt-3 video-paragraph" >Optimize Efficiency, Maximize Profits, and Delight Your Customers </p>
          <div className="action-buttons mt-xl-3    mt-lg-0">
            <button className="btn btn-login  px-4    ms-0">
           <i className="fas fa-play me-2"></i><Link to='contact' className="list-none   text-white">Try Today</Link>
            </button>
            <button className="btn btn-secondary px-4   ">
             {" "}
             <i className="fas fa-video me-2"></i><Link to='contact' className="list-none   text-white"> Request Demo</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCard;
