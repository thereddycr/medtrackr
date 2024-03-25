import React, { useEffect, useState } from "react";
import "./Handouts.css";
import Axios from "../../Services/axios";
import { toast } from "react-toastify";

function Handouts() {
	const [collections, setCollections] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const [patient, setPatient] = useState(null);

	const [showModal, setSM] = useState(false);
	const [collectedName, setCollectedName] = useState("");
	const [collectionDetails, setCD] = useState({});

	const getCollections = () => {
		Axios.get("/collection/getCollection")
			.then((res) => {            
				setCollections(res.data);
			})
			.catch((err) => {
				console.log("Error getting collections: ", err);
				// setCollections(samplePatients);
			});
	};
	const getPatients = () => {
		Axios.get("/patient/getPatient")
			.then((res) => {            
				setPatient(res.data);
			})
			.catch((err) => {
				console.log("Error getting collections: ", err);
				// setCollections(samplePatients);
			});
	};
	const handleCollectedNameChange = (event) => {
		setCollectedName(event.target.value);
	  };
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};
	const handleCollected = (collection) => {
		setSM(true);
		setCD(collection);
	  };
	  const markAsCollected = () => {
	
		Axios.post("/collection/markAsDone", {
		  CollectionId: collectionDetails.id,
		  CollectedName: collectedName,
		})
		  .then((res) => {
			toast.success(res.data.message, {position: 'top-right',});
			setCD({});
			setSM(false);
			getCollections();
			setCollectedName("");
		  })
		  .catch((err) => {
			console.log("Error: ", err);
		  });
	  };

	// Filter patients based on search query
	const filteredPatients = collections.filter((collection) => {
		if(collection){
			console.log(collection)
			let isSearchMatched = 
			collection?.Patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			collection?.Patient?.middleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			collection?.Patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())  || 
			collection?.Patient?.addressLine1?.toLowerCase().includes(searchQuery.toLowerCase()) || 
			collection?.Patient?.nhsNumber?.toLowerCase().includes(searchQuery.toLowerCase())
			return isSearchMatched;
		}
	});
	const filteredPatient = patient?.filter((Patient) => {
		if(Patient){
			console.log(Patient)
			let isSearchMatched = 
			Patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			Patient?.middleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			Patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())  || 
			Patient?.addressLine1?.toLowerCase().includes(searchQuery.toLowerCase()) || 
			Patient?.nhsNumber?.toLowerCase().includes(searchQuery.toLowerCase())
			return isSearchMatched;
		}
	});

	useEffect(() => {
		getCollections();
		getPatients();
	}, []);
	const formatDate = (dateString) => {
		if (dateString == null) {
		  return dateString;
		}
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
		  year: "numeric",
		  month: "long",
		  day: "numeric",
		});
	  };
	  const formatDateTime = (dateTimeString) => {
		if (dateTimeString == null) {
		  return dateTimeString;
		}
		const dateTime = new Date(dateTimeString);
		return dateTime.toLocaleString("en-US", {
		  year: "numeric",
		  month: "long",
		  day: "numeric",
		  hour: "numeric",
		  minute: "numeric",
		  second: "numeric",
		});
	  };
	  
	return (
		<>
			<div className="main-wrapper">
				<div className="container-fluid">
					<div className="card">
						<div className="container">
							<div className="page-heading">Handouts</div>
							<div className="row mt-4">
								<div className="col-md-4">
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											placeholder="Search"
											value={searchQuery}
											onChange={handleSearchChange}
										/>
										<button className="btn add" onClick={() => setSearchQuery("")}>
											Search
										</button>
									</div>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-xs-12">
									<table className="table table-bordered w-100">
										<thead>
											<tr>
												<th>Name</th>
												<th>NHS Number</th>
												<th>DOB</th>
												<th>Address</th>
												<th>Shelf Name/Number</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{filteredPatients?.length > 0 ? (
												filteredPatients.map((patient, index) => (
												<tr key={index}>
													<td>
													{patient.Patient.title + " " +
														patient.Patient.lastName +
														" " +
														(patient.Patient.firstName ? patient.Patient.firstName : "") +
														" " +
														(patient.Patient.middleName ? patient.Patient.middleName : "")}
													</td>
													<td>{patient.Patient.nhsNumber}</td>
													<td>{formatDate(patient.Patient.dateOfBirth)}</td>
													<td>{patient.Patient.addressLine1}</td>
													<td>{`The Package is in ${patient.shelfInfo?.name ?patient.shelfInfo?.name:'Shelve Modified'}`}</td>
													<td>
													{patient.Status === "Collected" ? (
														<div>
													    <span>Collected on {formatDateTime(patient.CollectedDate)}</span>
														{patient.CollectedName ? (
															<span>
																<br />
																Collected By {patient.CollectedName}
															</span>
															) : (
															<span>
																<br />
																Collected By {patient.Patient.title + " " +
														patient.Patient.lastName +
														" " +
														(patient.Patient.firstName ? patient.Patient.firstName : "") +
														" " +
														(patient.Patient.middleName ? patient.Patient.middleName : "")}
															</span>
															)}
														</div>
														) : (
														<button
														className="btn btn-sm add"
														onClick={() => {
															handleCollected(patient);
														}}
														>
														Mark as collected
														</button>
													)}
													</td>
												</tr>
												))
											) : (
												// Render something when filteredPatients is empty
												filteredPatient?.length > 0 ? (
												filteredPatient.map((patient, index) => (
													<tr key={index}>
													<td>
														{patient.title +
														patient.lastName +
														" " +
														(patient.firstName ? patient.firstName : "") +
														" " +
														(patient.middleName ? patient.middleName : "")}
													</td>
													<td>{patient.nhsNumber}</td>
													<td>{formatDate(patient.dateOfBirth)}</td>
													<td>{patient.addressLine1}</td>
													<td>No Collection Against this Patient...</td>
													<td>Not Stored</td>
													</tr>
												))
												) : (
												// Render something when filteredPatient is also empty
												<tr>
													<td colSpan="6">No patients to display</td>
												</tr>
												)
											)}
											</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				{showModal ? (
					<div
						className="custom-modal"
						style={{
							transition: "ease",
							position: "fixed",
							bottom: 0,
							right: 0,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100vh",
							width: "calc(100vw - 250px)",
							backgroundColor: "rgb(0, 0, 0, 0.25)",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								minWidth: "350px",
								height: "auto",
								backgroundColor: "white",
								borderRadius: "5px",
								padding: "1rem",
							}}
						>

							<div className="d-flex align-items-center justify-content-between mb-3">
							<h4 className="mb-0">Collected By</h4>
							<div className="d-flex align-items-center">
							<h5 className="mb-0 me-2">Patient</h5>
							<input
							type="radio"
							onClick={() => {
								markAsCollected();
							}}
							/>
							</div>
							</div>
							<div>
								<input
									type="text"
									placeholder="Enter Collected Name"
									value={collectedName}
									onChange={handleCollectedNameChange}
								/>
								</div>
							<span style={{ padding: "1rem 0 0 0" }} className="text-center">
								<button
									className="btn btn-primary me-2"
									style={{ width: "100px" }}
									onClick={() => {
										markAsCollected();
									}}
								>
									Done
								</button>
								<button
									className="btn btn-dark"
									style={{ width: "100px" }}
									onClick={() => {
										setSM(false);
									}}
								>
									Close
								</button>
							</span>
						</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</>
	);
}

export default Handouts;
