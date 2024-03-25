import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileAlt, faClipboardList, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./Mdslanding.css";
import Axios from "../../Services/axios";
import { BarChart, PieChart } from "../../Components/chart";
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from "react-toastify";
const MdsLanding = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [stats, setStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showPatientTable, setShowPatientTable] = useState(false); 
  const [showQueryTable, setShowQueryTable] = useState(false); 
  const [patients, setPatients] = useState([]);
  const [clickedCardTitle, setClickedCardTitle] = useState("");
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const getStats = () => {
    Axios.get("/mds/todayStats")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  const getAllStats = () => {
    Axios.get("/mds/allStats")
      .then((res) => {
		setMonthlyStats(res.data.monthlyStats);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  const handleEditMds = (id,PatientId,queries,NonMdsqueries) => {
    const resolved = "resolved";
    Axios.put("/mds/updateMds/" + id, {
      queries: queries ? `${queries} ${resolved}` : null,
      NonMdsqueries: NonMdsqueries ? `${NonMdsqueries} ${resolved}` : null,
      patientId: PatientId,
    })
    .then((res) => {
      toast.success("Mds Status Updated Successfully", {position: 'top-right',});
      getStats();
      getAllStats()
    })
    .catch((err) => {
      toast.error("Mds Status Updating Failed", {position: 'top-right',});
        console.log("Error: ", err);
      });
  };

  const handleCardClick = (cardTitle) => {
    // Handle card click event here
    let patientsData = [];
  
    switch (cardTitle) {
      case "No Of Mds Patient":
        patientsData = stats.noOfMdsPatientsObj;
        break;
      case "Rxs Received Today":
        patientsData = stats.receivedPatients;
        break;
      case "Rxs To Request Today":
        patientsData = stats.pendingPatients;
        break;
      case "Prepared Today":
        patientsData = stats.preparedPatients;
        break;
      case "Queries To Follow Up Today":
        patientsData = stats.queriesToFollowTodayPatients;
        break;
      case "Requested Today":
        patientsData = stats.requestedPatients;
        break;
      default:
        break;
    }

    setPatients(patientsData);
    setClickedCardTitle(cardTitle);
    setShowPatientTable(true);
    if(cardTitle === "Queries To Follow Up Today"){
      setShowQueryTable(true)
      setShowPatientTable(false);
    }else{
      setShowQueryTable(false)
    }
  };
  
  useEffect(() => {
    getStats();
	getAllStats()
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
  const cards = [
    { icon: faUser, title: "No Of Mds Patient", value: stats.noOfMdsPatients,  backgroundColor: "#04938b" },
    { icon: faFileAlt, title: "Rxs Received Today", value: stats.receivedStats,  backgroundColor: "#04938b" },
    { icon: faClipboardList, title: "Rxs To Request Today", value: stats.pendingStats,  backgroundColor: "#04938b" },
    { icon: faEnvelope, title: "Queries To Follow Up Today", value: stats.queriesToFollowToday,  backgroundColor: "#04938b" },
    { icon: faClipboardList, title: "Prepared Today", value: stats.preparedEntries,  backgroundColor: "#04938b" },
    { icon: faFileAlt, title: "Requested Today", value: stats.requestedEntries,  backgroundColor: "#04938b" },
  ];

  return (
    <div className="main-wrapper mdss">
      <div className="container-fluid">
        <div className="card">
          <div className="page-container">
            <div className="page-heading">MDS Reports</div>
            <div className="row d-flex">
              {cards.map((card, index) => (
                <div className="col-md-2 col-xs-3" key={index} onClick={() => handleCardClick(card.title)}>
                  <div className="card card-height" style={{ backgroundColor: card.backgroundColor }}>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className="card-title">
                        <FontAwesomeIcon icon={card.icon} className="mr-2 me-2" />
                        {card.title}: {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handlePrint} className="mt-4 mb-5">Print this out!</button>
           {showPatientTable && (
              <div className="patient-table table"  >
                <h3>{clickedCardTitle}</h3>
                <table ref={componentRef}>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>NHS Number</th>
                      <th>Address</th>
                      <th>Mobile Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.Patient?.firstName+ " "+ patient.Patient?.lastName}</td>
                        <td>{patient.Patient?.nhsNumber}</td>
                        <td>{patient.Patient?.addressLine1 ? patient.Patient?.addressLine1 : patient.Patient?.addressLine2}</td>
                        <td>{patient.Patient?.mobileNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
           {showQueryTable && (
              <div className="patient-table table"  >
                <h3>{clickedCardTitle}</h3>
                <table ref={componentRef}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Query</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.Patient?.firstName+ " "+ patient.Patient?.lastName}</td>
                        <td>{patient?.queries ? patient?.queries : patient?.NonMdsqueries}</td>
                        <td><button onClick={()=>handleEditMds(patient.id,patient.Patient.id,patient?.queries,patient?.NonMdsqueries)} className="btn btn-sm update"><span>Mark as Resolved</span></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
		<div className="row mt-1">
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
                      label: "Received",
                      data: monthlyStats.map((stats) => stats.receivedStats),
                      backgroundColor: "rgba(255, 99, 132, 1)",
                    },
                    {
                      label: "Pending",
                      data: monthlyStats.map((stats) => stats.pendingStats),
                      backgroundColor: "rgba(54, 162, 235, 1)",
                    },
                    {
                      label: "Prepared",
                      data: monthlyStats.map((stats) => stats.preparedStats),
                      backgroundColor: "rgba(75, 192, 192, 1)",
                    },
                    {
                      label: "Requested",
                      data: monthlyStats.map((stats) => stats.requestedStats),
                      backgroundColor: "rgba(255, 87, 51, 1)",
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
                  labels: ["Received", "Pending", "Prepared","Requested"],
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
							  ).receivedStats,
							  monthlyStats.find(
								(stats) =>
								  new Date(stats.month).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
								  }) === selectedMonth
							  ).pendingStats,
							  monthlyStats.find(
								(stats) =>
								  new Date(stats.month).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
								  }) === selectedMonth
							  ).preparedStats,
							  monthlyStats.find(
								(stats) =>
								  new Date(stats.month).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
								  }) === selectedMonth
							  ).requestedStats,
							]
						  : [40, 110, 20],
                      backgroundColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(75, 192, 192, 1)",
					              	"rgba(255, 87, 51, 1)"
                      ],
                    },
                  ],
                }}
              />
              </div>

           
        </div>
      </div>
    </div>
  </div>
  );
};

export default MdsLanding;
