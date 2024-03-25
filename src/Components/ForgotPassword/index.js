import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";
import Axios from "../../Services/axios";
import { toast } from "react-toastify";
const ForgotPassword = () => {
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
		console.log(values);
		try {
		  const response = await Axios.post("/users/forgotPassword", {
			email: values.email,
			newPassword: values.password,
		  });
		  toast.success(
			"Email with Password reset instructions has been sent to your email address."
		  );
		} catch (error) {
		  // Handle login error
		  console.error(error);
		  toast.error(error.message || "An error occurred during login");
		}
	  };
	
	return (
		<>
			<div className="login-container">
				<div class="card col-md-4">
					<h2 className="text-center">Forgot Password</h2>
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
									<ErrorMessage name="email" component="div" className="alert text-danger" />
								</div>
								<div className="form-group mt-4">
									<label htmlFor="password ">New Password</label>
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
											style={{ color: "skyblue", textDecoration: "underline", cursor: "pointer" }}
											onClick={() => {
												setTogglePassword(!togglePassword);
											}}
										>
											Show Password
										</span>
									</div>
									<ErrorMessage name="password" component="div" className="alert text-danger" />
								</div>
								<button type="submit" to="/sidebar" className="btn  mt-5">
									Send Link
								</button>
							</Form>
						</Formik>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
