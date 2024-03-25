import React, { useEffect, useState } from "react";
import "./Patients.css";
import Axios from "../../Services/axios";

function Patients() {
  const [searchPatient, setSP] = useState("");
  const [patients, setPatients] = useState([]);
  const [viewId, setViewId] = useState("");
  const [selectedPatient, setSelP] = useState(null);
  const [patientDeliveryStates, setPatientDeliveryStates] = useState([]);
  const [patientCollectionStates, setPatientCollectionStates] = useState([]);
  const [showDelivery, setShowDelivey] = useState(0);
  const [deliveries, setDeliveries] = useState([]);

  const dummyPatients = [
    {
      id: 1,
      firstName: "Faizan",
      middleName: "Subhani",
      gender: "Male",
      nhsNumber: 2123242,
      dateOfBirth: "22/12/2002",
      mobileNo: 121211212,
      townName: "Lahore",
    },
    {
      id: 2,
      firstName: "Ali",
      middleName: "Ahmad",
      gender: "Male",
      nhsNumber: 333111,
      dateOfBirth: "23/11/2003",
      mobileNo: 121211212,
      townName: "Lahore",
    },
  ];

  const dummyDeliveries = [
    {
      service: "Standard",
      deliveryType: "rx",
      startDate: "12/12/2023",
      deliveryNote: "None",
    },
    {
      service: "Premium",
      deliveryType: "ecd",
      startDate: "4/8/2023",
      deliveryNote: "None",
    },
  ];

  const getPatients = () => {
    Axios.get("/patient/getPatient")
      .then((res) => {
        const updatedPatients = res.data.map((patient) => {
          const date = new Date(patient.dateOfBirth);
          let formattedDateOfBirth = null;
          if (patient.dateOfBirth) {
            formattedDateOfBirth = `${date.toLocaleString("en-US", {
              month: "long",
            })} ${date.getDate()}, ${date.getFullYear()}`;
          }
          return {
            ...patient,
            dateOfBirth: formattedDateOfBirth,
          };
        });
        setPatients(updatedPatients);
      })
      .catch((err) => {
        console.log(err);
        setPatients(dummyPatients);
      });
  };

  const getDeliveries = (id) => {
    Axios.get("/delivery/getPatientByUserId/" + id)
      .then((res) => {
        setDeliveries(res.data);
      })
      .catch((err) => {
        console.log(err);
        setDeliveries(dummyDeliveries);
      });
  };

  const patientDetails = (patient) => {
    console.log(patient);

    Axios.get("/patient/getPatientStats/" + patient.id)
      .then((res) => {
        if (res.data.deliveryStats.length !== 0 || res.data.collectionStats.length !== 0) {
          setShowDelivey(1);
          setPatientCollectionStates(res.data.collectionStats);
          setPatientDeliveryStates(res.data.deliveryStats);
        } else {
          setShowDelivey(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="page-heading">Patients</div>
          <div className="row">
            <div className="col-md-3 col-xs-12 form-field d-flex ">
              <input
                type="text"
                value={searchPatient}
                placeholder="Search"
                onChange={(e) => {
                  setSP(e.target.value);
                }}
              />

              <button style={{ width: "auto" }} className="btn add">
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
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((patient) => {
                      const patientName = `${patient.firstName} ${patient.middleName}`;
                      return (
                        patientName.toLowerCase().includes(searchPatient.toLowerCase()) ||
                        patient.nhsNumber.toString().toLowerCase().includes(searchPatient.toLowerCase())
                      );
                    })
                    .map((patient) => (
                      <React.Fragment key={patient.id}>
                        <tr>
                          <td>{patient?.firstName + " " + patient?.middleName+ " " +patient?.lastName}</td>
                          <td>{patient.nhsNumber}</td>
                          <td>{patient.dateOfBirth}</td>
                          <td>{patient.mobileNo}</td>
                          <td>{patient.addressLine1}</td>
                          <td>
                            <button
                              className="btn view btn-sm me-1"
                              data-toggle="modal"
                              data-target="#ViewPatientModalCenter"
                              onClick={() => {
                                setViewId(patient.id);
                                patientDetails(patient);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        {selectedPatient?.id === patient.id && showDelivery === 1 && (
                          <tr>
                            <div>
                              <table className="w-100 table-bordered table">
                                <thead>
                                  <tr>
                                    <th>Service</th>
                                    <th>Delivery Type</th>
                                    <th>Date</th>
                                    <th>Delivery Note</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {deliveries.map((delivery) => (
                                    <tr key={delivery.id}>
                                      <td>{delivery.service}</td>
                                      <td>{delivery.deliveryType}</td>
                                      <td>{delivery.startDate}</td>
                                      <td>{delivery.deliveryNote}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
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
                Details
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
            <div className="modal-body">
              {showDelivery === 1 ? (
                <div>
                  <h3 className="page-heading">Delivery Info:</h3>
                  {patientDeliveryStates.map((element, index) => (
                    <div key={index}>
                      <div className="row ms-2 mt-3">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold me-2">Delivery Date:</span>
                          {element.deliveryDate}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold me-2">Status:</span>
                          {element.status}
                        </div>
                        {/* Add more fields here as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No delivery data available.</p>
              )}

              {showDelivery === 1 ? (
                <div className="mt-4">
                  <h3 className="page-heading">Collection Info:</h3>
                  {patientCollectionStates.map((element, index) => (
                    <div key={index}>
                      <div className="row ms-2 mt-3">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold me-2">Collected Date:</span>
                          {element.CollectedDate}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold me-2">Status:</span>
                          {element.Status}
                        </div>
                        {/* Add more fields here as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No collection data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;
