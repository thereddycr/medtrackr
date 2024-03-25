import React, { useEffect, useState } from "react";
import "./Deliveryhistory.css";
import Axios from "../../Services/axios";

const dummyData = [
  // ... Your dummy data ...
];

function DeliveryHistory() {
	const [searchQuery, setSearchQuery] = useState("");
  const [filterRoute, setFilterRoute] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryReport, setDeliveryReport] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [clickedImage, setClickedImage] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedRowDetails, setSelectedRowDetails] = useState(null);

  const [showModal, setSM] = useState(false);

  const [routes, setRoutes] = useState([]);

  const [drivers, setDrivers] = useState([]);
  const handleRowClick = (data) => {
    setSelectedRowDetails(data);
  };

  const handleImageClick = (base64Image) => {
    setClickedImage(base64Image);
  };

  const handleStatusChange = (selectedStatus) => {
    setFilterStatus(selectedStatus);
  };

  const getDeliveries = () => {
    Axios.get("/delivery/delivery")
      .then((res) => {
        setDeliveries(res.data);
      })
      .catch((err) => {
        console.log("Error getting deliveries: ", err);
        setDeliveries(dummyData);
      });
  };

  const fetchDeliveryReportImages = (deliveryId) => {
    Axios.get(`/routes/getDeliveryReport/${deliveryId}`)
      .then((res) => {
        setDeliveryReport(res.data.deliveryReport);
      })
      .catch((err) => {
        console.error("Error getting delivery report: ", err);
      });
  };

  const handleViewButtonClick = (deliveryId) => {
    setSM(!showModal);
    fetchDeliveryReportImages(deliveryId);
  };

  const getRoutes = () => {
    Axios.get("/routes/routes")
      .then((res) => {
        setRoutes(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const getDrivers = () => {
    Axios.get("/users/getDrivers")
      .then((res) => {
        setDrivers(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  function formatTime(isoString) {
    const dateObject = new Date(isoString);
    if (isNaN(dateObject.getTime())) {
      // Handle invalid date string
      return 'Invalid Date';
    }
    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    getRoutes();
    getDrivers();
    getDeliveries();
  }, []);

  useEffect(() => {
	const filteredData = deliveries.filter((delivery) => {
	  const routeMatch = !filterRoute || delivery.routeId === parseInt(filterRoute);
	  const driverMatch = !filterDriver || routes.find((route) => route.assignedDriverId === parseInt(filterDriver));
	  const statusMatch = !filterStatus || delivery.status === filterStatus;
	  const dateRangeMatch =
		(!startDate || new Date(delivery.deliveryDate) >= new Date(startDate)) &&
		(!endDate || new Date(delivery.deliveryDate) <= new Date(endDate));
	  const searchQueryMatch =
		delivery.id.toString().includes(searchQuery) ||
		(delivery.Patient?.firstName.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
		(delivery.Patient?.lastName.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
		(delivery.Patient?.displayName.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
		(delivery.Patient?.nhsNumber.toLowerCase() || "").includes(searchQuery.toLowerCase())
  
	  return routeMatch && driverMatch && statusMatch && dateRangeMatch && searchQueryMatch;
	});
  
	setFilteredData(filteredData);
  }, [deliveries, filterRoute, filterDriver, filterStatus, startDate, endDate, searchQuery]);


	return (
		<div className="main-wrapper">
			<div className="container-fluid">
				<div className="card">
					<div className="card-body">
						<div className="page-holder">
							<div className="page-heading">Delivery History</div>
							<div className="filters row" style={{ display: "flex", alignItems: "center" }}>
							<span className="col-md-2 col-xs-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </span>
								<span className="col-md-1 me-5 col-xs-4 ">
									<select
										value={filterRoute}
										onChange={(e) => {
											console.log("Value: ", e.target.value);
                                            
                                            setFilterRoute(e.target.value)
											var filteredrec = deliveries.filter(
												(delivery) => delivery.routeId === parseInt(e.target.value)
											);
											console.log("Records: ", filteredrec);
											setFilteredData(filteredrec);
										}}
									>
										<option value="">Select Route</option>
										{routes.map((route) => {
											return <option value={route.id}>{route.name}</option>;
										})}
									</select>
								</span>
								<span className="col-md-1 me-5 ms-2	col-xs-4">
									<select
										value={filterDriver}
										onChange={(e) => {
											const driver = drivers.filter(
												(driver) => driver.id === parseInt(e.target.value)
											)[0];

											setFilterDriver(e.target.value)
											console.log("Driver: ", driver);
											if (driver) {
												var filteredrec = deliveries.filter(
													(delivery) => delivery.routeId === parseInt(driver.assignedRoute)
												);
												setFilteredData(filteredrec);
											}
										}}
									>
										
										<option value="">Select Driver</option>
										{drivers.map((driver) => {
											return (
												<option value={driver.id}>{driver.name + " " + driver.surname}</option>
											);
										})}
									</select>
								</span>
								<span className="col-md-1 me-4 col-xs-4">
									<select value={filterStatus} onChange={(e) => handleStatusChange(e.target.value)}>
										<option value="">Select Status</option>
										<option value="COMPLETED">Completed</option>
										<option value="OUTFORDELIVERY">Out for delivery</option>
										<option value="READY">Ready</option>
										<option value="CANCELLED">Cancelled</option>
										<option value="FAILED">Failed</option>

										{/* Add options for Status */}
									</select>
								</span>
								<div className="col-md-6 d-flex col-xs-10 ms-auto">
								<div className="col-md-6 col-xs-6 me-2">
								<label>Start Date</label>
								<input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									placeholder="Start Date"
								/>
								</div>
								<div className="col-md-6 col-xs-6">
								<label>End Date</label>
								<input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									placeholder="End Date"
								/>
								</div>
								</div>
							</div>
							{/* Display the filtered data in a table */}
							<div className="table-container">
								<div className="page-heading">Orders</div>
								<table className="table w-100 table-bordered" style={{ marginTop: "1rem" }}>
									<thead>
										<tr>
											<th>Order ID</th>
											<th>Patient Details</th>
											<th>Order Details</th>
											<th>Status</th>
											<th>Past Delivery History</th>
											<th>View Delivery Details</th>
										</tr>
									</thead>
									<tbody>
										{filteredData.map((data, index) => (
											<tr key={index} onClick={() => handleRowClick(data)}>
												<td>{data.id}</td>
												<td>{data.Patient?.displayName}</td>
												<td>{data.deliveryType}</td>
												<td>{data?.status}</td>
												<td>
													{/* Display Past Delivery History */}
													{/* Add any relevant information */}
												</td>
												<td>
													<button
														type="button"
														class="btn btn-sm btn-light view"
														onClick={() => handleViewButtonClick(data.id)}
													>
														View
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								
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
										<h4>Selected Order Details</h4>
										<div className="d-flex">
										<div className="d-flex flex-column">
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Patient Details:</b> {selectedRowDetails?.Patient?.displayName}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Address:</b> {selectedRowDetails.addressLine1}
										</span>
										{/* <span style={{ padding: "0.3rem 0.25rem" }}>
											<b>No. of Bags:</b> {selectedRowDetails.noOfBags}
										</span> */}
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Storage:</b> {selectedRowDetails.deliveryStorage}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Type:</b> {selectedRowDetails.deliveryType}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Notes:</b> {selectedRowDetails.deliveryNote}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Price to Pay:</b> {selectedRowDetails.charges}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Driver Remarks:</b> {deliveryReport?.text}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											<b>Deliverd Date:</b> {deliveryReport?.createdAt?formatDate(deliveryReport?.createdAt):''}
										</span>
										<span style={{ padding: "0.3rem 0.25rem" }}>
											
											<b>Delivered Time:</b> {deliveryReport?.createdAt?formatTime(deliveryReport.createdAt) : ''}
										</span>
	

										</div>
										<div className="ms-4">
											{deliveryReport && (
											<div className="reportsImages d-flex flex-column">
												<h6>Delivery Proof</h6>
												<img 
												className="mt-2 mb-2"
												onClick={() => handleImageClick(deliveryReport?.imageFileName)}
												style={{ cursor: "pointer" }}
												src={`data:image/png;base64,${deliveryReport?.imageFileName}`} alt="Image 1" />
												<h6>Signature</h6>
												<img 
												className="mt-2 mb-2"
												onClick={() => handleImageClick(deliveryReport?.signatureFileName)}
												style={{ cursor: "pointer" }}
												src={`data:image/png;base64,${deliveryReport?.signatureFileName}`} alt="Image 2" />
											</div>
											)}
										</div>
										</div>
										<span style={{ padding: "0.3rem 0 0 0" }} className="text-center">
											<button
												className="btn btn-secondary"
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
					</div>
						{clickedImage && (
							<div
							className="custom-modal"
							style={{
								transition: "ease",
								position: "fixed",
								top: 0,
								left: 0,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "100vh",
								width: "100vw",
								backgroundColor: "rgba(0, 0, 0, 0.8)",
							}}
							>
							<div className="imageFullView">
								<img src={`data:image/png;base64,${clickedImage}`} alt="Clicked Image" />
							</div>
							<span style={{ position: "absolute", top: "100px", right: "100px" }}>
								<button
								className="btn btn-secondary"
								style={{ width: "100px" }}
								onClick={() => {
									setClickedImage(null);
								}}
								>
								Close
								</button>
							</span>
							</div>
						)}
				</div>
			</div>
		</div>
	);
}

export default DeliveryHistory;
