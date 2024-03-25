import React, { useEffect, useState } from "react";

import "./createmember.css";
import Axios from "../../Services/axios";
import ConfirmationModal from "../../Components/confirmationModal";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";



function CreateMember() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const isSpecialUser = queryParams.get("specialUser") === "true";
	const [mode, setMode] = useState("add");
	const [selectedMember, setSM] = useState({});
	const [members, setMembers] = useState([]);
	const [routes, setRoutes] = useState([]);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [surname, setSurname] = useState("");
	const [password, setPassword] = useState("");
	const [idPhoto, setIdPhoto] = useState("");
	const [idPhotoPreview, setIdPhotoPreview] = useState("");
	const [permissions, setPermissions] = useState({});
	const [isDriver, setIsDriver] = useState(false);
	const [assignedRoute, setAssignedRoute] = useState(null);
	const [confirmationModal1, setCM1] = useState(false);
	const [confirmationModal2, setCM2] = useState(false);
	const [togglePassword, setTogglePassword] = useState(false);

	const handleNameChange = (e) => {
		setName(e.target.value);
	};
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSurnameChange = (e) => {
		setSurname(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleIdPhotoChange = (e) => {
		const file = e.target.files[0];
		setIdPhoto(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setIdPhotoPreview(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			setIdPhotoPreview("");
		}
	};

	const getRoutes = () => {
		Axios.get("/routes/routes")
			.then((res) => {
				setRoutes(res.data);
			})
			.catch((err) => {
				console.log("Error getting routes");
			});
	};

	const handlePermissionsChange = (e) => {
		const permission = e.target.checked;
		setPermissions({ ...permissions, [e.target.name]: permission });
	};

	const handleIsDriverChange = (e) => {
		setIsDriver(e.target.checked);
	};

	const handleAssignedRouteChange = (e) => {
		setAssignedRoute(e.target.value);
	};

	const handleSave = async () => {
		if(!idPhoto) {
			toast.warning("Please Chose a Photo first", {position: 'top-right',});	
		return
		}
		const formData = new FormData(); 

		formData.append("name", name);
		formData.append("surname", surname);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("permissions", JSON.stringify(permissions));
		formData.append("isDriver", isDriver);
		formData.append("assignedRoute", assignedRoute);
		formData.append("role", isDriver ? "DRIVER" : "MANAGER");
		formData.append("idPhoto", idPhoto);
		try {
			const response = await fetch("https://app.medtrakr.com/users/createUser", {
			  method: "POST",
			  body: formData,
			});
		
			if (!response.ok) {
				if (response.message) throw new Error(response.message);
				else throw new Error("Failed to create member");
			}

			const createdUser = await response.json();

			// Update the UI with the created member
			setMembers([...members, createdUser]);
			// Reset the input fields
			setName("");
			setSurname("");
			setPassword("");
			setEmail("");
			setIdPhoto("");
			setIdPhotoPreview("");
			setPermissions({});
			setIsDriver(false);
			setAssignedRoute("");
			toast.success("Pharmacy Member Created Successfully", {position: 'top-right',});
			fetchMembers();
		} catch (error) {
			toast.error(`Error: ${error.message}`, {position: 'top-right',});
		}
		setName("");
		setSurname("");
		setPassword("");
		setEmail("");
		setIdPhoto("");
		setIdPhotoPreview("");
		setPermissions({});
		setIsDriver(false);
		setAssignedRoute("");
	};
	
	const handleEdit = () => {
		// const editedMember = members[index];
		setName(selectedMember.name);
		setEmail(selectedMember.email);
		setSurname(selectedMember.surname);
		setIdPhoto(selectedMember.idPhoto);
		setIdPhotoPreview(selectedMember.idPhotoPreview);
		setPermissions(selectedMember.permissions);
		setIsDriver(selectedMember.isDriver);
		setAssignedRoute(selectedMember.assignedRoute);
	};
	
	const handleSubmitEdit = () => {
		const newMember = {
			name,
			surname,
			email,
			password,
			idPhoto,
			permissions,
			isDriver,
			assignedRoute: assignedRoute,
			role: isDriver ? "DRIVER" : "PHARMACIST",
		};
		const formData = new FormData(); 
		formData.append("name", newMember.name);
		formData.append("surname", newMember.surname);
		formData.append("email", newMember.email);
		formData.append("password", newMember.password);
		formData.append("permissions", JSON.stringify(newMember.permissions));
		formData.append("isDriver", newMember.isDriver);
		formData.append("assignedRoute", newMember.assignedRoute);
		formData.append("role", newMember.isDriver ? "DRIVER" : "MANAGER");
		formData.append("idPhoto", newMember.idPhoto);
		Axios.put("/users/updateUser?id=" + selectedMember.id, formData)
		.then((res) => {

			toast.success("Pharmacy Member Edited Successfully", {position: 'top-right',});
			fetchMembers();
			setName("");
			setSurname("");
			setPassword("");
			setEmail("");
			setIdPhoto("");
			setIdPhotoPreview("");
			setPermissions({});
				setIsDriver(false);
				setAssignedRoute("");
				setSM({});
			})
			.catch((err) => {
				toast.error("Pharmacy Member Edited Failed", {position: 'top-right',});
				console.log("Error editing Member");
			});
	};

	const handleDelete = () => {
		Axios.delete("/users/deleteUser?id=" + selectedMember.id)
			.then((res) => {
				toast.success("Pharmacy Member Deleted Successfully", {position: 'top-right',});
				setSM({});
				fetchMembers();
			})
			.catch((err) => {
				toast.error("Pharmacy Member Deleted Failed", {position: 'top-right',});
				console.log("Error deleting member: ", err);
			});
	};

	async function fetchMembers() {
		try {
			const response = await fetch("https://app.medtrakr.com/users/getUser");
			if (!response.ok) {
				throw new Error("Failed to fetch members");
			}
			const data = await response.json();
			setMembers(data); 
		} catch (error) {
			console.error("Error fetching members:", error);
		}
	}

	useEffect(() => {
		getRoutes();
		fetchMembers();
	}, []);

	return (
		<>
			<div className="main-wrapper">
				<div className="container-fluid">
					<div className="card">
						{/* <div className="page-heading">Enter Member Details</div> */}
					<div className="card-body">
					{isSpecialUser?	
							<div className="row">
								<h2>Current User</h2>
								<div className="d-flex align-items-center justify-content-around">
								<div className="d-flex">
									<h2 className="me-2">Name:</h2>
									<h4>{localStorage.getItem("userName")}</h4>
								</div>
								<div className="d-flex">
									<h2 className="me-2">Email:</h2>
									<h4>{localStorage.getItem("email")}</h4>
								</div>
								<div className="d-flex">
									<h2 className="me-2">Role:</h2>
									<h4>{localStorage.getItem("role")}</h4>
								</div>
								</div>
							</div>
					:""
					}
							<button
								type="button"
								class="btn btn-dark add"
								data-toggle="modal"
								data-target="#memberModalCenter"
								onClick={() => {
									setMode("add");
								}}
							>
								Create Member
							</button>

							<div
								class="modal fade"
								id="memberModalCenter"
								tabindex="-1"
								role="dialog"
								aria-labelledby="memberModalCenterTitle"
								aria-hidden="true"
							>
								<div class="modal-dialog modal-dialog-centered" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												Create a member
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body row">
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="name">Name:</label>
												<input
													type="text"
													id="name"
													required
													value={name}
													onChange={handleNameChange}
												/>
											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="surname">Surname:</label>
												<input
													type="text"
													id="surname"
													value={surname}
													onChange={handleSurnameChange}
												/>
											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="email">Email:</label>
												<input
													type="text"
													id="email"
													required
													value={email}
													onChange={handleEmailChange}
												/>
											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="password">Password:</label>
												<input
													type={togglePassword ? "text" : "password"}
													id="password"
													required
													value={password}
													onChange={handlePasswordChange}
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


											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="idPhoto">ID Photo:</label>
												<input
													type="file"
													id="idPhoto"
													accept="image/*"
													onChange={handleIdPhotoChange}
												/>
												{idPhotoPreview && (
													<div className="preview">
														<img src={idPhotoPreview} alt="ID Photo Preview" />
													</div>
												)}
											</div>
											<div className="col-md-12 col-xs-12 form-field row">
												<label>Assign Permissions:</label>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-center" htmlFor="deliveryTrakr">
															Create
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canCreate"
															name="canCreate"
															checked={permissions?.canCreate}
															onChange={handlePermissionsChange}
														/>
													</span>
												</div>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-center " htmlFor="deliveryTrakr">
															Edit
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canEdit"
															name="canEdit"
															checked={permissions?.canEdit}
															onChange={handlePermissionsChange}
														/>
													</span>
												</div>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-center delete" htmlFor="deliveryTrakr">
															Delete
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canDelete"
															name="canDelete"
															checked={permissions?.canDelete}
															onChange={handlePermissionsChange}
														/>
													</span>
												</div>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label htmlFor="isDriver">Mark as Driver:</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="isDriver"
															checked={isDriver}
															onChange={handleIsDriverChange}
														/>
													</span>
												</div>
												{isDriver && (
													<div className="form-field">
														<label htmlFor="assignedRoute">Assigned Route:</label>
														<select
															value={assignedRoute}
															onChange={(e) => setAssignedRoute(e.target.value)}
														>
															<option value="">Select Route</option>
															{routes.map((route) => {
																return <option value={route.id}>{route.name}</option>;
															})}
														</select>
													</div>
												)}
											</div>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-light" data-dismiss="modal">
												Close
											</button>
											<button
												type="button"
												class="btn save"
												data-dismiss="modal"
												onClick={() => {
													if (mode === "add") {
														handleSave();
													} else {
														handleSubmitEdit();
													}
												}}
											>
												Save
											</button>
										</div>
									</div>
								</div>
							</div>

							<div
								class="modal fade"
								id="memberDetailsModalCenter"
								tabindex="-1"
								role="dialog"
								aria-labelledby="memberDetailsModalCenterTitle"
								aria-hidden="true"
							>
								<div class="modal-dialog modal-dialog-centered" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												Member Details
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body row">
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="name">Name: </label>
												<span>{selectedMember.name}</span>
											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="surname">Surname: </label>
												<span>{selectedMember.surname}</span>
											</div>
											<div className="col-md-6 col-xs-12 form-field">
												<label htmlFor="email">Email: </label>
												<span>{selectedMember.email}</span>
											</div>
											<div className="col-md-12 col-xs-12 form-field row">
												<label>Permissions:</label>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-center" htmlFor="deliveryTrakr">
															Create
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canCreate"
															name="canCreate"
															disabled
															checked={selectedMember?.permissions?.canCreate}
														/>
													</span>
												</div>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-center " htmlFor="deliveryTrakr">
															Edit
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canEdit"
															name="canEdit"
															disabled
															checked={selectedMember?.permissions?.canEdit}
														/>
													</span>
												</div>
												<div
													className="col-md-6 col-xs-12 form-field"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span>
														<label className="d-flex align-items-cente delete" htmlFor="deliveryTrakr">
															Delete
														</label>
													</span>
													<span>
														<input
															type="checkbox"
															id="canDelete"
															name="canDelete"
															disabled
															checked={selectedMember?.permissions?.canDelete}
														/>
													</span>
												</div>
												{selectedMember?.isDriver && (
													<div className="form-field">
														<label htmlFor="assignedRoute">
															Assigned Route: {selectedMember.assignedRoute}
														</label>
													</div>
												)}
											</div>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-light" data-dismiss="modal">
												Close
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="row" style={{ margin: "1.5rem 0 0 0" }}>
								<table className="table table-bordered    w-100">
									<thead>
										<tr>
											<th>Name</th>
											<th>ID Photo</th>
											{/* <th>Permissions</th> */}
											<th>Is Driver</th>
											<th>Assigned Route</th>
											<th>Edit</th>
											<th>Delete</th>
										</tr>
									</thead>
									<tbody className="align-items-center">
										{members.map((member, index) => (
											<tr key={index}>
												<td
													data-toggle="modal"
													data-target="#memberDetailsModalCenter"
													onClick={() => {
														setSM(member);
													}}
													style={{ cursor: "pointer" }}
												>
													 {member.name} {member.surname}
												</td>
												
												<td
													data-toggle="modal"
													data-target="#memberDetailsModalCenter"
													onClick={() => {
														setSM(member);
													}}
													style={{ cursor: "pointer" }}
												>
													{member.idPhoto && (
														<img
														
																src={`data:image/jpeg;base64,${member.idPhoto}`} 
															
															alt="ID Photo"
														/>
													)}
												</td>
												<td
													data-toggle="modal"
													data-target="#memberDetailsModalCenter"
													onClick={() => {
														setSM(member);
													}}
													style={{ cursor: "pointer" }}
												>
													{member.isDriver ? "Yes" : "No"}
												</td>
												<td
													data-toggle="modal"
													data-target="#memberDetailsModalCenter"
													onClick={() => {
														setSM(member);
													}}
													style={{ cursor: "pointer" }}
												>
													{member.assignedRoute}
												</td>
												<td>
													<button
														className="btn update"
														onClick={() => {
															setSM(member);
															setMode("edit");
															setCM1(true);
														}}
													>
														Edit
													</button>
												</td>
												<td>
													<button
														className="btn delete"
														onClick={() => {
															setSM(member);
															setCM2(true);
														}}
													>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					{confirmationModal1 && (
						<ConfirmationModal
							action={handleEdit}
							handleClose={() => {
								setCM1(false);
							}}
							toggleId={"#memberModalCenter"}
						/>
					)}
					{confirmationModal2 && (
						<ConfirmationModal
							action={handleDelete}
							handleClose={() => {
								setSM({});
								setCM2(false);
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default CreateMember;
