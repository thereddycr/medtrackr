import React, { useEffect, useRef, useState } from "react";
import "./Mdsedit.css";
import Axios from "../../Services/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFileAlt, faClipboardList, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useReactToPrint } from 'react-to-print';
function MdsEdit() {
  const [patients, setPatients] = useState([]);
  const [mds, setMds] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [mdsForm, setMdsForm] = useState({});
  const [nonMdsForm, setNonMdsForm] = useState({});
  const [mode, setMode] = useState("add");
  const [stats, setStats] = useState({});
  const closeRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [mdsShow,setMdsShow]=useState(false);
  const [buttonActive, setButtonActive] = useState(Array(filteredPatients.length).fill(false));
  const [buttonNonActive, setButtonNonActive] = useState(Array(filteredPatients.length).fill(false));
  const [buttonHActive, setButtonHActive] = useState(Array(filteredPatients.length).fill(false));

  const [clickedCardTitle, setClickedCardTitle] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

const handleSubmit = (e) =>{
  e.preventDefault();
  const formData = {};
  const formElements = e.target.elements;
  
  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value && element.value !== ""? element.value : null;
    }
  }
  const filteredFormData = Object.fromEntries(
    Object.entries(formData).filter(([_, value]) => value !== null)
  );

  if (mode === 'add') {
    handleAddMds(filteredFormData);
  } else if (mode === 'addNonMds') {
    handleAddNonMds(filteredFormData);
  } else if (mode === 'edit') {
    handleEditMds(filteredFormData);
  } else if (mode === 'editNonMds') {
    handleEditNonMds(filteredFormData);
  }
  e.target.reset();
  closeRef.current.click()
}
const getStats = () => {
  Axios.get("/mds/todayStats")
    .then((res) => {
      setStats(res.data);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
};
  const loadPatients = () => {
    Axios.get("/mds/getMdsPatients")
      .then((res) => {
        console.log("Patients", res.data);

        setPatients(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const loadMDS = () => {
    Axios.get("/mds/getMds")
      .then((res) => {
        console.log("load MDS", res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleAddMds = (data) => {
    if(data.queries && !data.RequestedDate) {
      toast.warning("Requested date is mandatory for Queries ", {position: 'top-right',});
    return
    }
    Axios.post("/mds/createMds", {
      status: "Pending",
      RequestedDate: data.RequestedDate,
      RecievedDate: data.RecievedDate,
      queries: data.queries,
      patientId: selectedPatient.id,
      PreparedDate: data.PreparedDate,
      CollectedDate: data.CollectedDate,
      DeliveredDate: data.DeliveredDate,
      remind: data.remind,
    })
      .then((res) => {
        loadPatients();
        toast.success("Mds Updated Successfully", {position: 'top-right',});
        loadMDS();
        viewHistory(selectedPatient.id);
      })
      .catch((err) => {
        toast.error("Mds Updating Failed", {position: 'top-right',});
        console.log("Error: ", err);
      });
    };
    const handleAddNonMds = (data) => {
    if(data.queries && !data.RequestedDate) {
      toast.warning("Requested date is mandatory for Queries ", {position: 'top-right',});
    return
    }
    Axios.post("/mds/createMds", {
      NonMdsStatus: "Pending",
      NonMdsRequestedDate: data.RequestedDate,
      NonMdsRecievedDate: data.RecievedDate,
      NonMdsDeliveredDate: data.DeliveredDate,
      NonMdsCollectedDate: data.CollectedDate,
      NonMdsqueries: data.queries,
      patientId: selectedPatient.id,
      NonMdsPrepareddDate: data.PreparedDate,
      NonMdsremind: data.remind,
    })
    .then((res) => {
        loadMDS();
        toast.success("Non Mds Updated Successfully", {position: 'top-right',});
        loadPatients();
        viewHistory(selectedPatient.id);
      })
      .catch((err) => {
        toast.error("Non Mds Updating Failed", {position: 'top-right',});
        console.log("Error: ", err);
      });
  };

  const handleEditMds = (data) => {
    Axios.put("/mds/updateMds/" + mdsForm.id, {
      RequestedDate: data.RequestedDate,
      RecievedDate: data.RecievedDate,
      queries: data.queries,
      PreparedDate: data.PreparedDate,
      CollectedDate: data.CollectedDate,
      patientId: selectedPatient.id,
      DeliveredDate: data.DeliveredDate,
      remind: data.remind,
    })
    .then((res) => {
      loadMDS();
      toast.success("Mds Status Updated Successfully", {position: 'top-right',});
      loadPatients();
      viewHistory(selectedPatient.id);
    })
    .catch((err) => {
      toast.error("Mds Status Updating Failed", {position: 'top-right',});
        console.log("Error: ", err);
      });
  };

  const handleEditNonMds = (data) => {
    Axios.put("/mds/updateMds/" + nonMdsForm.id, {
      NonMdsRequestedDate: data.RequestedDate,
      NonMdsRecievedDate: data.RecievedDate,
      NonMdsDeliveredDate: data.DeliveredDate,
      NonMdsCollectedDate: data.CollectedDate,
      NonMdsqueries: data.queries,
      patientId: selectedPatient.id,
      NonMdsPrepareddDate: data.PreparedDate,
      NonMdsremind: data.remind,
    })
    .then((res) => {
      loadMDS();
      loadPatients();
      toast.success("Non Mds Status Updated Successfully", {position: 'top-right',});
      viewHistory(selectedPatient.id);
    })
    .catch((err) => {
        toast.error("Non Mds Status Updating Failed", {position: 'top-right',});
        console.log("Error: ", err);
      });
  };
  const viewHistory = (id) => {
    Axios.post("/mds/getMdsPatientsById", {
      patientId: id,
    })
      .then((res) => {


		setMdsShow(true);
        setSelectedPatients(res.data[0]);
        setMds(res.data[0].Md);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const handleCancel=()=>{
	setMdsShow(false)
  }

  useEffect(() => {
    loadPatients();
    loadMDS();
    getStats()
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

  useEffect(() => {
    if (searchQuery) {
      var temp = patients.filter((patient) => {
        var name =
          patient.firstName.toLowerCase() +
          " " +
          patient.middleName.toLowerCase();
        return (
          name.includes(searchQuery.toLowerCase()) ||
          patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.addressLine1
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          patient.nhsNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredPatients(temp);
    } else {

    if(mdsShow!=true)
   {
      setFilteredPatients([]);
   }
	
	}
  }, [searchQuery]);
  const cards = [
    { icon: faUser, title: "No Of Mds Patient", value: stats.noOfMdsPatients,  backgroundColor: "#04938b" },
    { icon: faFileAlt, title: "Rxs Received Today", value: stats.receivedStats,  backgroundColor: "#04938b" },
    { icon: faClipboardList, title: "Rxs To Request Today", value: stats.pendingStats,  backgroundColor: "#04938b" },
    { icon: faEnvelope, title: "Queries To Follow Up Today", value: stats.queriesToFollowToday,  backgroundColor: "#04938b" },
    { icon: faClipboardList, title: "Prepared Today", value: stats.preparedEntries,  backgroundColor: "#04938b" },
    { icon: faFileAlt, title: "Requested Today", value: stats.requestedEntries,  backgroundColor: "#04938b" },
  ];
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
    setClickedCardTitle(cardTitle);
  };
  const defaultDate = (date) =>{
   return new Date(date).toISOString().split('T')[0]
  }
  return (
    <div className="main-wrapper mdss">
      <div className="container-fluid">
        <div className="card">
          <div className="page-container">
          <div className="row d-flex">
              {cards.map((card, index) => (
                <div className="col-md-2 col-xs-3" key={index} onClick={() => handleCardClick(card.title)}>
                  <div className="card card-height" style={{ backgroundColor: card.backgroundColor }}>
                    <div className= "d-flex align-items-center justify-content-center">
                      <p className="card-title">
                        <FontAwesomeIcon icon={card.icon} className="mr-2 me-2" />
                        {card.title}: {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row">
              {/* MDS Form */}
              <div className="page-heading">Update MDS RX</div>
              <div className="col-md-3 col-xs-6">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a patient"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                  />
                  <button
                    className="btn add"
                    onClick={() => setSearchQuery("")}
                  >
                    Search
                  </button>
                </div>
              </div>
              {filteredPatients?.length > 0 ? (
                <div
                  className="col-xs-12 col-md-12"
                  style={{ marginTop: "1.5rem" }}
                >
                  <table className="table table-bordered w-100" >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>NHS Number</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Service</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((filteredPatient, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {filteredPatient.firstName +
                                " " +
                                filteredPatient.lastName}
                            </td>
                            <td>{filteredPatient.nhsNumber}</td>
                            <td><span >{filteredPatient.addressLine1}</span></td>
                            <td>{filteredPatient.mobileNo}</td>
                            <td>{filteredPatient.service}</td>
                            <td>
                                <button
                                  className={`btn btn-sm add m-1 ${buttonNonActive[index] ? 'mdsActive' : ''}`}                                  data-toggle="modal"
                                  data-target="#addMdsModalCenter"
                                  onClick={() => {
                                    setMode("add");
                                    const updatedButtonActive = [];
                                    updatedButtonActive[index] = true;
                                    setButtonNonActive(updatedButtonActive);
                                    setSelectedPatient(filteredPatient);
                                    setMdsForm({});
                                  }}
                                >
                                  Update MDS RX
                                </button>
                                <button
                                  data-toggle="modal"
                                  data-target="#addMdsModalCenter"
                                  className={`btn btn-sm add m-1 ${buttonActive[index] ? 'mdsActive' : ''}`} 
                                  onClick={() => {
                                    setMode("addNonMds");
                                    const updatedNonButtonActive = [];
                                    updatedNonButtonActive[index] = true;
                                    setButtonActive(updatedNonButtonActive);
                                    setSelectedPatient(filteredPatient);
                                    setNonMdsForm({});
                                  }}
                                >
                                  Update NonMDS RX
                                </button>

                                <button
                                 className={`btn btn-sm add m-1 ${buttonHActive[index] ? 'mdsActive' : ''}`}                                  data-toggle="modal"

                                
                                  onClick={() =>{
                                    const updatedButtonActive = [];
                                    updatedButtonActive[index] = true;
                                    setButtonHActive(updatedButtonActive);
                                    viewHistory(filteredPatient.id)}
                                  }
                                >
                                  View History
                                </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <></>
              )}
             
         {mdsShow &&    (
		 <>
    
   <div className="row"> 
    <div className="col-md-3"> 
  <button onClick={handlePrint} className="print mt-3">Print this out!</button>
  </div> 
  </div>
		 <div className="row " ref={componentRef}>
                    
					<h5 className="mt-3">
                Patient Name:{" "}
                {patients.find((p) => p.id === mds[0]?.patientId)?.firstName}{" "}
                {patients.find((p) => p.id === mds[0]?.patientId)?.lastName}
              </h5>
                <div className="col-md-12">
                  <div
                    className="col-xs-12 col-md-12 page-heading"
                    style={{ margin: "1rem 0" }}
                  >
                    MDS RX
                  </div>

                  <div className="col-xs-12 col-md-12">
                    <table className="table table-bordered w-100">
                      <thead>
                        <tr>
                          <th>Requested</th>
                          <th>Received</th>
                          <th>Prepared</th>
                          <th>Delivery</th>
                          <th>Collected</th>
                          <th>Query</th>
                          <th>Next Due</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mds.map((mdsPatient, index) => {
                          var patient = patients.filter(
                            (p2) => p2.id === mdsPatient.patientId
                          )[0];
                          if (patient) {
                            // Check if all row entities are empty
                            if (
                              !mdsPatient.RecievedDate &&
                              !mdsPatient.RequestedDate &&
                              !mdsPatient.PreparedDate &&
                              // !mdsPatient.status &&
                              !mdsPatient.remind &&
                              !mdsPatient.CollectedDate &&
                              !mdsPatient.DeliveredDate
                            ) {
                              return null;
                            }

                            return (
                              <tr key={index}>
                                <td>{formatDate(mdsPatient.RequestedDate)}</td>
                                <td>{formatDate(mdsPatient.RecievedDate)}</td>
                                <td>{formatDate(mdsPatient.PreparedDate)}</td>
                                <td>{formatDate(mdsPatient.DeliveredDate)}</td>
                                <td>{formatDate(mdsPatient.CollectedDate)}</td>
                                <td>{mdsPatient.queries}</td>
                                <td>{formatDate(mdsPatient.remind)}
                                </td>
                                <td>
                                  <span style={{ display: "flex" }}>
                                    <button
                                      className="btn btn-sm add"
                                      data-toggle="modal"
                                      disabled={mdsPatient.CollectedDate || mdsPatient.DeliveredDate}
                                      data-target="#addMdsModalCenter"
                                      onClick={() => {
                                        setMode("edit");
                                        setSelectedPatient(patient);
                                        setMdsForm(mdsPatient);
                                      }}
                                    >
                                      Change Status
                                    </button>
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* MDS TABLE END */}
                <div className="col-md-12">
                  {/* NON MDS TABLE START */}

                  <div
                    className="col-xs-12 col-md-12 page-heading"
                    style={{ margin: "1rem 0" }}
                  >
                    NON MDS RX
                  </div>
                  <div className="col-xs-12 col-md-12">
                    <table className="table table-bordered w-100">
                      <thead>
                        <tr>
                          <th>Requested</th>
                          <th>Received</th>
                          <th>Prepared</th>
                          <th>Delivery</th>
                          <th>Collected</th>
                          <th>Query</th>
                          <th>Next Due</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mds.map((mdsPatient, index) => {
                          var patient = patients.filter(
                            (p2) => p2.id === mdsPatient.patientId
                          )[0];
                          if (patient) {
                            if (
                              !mdsPatient.NonMdsRecievedDate &&
                              !mdsPatient.NonMdsRequestedDate &&
                              !mdsPatient.NonMdsPrepareddDate &&
                              !mdsPatient.NonMdsStatus
                            ) {
                              return null;
                            }

                            return (
                              <tr key={index}>
                                <td>{formatDate(mdsPatient.NonMdsRequestedDate)}</td>
                                <td>{formatDate(mdsPatient.NonMdsRecievedDate)}</td>
                                <td>{formatDate(mdsPatient.NonMdsPrepareddDate)}</td>
                                <td>{formatDate(mdsPatient.NonMdsCollectedDate)}</td>
                                <td>{formatDate(mdsPatient.NonMdsDeliveredDate)}</td>
                                <td>{mdsPatient.NonMdsqueries}</td>
                                <td>{formatDate(mdsPatient.NonMdsremind)}</td>
                                <td>
                                  <span style={{ display: "flex" }}>
                                    <button
                                      className="btn btn-sm add"
                                      data-toggle="modal"
                                      disabled={mdsPatient.NonMdsDeliveredDate || mdsPatient.NonMdsCollectedDate }
                                      data-target="#addMdsModalCenter"
                                      style={{ marginLeft: "0.5rem" }}
                                      onClick={() => {
                                        setMode("editNonMds");
                                        setSelectedPatient(patient);
                                        setNonMdsForm(mdsPatient);
                                      }}
                                    >
                                      Change Status
                                    </button>
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
			  <div className="d-flex justify-content-end mt-5 me-5">
				<button className="add"   onClick={handleCancel} >
                     Cancel
			  </button>
			  </div>
			  </>
			 )}
              <div class="modal fade" id="addMdsModalCenter" tabindex="-1" role="dialog" aria-labelledby="addMdsModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      {mode === 'add' && 'Add MDS'}
                      {mode === 'addNonMds' && 'Add Non MDS'}
                      {mode === 'edit' && 'Edit MDS'}
                      {mode === 'editNonMds' && 'Edit Non MDS'}
                       </h5>
                      <button type="button" class="close" onClick={()=>{
                        setButtonActive(Array(filteredPatients.length).fill(false));
                        setButtonNonActive(Array(filteredPatients.length).fill(false));
                      }} data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Patient Name:</label>
                            <input
                              value={selectedPatient.firstName + " " + selectedPatient.lastName}
                              disabled={true}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Requested:</label>
                            <input
                             defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsRequestedDate ? defaultDate(nonMdsForm.NonMdsRequestedDate) : '' : mdsForm.RequestedDate ? defaultDate(mdsForm.RequestedDate) : ''}
                              name="RequestedDate"
                              type="date"
                              max="2100-10-29"
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Rx Received:</label>
                            <input
                             defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsRecievedDate ? defaultDate(nonMdsForm.NonMdsRecievedDate) : '' : mdsForm.RecievedDate ? defaultDate(mdsForm.RecievedDate) : ''}
                             name="RecievedDate"
                             type="date"
                             max="2100-10-29"
                             />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Prepared:</label>
                            <input
                             defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsPrepareddDate ? defaultDate(nonMdsForm.NonMdsPrepareddDate) : '' : mdsForm.PreparedDate ? defaultDate(mdsForm.PreparedDate) : ''}
                             name="PreparedDate"
                             type="date"
                             max="2100-10-29"
                             />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Delivered:</label>
                            <input
                             defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsDeliveredDate ? defaultDate(nonMdsForm.NonMdsDeliveredDate) : '' : mdsForm.DeliveredDate ? defaultDate(mdsForm.DeliveredDate) : ''}
                             name="DeliveredDate"
                             type="date"
                             max="2100-10-29"
                             />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Collected:</label>
                            <input
                             defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsCollectedDate ? defaultDate(nonMdsForm.NonMdsCollectedDate) : '' : mdsForm.CollectedDate ? defaultDate(mdsForm.CollectedDate) : ''}
                              name="CollectedDate"
                              type="date"
                              max="2100-10-29"
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                              <label>Remind Me:</label>
                              <input
                                name="remind"
                                type="number"
                              />
                            </div>
                              <div className="col-md-6 col-xs-12 form-field">
                                <label>Queries:</label>
                                <input
                                  defaultValue={mode ==='editNonMds' ? nonMdsForm.NonMdsremind ? nonMdsForm.NonMdsqueries : '' : mdsForm.queries ? mdsForm.queries : ''}
                                  name="queries"
                                />
                              </div>
                              <div className="d-flex justify-content-end">
                                <button type="button" onClick={()=>{
                                  setButtonActive(Array(filteredPatients.length).fill(false));
                                  setButtonHActive(Array(filteredPatients.length).fill(false));
                                  }} class="btn btn-light" data-dismiss="modal">
                                  Close
                                </button>
                                <button
                                  type="button"
                                  className="close"
                                  style={{visibility:'hidden'}}
                                  data-dismiss="modal"
                                  aria-label="Close"
                                  ref={closeRef}
                                ></button>
                                <button type="submit" class="btn save w-1">
                                  Save
                                </button>
                              </div>
                        </div>
                      </form>
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

export default MdsEdit;
