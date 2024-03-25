import React, { useState, useEffect } from "react";
import "./Collection.css";
import Axios from "../../Services/axios";
import { DateTimeFormat } from 'intl';
import { toast } from 'react-toastify';

function Collection() {
	const [patients, setPatients] = useState([]);
	const [searchPatient, setSP] = useState("");
	const [newCollection, setNC] = useState({});
	const [shelves, setShelves] = useState([]);
	const [selectedPatient, setSelP] = useState({});
	const [isTableOpen, setIsTableOpen] = useState(true); // Add a state variable to track table open/close

	useEffect(() => {
		getPatients();
		getShelves();
	}, []);

	const toggleTable = () => {
		setIsTableOpen(!isTableOpen);
	};

	const getShelves = () => {
		Axios.get("/shelves/getShelves")
			.then((res) => {
				  setShelves(res.data);
			})
			.catch((err) => {
				console.log("Error");
			});
	};

	const getPatients = () => {
		Axios.get("/collection/collectionPatients")
			.then((res) => {
				const updatedPatients = res.data.map((patient) => {
					const date = new Date(patient.dateOfBirth);
					const formattedDateOfBirth = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
					return {
					  ...patient,
					  dateOfBirth: formattedDateOfBirth,
					};
				});
				setPatients(updatedPatients);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleAddCollection = () => {
		Axios.post("/shelves/AssignShelf", {
			patientId: selectedPatient.id,
			capacity: newCollection.capacity,
		})
		.then((res) => {
			toast.success(res.data.message, { position: 'top-right' });
			getPatients();
			getShelves();
		})
		.catch((err) => {
			if (err.response && err.response.data && err.response.data.error) {
				toast.error(err.response.data.error, { position: 'top-right' });
			} else {
				toast.error("An error occurred while assigning the shelf.", { position: 'top-right' });
			}
			console.log("Error: ", err);
		});
	};


	return (
		<div className="main-wrapper">
			<div className="container-fluid">
				<div className="card">
				<div className="row d-flex justify-content-between">
						<div className="page-heading col-md-4">Rx Storage</div>
						<div className="col-md-8">
							<div className="col-xs-12">
								{/* Button to toggle the first table */}
								<button onClick={toggleTable} className="btn ms-1">
									{isTableOpen ? "Close Table" : "Open Table"}
								</button>
							</div>
							{isTableOpen && (
								<div className="col-xs-12">
									<table className="table table-bordered w-100">
										<thead>
											<tr>
												<th>Name</th>
												<th>Package Capacity</th>
												<th>Occupied</th>
												<th>Remaining</th>
												<th>Package size</th>
											</tr>
										</thead>
										<tbody>
											{shelves.map((shelf) => (
												<tr>
													<td>{shelf.name}</td>
													<td>{shelf.Packages_capacity}</td>
													<td>{shelf.occupied_capacity}</td>
													<td>{shelf.remaining_capacity}</td>
													<td>{shelf?.capacity}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
					<div className="row">
						<div className="col-md-3 col-xs-12  d-flex   form-field">
							<input
								type="text"
								value={searchPatient}
								placeholder="Search"

								onChange={(e) => {
									setSP(e.target.value);
								}}
							/>
						
							<button style={{ width: "auto" }} className="btn ms-1 add">
								SEARCH
							</button>
						</div>
						<div className="col-xs-12 form-field">
							<table className="w-100 table-bordered table mt-2">
								<thead>
									<tr>
										<th>Name</th>
										<th>NHS</th>
										<th>DOB</th>
										<th>Phone</th>
										<th>Address</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{patients
										      .filter(
												(patient) =>
												  patient.firstName
													.toLowerCase()
													.includes(searchPatient.toLowerCase()) ||
												  patient.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
												  patient.addressLine1.toLowerCase().includes(searchPatient.toLowerCase()) || 
												  patient.nhsNumber.toLowerCase().includes(searchPatient.toLowerCase())
												   
										
											  )
										.map((patient) => (
											<>
												<tr key={patient.id}>
													<td>{patient?.firstName + " " + patient?.lastName}</td>
													<td>{patient.nhsNumber}</td>
													<td>{patient.dateOfBirth}</td>
													<td>{patient.mobileNo}</td>
													<td>{patient.addressLine1}</td>
													<td>
														<button
															className="btn btn-sm add"
															data-toggle="modal"
															data-target="#collectionModalCenter"
															onClick={() => {
																setSelP(patient);
															}}
														>
															Add Collection
														</button>
													</td>
												</tr>
											</>
										))}
								</tbody>
							</table>
							<div
								class="modal fade"
								id="collectionModalCenter"
								tabindex="-1"
								role="dialog"
								aria-labelledby="collectionModalCenterTitle"
								aria-hidden="true"
							>
								<div class="modal-dialog modal-dialog-centered" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLongTitle">
												Asign shelf a collection
											</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
											<div className="row">
												<div className="col-md-6 col-xs-12 form-field">
													<label>Package Size:</label>
													<select
														name="capacity"
														value={newCollection.capacity}
														required
														onChange={(e) => {
															setNC({
																...newCollection,
																capacity: e.target.value,
															});
														}}
													>
														<option value="">Select Size</option>
														<option value="Very Small">Very Small</option>
														<option value="Small">Small</option>
														<option value="Medium">Medium</option>
														<option value="Large">Large</option>
														<option value="Very Large">Very Large</option>
														<option value="Owings">Owings</option>
														<option value="Fridge">Fridge</option>
														<option value="CD">CD</option>
														<option value="CD+fridge">CD+fridge</option>
													</select>
												</div>
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
													handleAddCollection();
												}}
											>
												Save
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Collection;
