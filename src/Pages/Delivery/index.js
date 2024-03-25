import React, { useEffect, useState } from "react";
import "./Delivery.css";
import { Link } from "react-router-dom";

function Delivery() {
	const dummyData = [
		{
			serialNo: 1,
			patientDetails: "John Doe",
			address: "123 Main St",
			noOfBags: 2,
			fridge: true,
			cd: false,
			otc: "Some OTC medication",
			notes: "Some notes",
			priceToPay: "$50",
		},
		{
			serialNo: 2,
			patientDetails: "Jane Smith",
			address: "456 Elm St",
			noOfBags: 3,
			fridge: false,
			cd: true,
			otc: "Some other OTC medication",
			notes: "Some other notes",
			priceToPay: "$75",
		},
		{
			serialNo: 3,
			patientDetails: "Bob Johnson",
			address: "789 Oak St",
			noOfBags: 1,
			fridge: true,
			cd: true,
			otc: "Yet another OTC medication",
			notes: "Additional notes",
			priceToPay: "$30",
		},
		{
			serialNo: 4,
			patientDetails: "Alice Williams",
			address: "987 Pine St",
			noOfBags: 4,
			fridge: false,
			cd: false,
			otc: "Some more OTC medication",
			notes: "More notes",
			priceToPay: "$60",
		},
	];

	return (
		<>
			{/* <QRScanner /> */}
			<div className="main-wrapper">
				<div className="container-fluid">
					<div className="card">
						<div className="card-body">
							<div className="container-fluid">
								<div className="w-100 text-center">
									<h1>Delivery Managment Portal</h1>
								</div>
								<div className=" w-100 text-center">
									<button className="report-button delivery-btn p-md-3 ms-2 me-2">Reports</button>

									<button className="patient-button delivery-btn p-md-3 ms-2 me-2">
										<Link to="/delivery">Patient</Link>
									</button>

									<button className="staff-button delivery-btn p-md-3 ms-2 me-2">Staff</button>
									<button className="track-button delivery-btn p-md-3 ms-2 me-2">Track</button>
									<button className="routes-button delivery-btn p-md-3 ms-2 me-2">Routes</button>
									<button className="deli-button delivery-btn p-md-3 ms-2 me-2">
										Delivery Managment
									</button>
								</div>
								<div className="qr-container mt-md-4">
									<div className="col-md-4"></div>
								</div>
								<div className="table-container mt-md-4">
									<table className="table table-bordered">
										<thead>
											<tr>
												<th>Serial No</th>
												<th>Patient Details</th>
												<th>Address</th>
												<th>No of Bags</th>
												<th>Fridge</th>
												<th>CD</th>
												<th>OTC</th>
												<th>Notes</th>
												<th>Price to Pay</th>
											</tr>
										</thead>
										<tbody>
											{dummyData.map((item, index) => (
												<tr key={index}>
													<td>{item.serialNo}</td>
													<td>{item.patientDetails}</td>
													<td>{item.address}</td>
													<td>{item.noOfBags}</td>
													<td>{item.fridge ? "Yes" : "No"}</td>
													<td>{item.cd ? "Yes" : "No"}</td>
													<td>{item.otc}</td>
													<td>{item.notes}</td>
													<td>{item.priceToPay}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Delivery;
