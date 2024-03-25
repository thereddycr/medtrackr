  import  { useState } from "react";
  import "./ContactForm.css";
  import { FaMapMarkerAlt } from "react-icons/fa";
  import { BsFillTelephoneFill } from "react-icons/bs";
  import { MdEmail } from "react-icons/md";
  import React, { useRef } from 'react';
  import emailjs from '@emailjs/browser';
  import {useNavigate} from "react-router-dom"
  import { toast } from 'react-toastify';
  import { Link } from "react-router-dom";
  
import {AiOutlineArrowLeft}  from 'react-icons/ai';


  const ContactForm = () => {

    const navigate = useNavigate();   
    const form = useRef();
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // You can add the code to send the data to your server and then to Mailchimp here.
      // This typically involves using an API to interact with Mailchimp's services.
    };

    const sendEmail = (e) => {
      e.preventDefault();

      emailjs.sendForm('service_ucybbm8', 'template_pmf7rh4', form.current, '8WQcF-eVVmIv7bwEc')
        .then((result) => {
            console.log(result.text);
            toast.success("Your message have been sent", {position: 'top-right',});
            navigate("/")

        }, (error) => {
          toast.error('Failed to send Email', {position: 'top-right',});
            console.log(error.text);
        });
    };
    return (
      <>
        <div className="login-container">
            <div className="row pt-1 ">

              <div class="card col-md-4 left  ">
              <Link to="/" className="arrow"><AiOutlineArrowLeft size={30}/></Link>  
                <h1 className="card-heading mt-4">Let's get in touch</h1>
                <p className="mt-3 card-paragraph">We appreciate your message.You can expect to hear back from us within the next 24 hours</p>
                <div class="card-body ">
                  <li className="d-flex mt-2 align-items-center">
                  <div className="icon-wrapper">
                    <BsFillTelephoneFill size={20} className="icon"/>
                    </div>
                    <span className="ms-3">
                      {" "}
                      <strong className="me-2">Phone:  </strong>+44 7405 908255
                    </span>
                  </li>
                  <li className="d-flex mt-4 align-items-center">
                  <div className="icon-wrapper">
                    <MdEmail size={20} className="icon"/>
                    </div>
                    <span className="ms-3">
                      {" "}
                      <strong className="me-2 ">Email:</strong>info@medtrakr.com
                    </span>
                  </li>
                </div>
              </div>
              <div class="card col-md-8 right ">
                <h1>Get in touch</h1>
                <div class="card-body ps-5 pe-5 pb-5">
                  <form   ref={form} className="row"          onSubmit={sendEmail}>
                    <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-heading">Name<span className="star ms-1 ">*</span></label>
                      <input
                        type="text"
                        name="from_name"
                        placeholder="Name"
                        required 
                      />
                    </div>
                    </div>
                    <div className="col-md-6">
                    <div className="form-group">
                      <label className="label-heading">Email<span className="star ms-1 ">*</span></label>
                      <input
                        type="email"
                        name="from_email"
                        placeholder="Email"
                        required 
                      />
                    </div>
                    </div>

                    <div className="form-group mt-3">
                      <label  className="label-heading">Phone<span className="star ms-1 ">*</span></label>
                      <input
                        type="tel"
                        name="form_phone"
                        required 

                      />
                    </div>

                    <div className="form-group mt-4 message">
                      <label htmlFor="message" className="label-heading">Message:</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        
                        rows="4" cols="50"
                      ></textarea>
                    </div>
                    <div className="d-flex  p-3">
                    
                    <input type="submit" className="email-send" value="Send" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          
        </div>
      </>
    );
  };

  export default ContactForm;
