import React, { useEffect, useState } from "react";
import "./Reports.css";
import { BarChart, PieChart } from "../../Components/chart";
import Axios from "../../Services/axios";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

function Reports() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [filterType, setFilterType] = useState("");
  const [filterRoute, setFilterRoute] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deliveryData, setDeliveryData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    COMPLETED: 0,
    OUTFORDELIVERY: 0,
    READY: 0,
    FAILED: 0,
    CANCELLED: 0,
  });
  const [stats, setStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const updateStatusCounts = (data) => {
    const counts = { ...statusCounts };
    counts.COMPLETED = 0;
    counts.OUTFORDELIVERY = 0;
    counts.READY = 0;
    counts.FAILED = 0;
    counts.CANCELLED = 0;

    data.forEach((item) => {
      const status = item.status || "READY";
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    setStatusCounts(counts);
  };

  useEffect(() => {
    // Fetch data from the API
    Axios.get("delivery/getAllDeliveryHistory")
      .then((response) => {
        // Update the deliveryData state with the fetched data
        const data = response.data;
        setDeliveryData(data);

        // Extract unique route names and staff names from the data
        const uniqueRoutes = Array.from(
          new Set(data.map((item) => item.Route?.name))
        );
        const uniqueStaff = Array.from(
          new Set(data.map((item) => item.Route?.assignedDriver?.name))
        );

        // Update the routes and staff states for filtering
        setRoutes(["", ...uniqueRoutes]);
        setStaff(["", ...uniqueStaff]);

        updateStatusCounts(data);
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });

    getAllStats();
  }, []);

  const filteredData = deliveryData.filter((data) => {
    // Apply filters based on the selected filter values
    if (filterType && data.deliveryType !== filterType) {
      return false;
    }
    if (filterStatus && data.status !== filterStatus) {
      return false;
    }
    if (filterRoute && data.Route?.name !== filterRoute) {
      return false;
    }
    if (filterStaff && data.Route?.assignedDriver?.name !== filterStaff) {
      return false;
    }
    if (filterStartDate && new Date(data.deliveryDate) < new Date(filterStartDate)) {
      return false;
    }
    if (filterEndDate && new Date(data.deliveryDate) > new Date(filterEndDate)) {
      return false;
    }
    if (
      searchQuery &&
      !data.Patient.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getAllStats = () => {
    Axios.get("delivery/getAllDeliveryStats")
      .then((res) => {
        setMonthlyStats(res.data.monthlyStats);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const getStatusCardColor = (status) => {
    const colorMap = {
      COMPLETED: "#04938b",
      OUTFORDELIVERY: "#04938b",
      READY: "#04938b",
      FAILED: "#04938b",
      CANCELLED: "#04938b",
    };

    return colorMap[status] || "#000";
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="page-container">
            <div className="page-heading">Report</div>
            <div className="d-flex justify-content-between mb-3">
              {Object.keys(statusCounts).map((status, index) => (
                <div className="col-md-2" key={index}>
                  <div
                    className="status-card  p-3 "
                    style={{ backgroundColor: getStatusCardColor(status) }}
                  >
                    <div className="status-name">{status}</div>
                    <div className="status-count ms-3">
                      {statusCounts[status]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="report-filters row mt-5">
              <div className="col-md-1 me-5  col-xs-6">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {Object.keys(statusCounts).map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-1 ms-4 me-5 col-xs-6">
                <select
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                >
                  <option value="">Select Route</option>
                  {routes.map((route, index) => (
                    route?.trim() !== "" && (
                      <option key={index} value={route}>
                        {route}
                      </option>
                    )
                  ))}
                </select>
              </div>
              <div className="col-md-1 ms-3 me-5 col-xs-6">
                <select
                  value={filterStaff}
                  onChange={(e) => setFilterStaff(e.target.value)}
                >
                  <option value="">Select Staff</option>
                  {staff.map((staffName, index) => (
                    staffName?.trim() !== "" && (
                      <option key={index} value={staffName}>
                        {staffName}
                      </option>
                    )
                  ))}
                </select>
              </div>
                <div className="col-md-3 col-xs-6">
                <input
                  type="text"
                  placeholder="Search Patient"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="d-flex">
            <div className="col-md-3 col-xs-6 me-2">
                <label>Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  placeholder="Select Start Date"
                  />
              </div>
              <div className="col-md-3 col-xs-6">
                  <label>End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  placeholder="Select End Date"
                />
              </div>
              </div>

            <div className="table-container">
              <table className="w-100 table-bordered table" ref={componentRef}>
                <thead>
                  <tr>
                    <th>Delivery Charges</th>
                    <th>Order ID</th>
                    <th>Patient Details</th>
                    <th>Order Details</th>
                    <th>Order Status</th>
                    <th>Amount</th>
                    <th>Route</th>
                    <th>Staff</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.charges || "N/A"}</td>
                      <td>{data.id}</td>
                      <td>{data.Patient?.firstName}</td>
                      <td>{data.deliveryNote}</td>
                      <td>{data.status || "N/A"}</td>
                      <td>{data.amount || "N/A"}</td>
                      <td>{data.Route?.name}</td>
                      <td>{data.Route?.assignedDriver?.name}</td>
                      <td>{data.deliveryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-5">
        <div className="col-md-6" style={{ padding: "0 1rem" }}>
          <div className="chart-wrapper">
            <BarChart
              data={{
                labels: monthlyStats.map((stats) =>
                  new Date(stats.month).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                ),
                datasets: [
                  {
                    label: "Completed",
                    data: monthlyStats.map((stats) => stats.completed),
                    backgroundColor: "rgba(54, 162, 235, 1)",
                  },
                  {
                    label: "Out For Delivery",
                    data: monthlyStats.map((stats) => stats.outForDelivery),
                    backgroundColor: "rgba(75, 192, 192, 1)",
                  },
                  {
                    label: "Ready",
                    data: monthlyStats.map((stats) => stats.ready),
                    backgroundColor: "rgba(255, 87, 51, 1)",
                  },
                  {
                    label: "Failed",
                    data: monthlyStats.map((stats) => stats.failed),
                    backgroundColor: "rgba(255, 0, 0, 1)",
                  },
                  {
                    label: "Cancelled",
                    data: monthlyStats.map((stats) => stats.cancelled),
                    backgroundColor: "rgba(121, 52, 0, 1)",
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6" style={{ padding: "0 1rem" }}>
          <div className="chart-wrapper">
            <h5 className="card-title">Select Month</h5>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="">-- Select Month --</option>
              {monthlyStats.map((stats) => (
                <option
                  key={stats.month}
                  value={new Date(stats.month).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                >
                  {new Date(stats.month).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </option>
              ))}
            </select>
            <PieChart
              data={{
                labels: [
                  "Total Deliveries",
                  "Completed",
                  "Out For Delivery",
                  "Ready",
                  "Cancelled",
                  "Failed",
                ],
                datasets: [
                  {
                    data: selectedMonth
                      ? [
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                          ).totalDeliveries,
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                          ).completed,
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                          ).outForDelivery,
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                          ).ready,
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                          ).cancelled,
                          monthlyStats.find(
                            (stats) =>
                              new Date(stats.month).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              }) === selectedMonth
                        
							  ).failed,
							]
						  : [40, 110, 20],
                      backgroundColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(75, 192, 192, 1)",
						"rgba(255, 87, 51, 1)",
            "rgba(121, 52, 0, 1)",
            "rgba(255, 0, 0, 1)"
                      ],
                    },
                  ],
                }}
              />
              
              </div>

           
        </div>
      </div>
    </div>
  );
}

export default Reports;
