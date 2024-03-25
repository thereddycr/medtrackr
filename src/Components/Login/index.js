import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [togglePassword, setTogglePassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const handleSubmit = async (values) => {
    try {
      // Check if the email and password match the specific credentials
      if (values.email === "test@gmail.com" && values.password === "Test@123") {
        // Set the necessary user information in local storage
        localStorage.setItem("tokenMedt", "fakeToken");
        localStorage.setItem("role", "user");
        localStorage.setItem("email", values.email);
        localStorage.setItem("userName", "Test User");
        localStorage.setItem("UserId", "123456");
        window.alert("Logged In Successfully");

        // Redirect to dashboard or any other protected route
        window.location.href = "/dashboard";
      } else {
        // If the email and password do not match the specific credentials, proceed with API call
        const response = await fetch("https://app.medtrakr.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!response.ok) {
          // Check for non-2xx HTTP response status
          const errorResponseData = await response.json();
          throw new Error(errorResponseData.message || "An error occurred");
        }

        const responseData = await response.json();
        console.log(responseData);
        // Store token and other information in local storage
        localStorage.setItem("tokenMedt", responseData.token);
        localStorage.setItem("role", responseData.role);
        localStorage.setItem("email", responseData.email);
        localStorage.setItem("userName", responseData.username);
        localStorage.setItem("UserId", responseData.UserId);
        window.alert("Logged In Successfully");

        // Redirect to dashboard or any other protected route
        window.location.href = "/dashboard";
      }
    } catch (error) {
      // Handle login error
      window.alert(error.message || "An error occurred during login");
    }
  };

  // const handleSubmit = async (values) => {
  //   try {
  //     const response = await fetch("https://app.medtrakr.com/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: values.email,
  //         password: values.password,
  //       }),
  //     });

  //     if (!response.ok) {
  //       // Check for non-2xx HTTP response status
  //       const errorResponseData = await response.json();
  //       throw new Error(errorResponseData.message || "An error occurred");
  //     }

  //     const responseData = await response.json();
  //     console.log(responseData);
  //     // Store token and other information in local storage
  //     localStorage.setItem("tokenMedt", responseData.token);
  //     localStorage.setItem("role", responseData.role);
  //     localStorage.setItem("email", responseData.email);
  //     localStorage.setItem("userName", responseData.username);
  //     localStorage.setItem("UserId", responseData.UserId);
  //     window.alert("Logged In Successfully");

  //     // Redirect to dashboard or any other protected route
  //     window.location.href = "/dashboard";
  //   } catch (error) {
  //     // Handle login error
  //     window.alert(error.message || "An error occurred during login");
  //   }
  // };

  return (
    <>
      <div className="login-container">
        <div class="card col-md-4 ">
          <h2 className="text-center mt-4">Sign in to Continue </h2>
          <div class="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="email ">Email</label>
                  <Field
                    type="email"
                    className="form-control mt-2"
                    placeholder="Enter email address"
                    id="email"
                    name="email"
                    required
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert text-danger"
                  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="password ">Password</label>
                  <Field
                    type={togglePassword ? "text" : "password"}
                    className="form-control mt-2"
                    placeholder="Enter password"
                    id="password"
                    name="password"
                    required
                  />
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                      marginTop: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        color: "skyblue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setTogglePassword(!togglePassword);
                      }}
                    >
                      Show Password
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert text-danger"
                  />
                  <Link to={"/forgotPassword"}>
                    <span>Forgot Password?</span>
                  </Link>
                </div>
                <button type="submit" to="/sidebar" className="btn  mt-5">
                  Login
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
