import React, { useEffect, useState } from "react";
import "./Vehicles.css";
import Axios from "../../Services/axios";
import ConfirmationModal from "../../Components/confirmationModal";
import { toast } from "react-toastify";



function Vehicles() {
	const [vehicleDetails, setVD] = useState({});
	const [insurance, setInsurance] = useState({});
	const [mot, setMOT] = useState({});
	const [open, setOpen] = useState(false);
	const [viewId, setViewId] = useState("");
	const [inspectionDetails, setID] = useState({});
	const [newInspection, setNI] = useState({});
	const [modalOpen, setMO] = useState(false);
	const [enableButton, setEB] = useState(true);
	const [selectedVehicle, setSV] = useState({});
	const [confirmationModal1, setCM1] = useState(false);
	const [confirmationModal2, setCM2] = useState(false);
	const [mode, setMode] = useState("add");
	const [vehicles, setVehicles] = useState([
		{
			id: 1,
			vehicle_name: "Mehran",
			vehicle_make: "Suzuki",
			vehicle_model: "VXR",
			manufactureYear: "2019",
			vehicle_reg_no: "1221212",
			color: "gray",
			type: "car",
			owned_by: "driver",
		},
		{
			id: 2,
			vehicle_name: "Hiace",
			vehicle_make: "Toyota",
			vehicle_model: "Sonic",
			manufactureYear: "2022",
			vehicle_reg_no: "1212121",
			color: "white",
			type: "van",
			owned_by: "company",
		},
	]);

	const defaultVehicleDetails = {
		vehicle_name: "",
		vehicle_make: "",
		vehicle_model: "",
		manufactureYear: "",
		vehicle_reg_no: "",
		color: "",
		type: "",
		owned_by: "",
	};

	const defaultMOT = {
		MOT_StartDate: "",
		MOT_EndDate: "",
		MOT_ReminderDate: "",
	};

	const defaultInsurance = {
		insurance_name: "",
		cover_details: "",
		startDate: "",
		endDate: "",
		ReminderDate: "",
	};

	const handleInsuranceChange = (e) => {
		setInsurance({ ...insurance, [e.target.name]: e.target.value });
	};

	const handleMOTChange = (e) => {
		setMOT({ ...mot, [e.target.name]: e.target.value });
	};

	const handleVehicleChange = (e) => {
		setID({ ...inspectionDetails, [e.target.name]: e.target.value });
	};

	const getAllVehicles = () => {
		Axios.get("/vehicle/vehicles")
			.then((res) => {
				setVehicles(res.data);
			})
			.catch((err) => {
				console.log("Error getting vehicles...");
			});
	};

	const handleNewVehicle = () => {
		console.log("Creating new vehicle");
		Axios.post("/vehicle/createvehicle", {
			vehicle_name: vehicleDetails.vehicle_name,
			vehicle_make: vehicleDetails.vehicle_make,
			vehicle_model: vehicleDetails.vehicle_model,
			manufactureYear: vehicleDetails.manufactureYear,
			vehicle_reg_no: vehicleDetails.vehicle_reg_no,
			color: vehicleDetails.color,
			type: vehicleDetails.type,
			owned_by: vehicleDetails.owned_by,
			insurance_name: insurance.insurance_name,
			cover_details: insurance.cover_details,
			startDate: insurance.startDate,
			endDate: insurance.endDate,
			ReminderDate: insurance.reminderDate,
			MOT_StartDate: mot.startDate,
			MOT_EndDate: mot.endDate,
			MOT_ReminderDate: mot.reminderDate,
		})
			.then((res) => {
				toast.success("vehicle Created Successfully", {position: 'top-right',});
				
				setVD(defaultVehicleDetails);
				setInsurance(defaultInsurance);
				setMOT(defaultMOT);
				getAllVehicles();
			})
			.catch((err) => {
				toast.error("vehicle Creation Failed", {position: 'top-right',});
				console.log("Error Creating Vehicle");
			});
		};
		const selectEdit = (vehicle) => {
			console.log("Setting vehicle: ", vehicle);
			setVD({
				vehicle_name: vehicle.vehicle_name,
			vehicle_make: vehicle.vehicle_make,
			vehicle_model: vehicle.vehicle_model,
			manufactureYear: vehicle.manufactureYear,
			vehicle_reg_no: vehicle.vehicle_reg_no,
			color: vehicle.color,
			type: vehicle.type,
			owned_by: vehicle.owned_by,
		});
		setInsurance({
			insurance_name: vehicle.insurance_name,
			cover_details: vehicle.cover_details,
			startDate: vehicle.startDate,
			endDate: vehicle.endDate,
			ReminderDate: vehicle.ReminderDate,
		});
		setMOT({
			MOT_StartDate: vehicle.MOT_StartDate,
			MOT_EndDate: vehicle.MOT_EndDate,
			MOT_ReminderDate: vehicle.MOT_ReminderDate,
		});
	};

	const handleEditVehicle = () => {
		console.log("Editing vehicle: ", selectedVehicle);
		Axios.put("/vehicle/updatevehicle/" + selectedVehicle.id, {
			vehicle_name: vehicleDetails.vehicle_name,
			vehicle_make: vehicleDetails.vehicle_make,
			vehicle_model: vehicleDetails.vehicle_model,
			manufactureYear: vehicleDetails.manufactureYear,
			vehicle_reg_no: vehicleDetails.vehicle_reg_no,
			color: vehicleDetails.color,
			type: vehicleDetails.type,
			owned_by: vehicleDetails.owned_by,
			insurance_name: insurance.insurance_name,
			cover_details: insurance.cover_details,
			startDate: insurance.startDate,
			endDate: insurance.endDate,
			ReminderDate: insurance.reminderDate,
			MOT_StartDate: mot.startDate,
			MOT_EndDate: mot.endDate,
			MOT_ReminderDate: mot.reminderDate,
		})
		.then((res) => {
			console.log("Vehicle Creation response");
			toast.success("vehicle Edited Successfully", {position: 'top-right',});
			setMode("add");
			setSV(null);
			setVD(defaultVehicleDetails);
			setInsurance(defaultInsurance);
			setMOT(defaultMOT);
			getAllVehicles();
		})
			.catch((err) => {
				toast.error("vehicle Editing Failed", {position: 'top-right',});
				console.log("Error Creating Vehicle");
			});
		};
		
		const handleDeleteVehicle = () => {
			Axios.delete("/vehicle/deletevehicle/" + selectedVehicle.id)
			.then((res) => {
				getAllVehicles();
				toast.success("vehicle Deleted Successfully", {position: 'top-right',});
			})
			.catch((err) => {
				console.log(err);
				toast.error("vehicle Deletion Failed", {position: 'top-right',});
				getAllVehicles();
			});
	};

	const handleChange = (e) => {
		setVD({ ...vehicleDetails, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		console.log("Fetching Vehicles...");
		getAllVehicles();
	}, []);

	useEffect(() => {
		if (
			vehicleDetails.vehicle_name &&
			vehicleDetails.vehicle_make &&
			vehicleDetails.vehicle_model &&
			vehicleDetails.manufactureYear &&
			vehicleDetails.vehicle_reg_no &&
			vehicleDetails.color &&
			vehicleDetails.type &&
			vehicleDetails.owned_by
		) {
			if (
				insurance.insurance_name &&
				insurance.cover_details &&
				insurance.startDate &&
				insurance.endDate &&
				insurance.reminderDate
			) {
				if (mot.startDate && mot.endDate && mot.reminderDate) {
					if (inspectionDetails.date && inspectionDetails.week && inspectionDetails.reminder) {
						setEB(true);
					}
				}
			}
		}
	}, [vehicleDetails, insurance, mot, inspectionDetails]);

	return (

	<>	
		<div className="main-wrapper">
			<div className="container-fluid">
				<div className="card">
					<div className="card-body">
						<div className="page-container">
							{/* <div className="page-heading">Vehicles</div> */}
							<div className="col-xs-12 col-md-12">
								<button
									className="btn add"
									data-toggle="modal"
									data-target="#vehicleModalCenter"
									style={{ margin: "0 0.5rem" }}
								>
									Add Vehicle
								</button>
							</div>
							<div className="vehicle-form-container">
								<div
									class="modal fade"
									id="vehicleModalCenter"
									tabindex="-1"
									role="dialog"
									aria-labelledby="vehicleModalCenterTitle"
									aria-hidden="true"
								>
									<div class="modal-dialog modal-dialog-centered" role="document">
										<div class="modal-content" style={{ minWidth: "750px" }}>
											<div class="modal-header">
												<h5 class="modal-title" id="exampleModalLongTitle">
													Create a vehicle
												</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body modal-scroll">
												<div className="row">
													<div className="col-md-6 col-xs-12 form-field">
														<label>Vehicle Name:</label>
														<input
															type="string"
															name="vehicle_name"
															required
															value={vehicleDetails.vehicle_name}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Make:</label>
														<input
															type="string"
															name="vehicle_make"
															required
															value={vehicleDetails.vehicle_make}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Model:</label>
														<input
															type="string"
															name="vehicle_model"
															required
															value={vehicleDetails.vehicle_model}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Manufacture Year:</label>
														<input
															type="string"
															name="manufactureYear"
															required
															value={vehicleDetails.manufactureYear}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Vehicle Reg No:</label>
														<input
															type="string"
															name="vehicle_reg_no"
															required
															value={vehicleDetails.vehicle_reg_no}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Color:</label>
														<input
															type="string"
															name="color"
															required
															value={vehicleDetails.color}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Type:</label>
														<select
															name="type"
															value={vehicleDetails.type}
															onChange={handleChange}
															required
															style={{ padding: "0.5rem", width: "80%" }}
														>
															<option value="">Select Vehicle Type</option>
															<option value="car">Car</option>
															<option value="bike">Bike</option>
															<option value="van">Van</option>
														</select>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Owned By:</label>
														<select
															name="owned_by"
															value={vehicleDetails.owned_by}
															onChange={handleChange}
															required
															style={{ padding: "0.5rem", width: "80%" }}
														>
															<option value="">Select Owner Type</option>
															<option value="driver">Driver</option>
															<option value="company">Company</option>
														</select>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Vehicle Image:</label>
														<input
															type="file"
															name="image"
															value={vehicleDetails.image}
															onChange={handleChange}
														/>
													</div>
												</div>
												<div className="row">
													<h4 className="page-heading">Insurance Details</h4>
													<div className="vehicle-form-container row">
														<div className="col-md-6 col-xs-12 form-field">
															<label>Provider Name:</label>
															<input
																type="string"
																name="insurance_name"
																required
																value={insurance.insurance_name}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Cover Details:</label>
															<input
																type="string"
																name="cover_details"
																required
																value={insurance.cover_details}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Start Date:</label>
															<input
																type="date"
																name="startDate"
																required
																value={insurance.startDate}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>End Date:</label>
															<input
																type="date"
																name="endDate"
																required
																value={insurance.endDate}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Reminder Date:</label>
															<input
																type="date"
																name="ReminderDate"
																required
																value={insurance.ReminderDate}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Insurance Copy:</label>
															<input
																type="file"
																name="insuranceCopy"
																value={insurance.insuranceCopy}
																onChange={handleInsuranceChange}
															/>
														</div>
													</div>
												</div>
												<div className="row">
													<div className="col-md-12 col-xs-12 row">
														<h4 className="page-heading">MOT Details</h4>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Start Date:</label>
															<input
																type="date"
																name="MOT_StartDate"
																required
																value={mot.MOT_StartDate}
																onChange={handleMOTChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>End Date:</label>
															<input
																type="date"
																name="MOT_EndDate"
																required
																value={mot.MOT_EndDate}
																onChange={handleMOTChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Reminder Date:</label>
															<input
																type="date"
																name="MOT_ReminderDate"
																required
																value={mot.MOT_ReminderDate}
																onChange={handleMOTChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Insurance Copy:</label>
															<input
																type="file"
																name="insuranceCopy"
																value={mot.insuranceCopy}
																onChange={handleMOTChange}
															/>
														</div>
													</div>
												</div>
											</div>
											<div class="modal-footer">
												<button
													type="button"
													class="btn btn-light"
													data-dismiss="modal"
													onClick={() => {
														setVD(defaultVehicleDetails);
														setInsurance(defaultInsurance);
														setMOT(defaultMOT);
													}}
												>
													Close
												</button>
												<button
													type="button"
													class="btn save"
													data-dismiss="modal"
													onClick={() => {
														console.log("Mode: ", mode);
														mode === "add" ? handleNewVehicle() : handleEditVehicle();
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
									id="vehicleDetailsModalCenter"
									tabindex="-1"
									role="dialog"
									aria-labelledby="vehicleDetailsModalCenterTitle"
									aria-hidden="true"
								>
									<div class="modal-dialog modal-dialog-centered" role="document">
										<div class="modal-content" style={{ minWidth: "750px" }}>
											<div class="modal-header">
												<h5 class="modal-title" id="exampleModalLongTitle">
													Vehicle Details
												</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body modal-scroll">
												<div className="row">
													<div className="col-md-6 col-xs-12 form-field">
														<label>Vehicle Name:</label>
														<input
															type="string"
															name="vehicle_name"
															disabled
															value={vehicleDetails.vehicle_name}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Make:</label>
														<input
															type="string"
															name="vehicle_make"
															disabled
															value={vehicleDetails.vehicle_make}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Model:</label>
														<input
															type="string"
															name="vehicle_model"
															disabled
															value={vehicleDetails.vehicle_model}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Manufacture Year:</label>
														<input
															type="string"
															name="manufactureYear"
															disabled
															value={vehicleDetails.manufactureYear}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Vehicle Reg No:</label>
														<input
															type="string"
															name="vehicle_reg_no"
															disabled
															value={vehicleDetails.vehicle_reg_no}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Color:</label>
														<input
															type="string"
															name="color"
															disabled
															value={vehicleDetails.color}
															onChange={handleChange}
														/>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Type:</label>
														<select
															name="type"
															value={vehicleDetails.type}
															onChange={handleChange}
															disabled
															style={{ padding: "0.5rem", width: "80%" }}
														>
															<option value="">Select Vehicle Type</option>
															<option value="car">Car</option>
															<option value="bike">Bike</option>
															<option value="van">Van</option>
														</select>
													</div>
													<div className="col-md-6 col-xs-12 form-field">
														<label>Owned By:</label>
														<select
															name="owned_by"
															value={vehicleDetails.owned_by}
															onChange={handleChange}
															disabled
															style={{ padding: "0.5rem", width: "80%" }}
														>
															<option value="">Select Owner Type</option>
															<option value="driver">Driver</option>
															<option value="company">Company</option>
														</select>
													</div>
												</div>
												<div className="row">
													<h4 className="page-heading">Insurance Details</h4>
													<div className="vehicle-form-container row">
														<div className="col-md-6 col-xs-12 form-field">
															<label>Provider Name:</label>
															<input
																type="string"
																name="insurance_name"
																disabled
																value={insurance.insurance_name}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Cover Details:</label>
															<input
																type="string"
																name="cover_details"
																disabled
																value={insurance.cover_details}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Start Date:</label>
															<input
																type="date"
																name="startDate"
																disabled
																value={insurance.startDate}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>End Date:</label>
															<input
																type="date"
																name="endDate"
																disabled
																value={insurance.endDate}
																onChange={handleInsuranceChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Reminder Date:</label>
															<input
																type="date"
																name="ReminderDate"
																disabled
																value={insurance.ReminderDate}
																onChange={handleInsuranceChange}
															/>
														</div>
													</div>
												</div>
												<div className="row">
													<div className="col-md-12 col-xs-12 row">
														<h4  className="page-heading">MOT Details</h4>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Start Date:</label>
															<input
																type="date"
																name="MOT_StartDate"
																disabled
																value={mot.MOT_StartDate}
																onChange={handleMOTChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>End Date:</label>
															<input
																type="date"
																name="MOT_EndDate"
																disabled
																value={mot.MOT_EndDate}
																onChange={handleMOTChange}
															/>
														</div>
														<div className="col-md-6 col-xs-12 form-field">
															<label>Reminder Date:</label>
															<input
																type="date"
																name="MOT_ReminderDate"
																disabled
																value={mot.MOT_ReminderDate}
																onChange={handleMOTChange}
															/>
														</div>
													</div>
												</div>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-dark" data-dismiss="modal">
													Close
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="table-container">
									<table className="w-100 table-bordered table">
										<thead>
											<tr>
												<th>Vehicle Name</th>
												<th>Make</th>
												<th>Model</th>
												<th>Manufactured</th>
												<th>Reg No.</th>
												<th>Colour</th>
												<th>Type</th>
												<th>Owned By</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{vehicles.map((vehicle) => (
												<tr key={vehicle.id}>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.vehicle_name}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.vehicle_make}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.vehicle_model}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.manufactureYear}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.vehicle_reg_no}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.color}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.type}
													</td>
													<td
														// data-toggle="modal"
														// data-target="#vehicleDetailsModalCenter"
														// style={{ cursor: "pointer" }}
														// onClick={() => {
														// 	setSV(vehicle);
														// }}
													>
														{vehicle.owned_by}
													</td>
													<td>

														<span style={{ display: "flex", alignItems: "center" }}>
														<button
                              className="btn btn-sm  view    me-1 "
                              data-toggle="modal"
                              data-target="#ViewPatientModalCenter"
                              onClick={() => {
                                setOpen(true);
                                setViewId(vehicle.id);
                              }}
                            >
                              
                              
                              <span>View</span>{" "}
                            </button>

															<button
																className="btn btn-sm update"
																style={{ marginRight: "0.5rem" }}
																onClick={() => {
																	setMode("edit");
																	selectEdit(vehicle);
																	setSV(vehicle);
																	setCM1(true);
																}}
															>
																Edit
															</button>
															<button
																className="btn btn-sm delete"
																onClick={() => {
																	setCM2(true);
																	setSV(vehicle);
																}}
															>
																Delete
															</button>
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
							{modalOpen ? (
								<div
									style={{
										position: "fixed",
										bottom: 0,
										right: 0,
										width: "calc(100vw - 250px)",
										height: "100vh",
										backgroundColor: "rgb(0, 0, 0, 0.4)",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<div
										style={{
											width: "400px",
											height: "auto",
											padding: "1rem",
											backgroundColor: "white",
											borderRadius: "10px",
										}}
									>
										<h4 className="page-heading">Add Inspection Details</h4>
										<form className="row">
											<div className="col-xs-12" style={{ marginBottom: "0.5rem" }}>
												<label>Type:</label>
												<select
													name="type"
													value={newInspection.type}
													onChange={handleVehicleChange}
													required
													style={{ padding: "0.5rem", width: "80%" }}
												>
													<option value="">Select Type</option>
													<option value="service">Service</option>
													<option value="repair">Repair</option>
												</select>
											</div>
											<div className="col-xs-12" style={{ marginBottom: "0.5rem" }}>
												<label>Amount Spent:</label>
												<input
													type="string"
													name="amount"
													required
													value={newInspection.amount}
													onChange={handleVehicleChange}
												/>
											</div>
											<div className="col-xs-12" style={{ marginBottom: "1rem" }}>
												<label>Invoice:</label>
												<input
													type="file"
													name="invoice"
													value={newInspection.invoice}
													onChange={handleMOTChange}
												/>
											</div>
											<div
												className="col-xs-12"
												style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
											>
												<button
													className="btn btn-primary"
													style={{ marginRight: "0.5rem" }}
													type="submit"
												>
													Add Inspection
												</button>
												<button
													className="btn btn-secondary"
													// style={{ marginRight: "0.5rem" }}
													onClick={() => {
														setMO(false);
													}}
												>
													Cancel
												</button>
											</div>
										</form>
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				{confirmationModal1 && (
					<ConfirmationModal
						action={() => {}}
						handleClose={() => {
							setCM1(false);
						}}
						toggleId={"#vehicleModalCenter"}
					/>
				)}
				{confirmationModal2 && (
					<ConfirmationModal
						action={handleDeleteVehicle}
						handleClose={() => {
							setSV({});
							setCM2(false);
						}}
					/>
				)}
			</div>
		</div>
        

		<div
        class="modal fade"
        id="ViewPatientModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="patientModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" style={{ minWidth: "800px" }}>
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Vehicle Details
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" >
              <div className="row">
                <div className="col-md-6"></div>
                {vehicles
                  .filter((patient) => {
                    if (patient.id === viewId) {
                      return patient;
                    }
                  })

                  .map((vehicle) => (
                    <>
                         <h3 className="heading-color">Vehicle Information</h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1 ">
                           
                          <span className="fw-bold">Vehicle Name:</span>{" "}
						  {vehicle.vehicle_name}
                          
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Vehicle make: </span>{" "}
                           {vehicle.vehicle_make}
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Vehicle model: </span>{" "}
						  {vehicle.vehicle_model}
                    
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Manfacturer Year :</span>{" "}
						  {vehicle.manufactureYear}
                        
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Vehicle Registration Number: </span>{" "}
						  {vehicle.vehicle_reg_no}
                        
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Color: </span>{" "}
						  {vehicle.color}
                          
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Type: </span>{" "}
                          {vehicle.type}
                        </div>
                         
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">Owned By: </span>{" "}
						  {vehicle.owned_by}
                        
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">Insurance Name: </span>{" "}
                          {vehicle.insurance_name}
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">Cover Details: </span>{" "}
                           {vehicle.cover_details}
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">Start Date: </span>{" "}
                          {vehicle.startDate}
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">End date: </span>{" "}
						  {vehicle.endDate}
                        
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">Reminder date: </span>{" "}
                           {vehicle.ReminderDate}
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">MOT Start date: </span>{" "}
                         {vehicle.MOT_StartDate}
                        </div>
						<div className="col-md-6 mt-1">
                          <span className="fw-bold">MOT End date: </span>{" "}
                          {vehicle.MOT_EndDate}
                        </div>

						<div className="col-md-6 mt-1">
                          <span className="fw-bold">MOT Reminder date: </span>{" "}
                          {vehicle.MOT_ReminderDate}
                        </div>
                      </div>
                     
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
	</>	


	);
}
export default Vehicles;
