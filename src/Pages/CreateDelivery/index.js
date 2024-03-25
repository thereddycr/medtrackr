import React, { useState, useEffect, useRef } from "react";
import "./createdelivery.css";
import { useReactToPrint } from "react-to-print";
import Axios from "../../Services/axios";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

function CreateDelivery() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [formData, setFD] = useState({
    deliveryType: "normal",
    deliveryDate: "",
    careHome:null,
    deliveryNote: "",
    deliveryStorage: "",
    type: "rx",
    routeId: "",
  });
  const resetForm = () => {
    setFD({
      deliveryType: "normal",
      deliveryDate: "",
      deliveryNote: "",
    careHome:null,
      deliveryStorage: "",
      type: "rx",
    });
  };

  const [patients, setPatients] = useState([]);
  const [deliveryInformation, setDeliveryInformation] = useState(true);
  const [searchedPatients, setSP] = useState([]);
  const [carehomes, setCH] = useState([]);
  const [selectedPatient, setSelP] = useState();
  const [searchedPatientsStore, setSearchedPatientsStore] = useState([]);
  const [deliveries, setDeliveries] = useState([
    {
      deliveryId: 1,
      deliveryDate: "2023-8-4",
      deliveryType: "rx",
      deliveryStorage: "cd",
      CD: "cd",
      Fridge: "fridge",
      deliveryDriver: "",
    },
  ]);
  const [routes, setRoutes] = useState([]);
  const getPatients = () => {
    Axios.get("/delivery/deliveryPatients")
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        console.log("Error getting patients: ", err);
      });
  };

  const getDeliveries = () => {
    Axios.get("/delivery/delivery")
      .then((res) => {
        const updatedDeliverires = res.data.map((delivery) => {
          const date = new Date(delivery.deliveryDate);
          const formattedDateOfBirth = `${date.toLocaleString("en-US", {
            month: "long",
          })} ${date.getDate()}, ${date.getFullYear()}`;
          return {
            ...delivery,
            deliveryDate: formattedDateOfBirth,
          };
        });
        const filteredDeliveries = updatedDeliverires.filter(
          (delivery) => delivery.status !== "COMPLETED"
        );
        const sortedDeliveries = filteredDeliveries.sort((a, b) => {
          const dateA = new Date(a.deliveryDate);
          const dateB = new Date(b.deliveryDate);

          // Compare years
          if (dateA.getFullYear() !== dateB.getFullYear()) {
            return dateA.getFullYear() - dateB.getFullYear();
          }

          // Compare months
          if (dateA.getMonth() !== dateB.getMonth()) {
            return dateA.getMonth() - dateB.getMonth();
          }

          // Compare days
          return dateA.getDate() - dateB.getDate();
        });

        console.log(sortedDeliveries)
        setDeliveries(sortedDeliveries);
      })
      .catch((err) => {
        console.log("Error getting deliveries: ", err);
      });
  };
  const submitDelivery = (event) => {
    event.preventDefault();
    Axios.post("/delivery/createdelivery", {
      deliveryType: formData.type,
      deliveryNote: formData.deliveryNote,
      deliveryDate: formData.deliveryDate,
      charges: formData.charges,
      exemption: formData.exemption === "exemption" ? true : false,
      deliveryStorage: formData.deliveryStorage ? formData.deliveryStorage : "",
      patientId: selectedPatient?.id,
      careHomeId:formData.careHome,
      routeId: parseInt(formData.routeId ? formData.routeId : routes[0].id),
    })
      .then((res) => {
        toast.success('Delivery added...', {position: 'top-right',});
        getDeliveries();
        setSP([]);
        setSelP(null);
        resetForm();
      })
      .catch((err) => {
        toast.error("Error Creating delivery", {position: 'top-right',});
      });
    };
    const updateDelivery = (obj) => {
      console.log("===========================", obj);
      Axios.put("/delivery/updateDelivery/" + obj.id, {
        deliveryType: formData.type ? formData.type : obj.type,
        deliveryNote: formData.deliveryNote
        ? formData.deliveryNote
        : obj.deliveryNote,
        deliveryDate: obj.deliveryDate,
        charges: formData.charges ? formData.charges : obj.charges,
        exemption: formData.exemption
        ? formData.exemption === "exemption"
        ? true
        : false
        : formData.exemption === "exemption"
        ? true
        : false,
        deliveryStorage: formData.deliveryStorage
        ? formData.deliveryStorage
        : obj.deliveryStorage,
        patientId: obj.Patient.id,
        routeId: parseInt(obj.routeId),
      })
      .then((res) => {
        toast.success("Edited delivery", {position: 'top-right',});
        getDeliveries();
        resetForm();
      })
      .catch((err) => {
        toast.error("Error Updating delivery", {position: 'top-right',});
      });
    };
    
    const deleteDelivery = (delivery) => {
      Axios.delete("/delivery/deleteDelivery/" + delivery.id)
      .then((res) => {
        toast.success("Deleted delivery", {position: 'top-right',});
        getDeliveries();
      })
      .catch((err) => {
        toast.error("Error Deleting delivery", {position: 'top-right',});
      });
  };
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
  console.log( name, value, checked)
    if (name === "deliveryStorage") {
      if (value === "none" && checked) {
        setFD({ ...formData, [name]: null });
      } else {
        let newStorageValue = formData.deliveryStorage;
        if (checked) {
          if (newStorageValue) {
            newStorageValue += ` ${value}`;
          } else {
            newStorageValue = value;
          }
        } else {
          newStorageValue = newStorageValue
            .split(" ")
            .filter((item) => item !== value)
            .join(" ");
        }
  
        setFD({ ...formData, [name]: newStorageValue });
      }
    } else if (name === "type") {
      let newTypeValue = formData.type;
      if (checked) {
        if (newTypeValue) {
          newTypeValue += ` ${value}`;
        } else {
          newTypeValue = value;
        }
      } else {
        newTypeValue = newTypeValue
          .split(" ")
          .filter((item) => item !== value)
          .join(" ");
      }
      setFD({ ...formData, [name]: newTypeValue });
    } else {
      setFD({ ...formData, [name]: value });
    }
  };
  

  const assignRoute = (e, deliveryId) => {
    var tdelivery;
    deliveries.map((delivery) => {
      if (delivery.id === deliveryId) {
        delivery.routeId = e.target.value;
        tdelivery = delivery;
      }
    });
    console.log("Updated deliveries: ", tdelivery);
    updateDelivery(tdelivery);
  };

  const handleCancel = () => {
    setSP(searchedPatientsStore);
    setDeliveryInformation(false);
  };

  const handlePatientSearch = (e) => {
    if (e.target.value === null || e.target.value.trim() === "") {
      setDeliveryInformation(false);
    } else {
      setDeliveryInformation(true);
    }
    if (
      formData.deliveryType === "normal" &&
      patients &&
      patients?.length > 0
    ) {
      console.log(patients);
      setFD({ ...formData, [e.target.name]: e.target.value });
      var filteredPatients = patients.filter(
        (patient) =>
          patient.firstName
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim()) ||
          patient.lastName
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim()) ||
          patient.addressLine1
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim()) ||
          patient.nhsNumber
            .toLowerCase()
            .includes(e.target.value.toLowerCase().trim())
      );
      console.log("Filtered: ", filteredPatients);
      if (e.target.value === null || e.target.value.trim() === "") {
        setDeliveryInformation(false);
        setSP([]);
      } else {
        setDeliveryInformation(false);
        setSP(filteredPatients);
        setSearchedPatientsStore(filteredPatients);
      }
    } else {
      Axios.get("/carehome/carehomePatients/" + formData.searchHome)
        .then((res) => {
          setSP(res.data);
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
  };

  const changeStatus = (e, index) => {
    Axios.post("/delivery/updateDeliveryStatus/" + index, {
      status: e.target.value,
    })
      .then((res) => {
        console.log("Response: ", res);
        getDeliveries();
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const getCareHomes = () => {
    Axios.get("/carehome/carehome")
      .then((res) => {
        setCH(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
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

  const onSelectedDelivery = (id) => {
    const filteredPatients = searchedPatients.filter((patient) => {
      if (patient.id === id) {
        setDeliveryInformation(true);
        return patient;
      }
    });
    console.log(filteredPatients);

    setSP(filteredPatients);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  }
  const isDateValid = (date) => {
    const currentDate = getCurrentDate();
    return date >= currentDate;
  };

  const handleDeliveryDateChange = (e) => {
    const { name, value } = e.target;
    if (isDateValid(value)) {
      setFD({ ...formData, [e.target.name]: e.target.value });
    } else {
      window.alert("invalid date");
    }
  };

  const getDeliveryById = (id) => {
    const filteredDelivery = deliveries.filter((delivery) => {
      console.log("hamzas");

      if (delivery.id === id) {
        return delivery;
      }
    });
    console.log(filteredDelivery);

    setFD({
      deliveryType: filteredDelivery[0].deliveryType,
      deliveryDate: "",
      deliveryNote: filteredDelivery[0].deliveryNote,
      deliveryStorage: filteredDelivery[0].deliveryStorage,
      type: filteredDelivery[0].deliveryType,
    });
  };

  const defaultRouteId = routes.length > 0 ? routes[0].id : "";
  useEffect(() => {
    getPatients();
    getDeliveries();
    getCareHomes();
    getRoutes();
  }, []);

  return (
    <>
      <div className="main-wrapper">
        <div className="container-fluid">
          <div className="card">
            <div className="page-heading ms-3">Add Delivery</div>
            <div className="card-body">
              <div className="row">
                <form onSubmit={submitDelivery} className="row">
                  <div className="col-md-2 col-xs-12 form-field">
                    <label>Delivery Type:</label>
                    <select
                      name="deliveryType"
                      value={formData.deliveryType}
                      onChange={handleChange}
                    >
                      <option value="normal">Normal</option>
                      <option value="carehome">Carehome</option>
                    </select>
                  </div>
                  <div className="col-md-2 col-xs-12 form-field">
                    <label>Route<span className="star"> * </span></label>
                    
                    <select
                      name="routeId"
                      required
                      value={formData.routeId || defaultRouteId}
                      onChange={handleChange}
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => {
                        return <option value={route.id}>{route.name}</option>;
                      })}
                    </select>
                  </div>
                  <div className="ms-auto  col-md-3 col-xs-12 form-field">
                    <label>Delivery Date<span className="star"> * </span></label>
                    <input
                      type="date"
                      max="2100-10-29"
                      name="deliveryDate"
                      required
                      value={formData.deliveryDate}
                      onChange={handleDeliveryDateChange}
                      min={getCurrentDate()}
                    />
                  </div>

                  <div className="col-md-3 col-xs-12 form-field">
                    {formData.deliveryType === "normal" ? (
                      <>
                        <label>Search Patient</label>
                        <input
                          type="text"
                          placeholder="Search"
                          name="searchPatient"
                          value={formData.searchPatient}
                          onChange={handlePatientSearch}
                        />
                      </>
                    ) : (
                      <>
                        <label>Search Care Home</label>
                        <select
                          name="careHome"
                          value={formData.careHome}
                          onChange={handleChange}
                        >
                          <option value="">Select Carehome</option>
                          {carehomes.map((carehome) => {
                            return (
                              <option value={carehome.id}>
                                {carehome.name}
                              </option>
                            );
                          })}
                        </select>
                      </>
                    )}
                  </div>
                  {searchedPatients?.length > 0 ? (
                    <div
                      className="col-xs-12 form-field"
                      style={{ display: "flex", alignItems: "end" }}
                    >
                      <table className="w-100 table-bordered table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>NHS Number</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedPatients.map((patient) => (
                            <tr key={patient.name}>
                              <td>
                                {patient.firstName} {patient.lastName}
                              </td>
                              <td>{patient.nhsNumber}</td>
                              <td>{patient.addressLine1}</td>
                              <td>{patient.mobileNo}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelP(patient);
                                    onSelectedDelivery(patient.id);
                                  }}
                                >
                                  Add Delivery
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <></>
                  )}
                  {(selectedPatient || formData.careHome)  && deliveryInformation ? (
                    <div className="col-xs-12 form-field">
                      <h4>Enter Delivery Information</h4>
                      <div className="row">
                        <div className="col-md-3 col-xs-6">
                          <label>Type:</label>
                          <div
                            className="col-md-12 col-xs-12 form-field"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              <label
                                className="d-flex align-items-center"
                                htmlFor="dossetteTrakr"
                              >
                                Rx
                              </label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="type"
                                value="rx"
                                checked={formData.type.includes("rx")}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                          <div
                            className="col-md-12 col-xs-12 form-field"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              <label
                                className="d-flex align-items-center"
                                htmlFor="dossetteTrakr"
                              >
                                OTC
                              </label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="type"
                                value="otc"
                                checked={formData.type.includes("otc")}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="col-md-3 col-xs-6">
                          <label>Storage:</label>
                          <div
                            className="col-md-12 col-xs-12 form-field"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "red" }}>
                              <label
                                className="d-flex align-items-center"
                                htmlFor="cd"
                              >
                                CD
                              </label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="deliveryStorage"
                                value="cd"
                                checked={formData.deliveryStorage?.includes(
                                  "cd"
                                )}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                          <div
                            className="col-md-12 col-xs-12 form-field"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: "blue" }}>
                              <label
                                className="d-flex align-items-center"
                                htmlFor="fridge"
                              >
                                Fridge
                              </label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="deliveryStorage"
                                value="fridge"
                                checked={formData.deliveryStorage?.includes(
                                  "fridge"
                                )}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                          <div
                            className="col-md-12 col-xs-12 form-field"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              <label
                                className="d-flex align-items-center"
                                htmlFor="none"
                              >
                                None
                              </label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="deliveryStorage"
                                value="none"
                                checked={formData.deliveryStorage === null}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 col-xs-12 form-field">
                          <label>Note:</label>
                          <textarea
                            style={{ width: "100%", height: "auto" }}
                            name="deliveryNote"
                            value={formData.deliveryNote}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="col-md-4 col-xs-12 form-field">
                          <label>Payment Exempt:</label>
                          <select
                            name="exemption"
                            required
                            value={formData.exemption}
                            onChange={handleChange}
                          >
                            <option value="">Select Exempt</option>
                            <option value="exemption">Exempt</option>
                            <option value="pay">To Pay</option>
                          </select>
                        </div>
                        {formData.exemption === "pay" ? (
                          <div className="col-md-4 col-xs-12 form-field">
                            <label>Amount:</label>
                            <input
                              name="charges"
                              required
                              placeholder="Enter the amount in £"
                              type="number"
                              value={formData.charges}
                              onChange={handleChange}
                              min="0"
                              max="1000"
                              step="0.0000001"
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div
                        className="col-xs-12 form-field"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <div
                          className="btn btn-light "
                          onClick={handleCancel}
                          style={{ width: "auto" }}
                        >
                          Cancel
                        </div>

                        <button
                          className="btn save ms-2"
                          type="submit"
                          style={{ width: "auto", backgroundColor: "#212529" }}
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </form>

                <div className="col-xs-12 form-field">
                  <h2 className="page-heading">Deliveries</h2>
                  <table className="w-100 table-bordered table mt-2">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Storage</th>
                        <th>Note</th>
                        <th>To Pay</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>QR Code</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((delivery) => (
                        <tr key={delivery.date}>
                          <td>{delivery.deliveryDate}</td>
                          <td>{delivery?.Patient?.displayName ? delivery?.Patient?.displayName : delivery?.carehome?.name}</td>
                          <td>{delivery.deliveryType}</td>
                          <td>{delivery.deliveryStorage}</td>
                          <td>{delivery.deliveryNote}</td>
                          <td>{delivery.charges}</td>
                          <td>
                            <span>
                              <select
                                name="routeId"
                                disabled
                                value={delivery.routeId}
                                onChange={(e) => {
                                  assignRoute(e, delivery.id);
                                }}
                              >
                                <option value="">Select Route</option>
                                {routes.map((route) => {
                                  return (
                                    <option value={route.id}>
                                      {route.name}
                                    </option>
                                  );
                                })}
                              </select>
                            </span>
                          </td>
                          <td>
                            <span>
                              <select
                                value={delivery.status}
                                onChange={(e) => {
                                  changeStatus(e, delivery.id);
                                }}
                              >
                                <option value="">Select Status</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="OUTFORDELIVERY">
                                  Out for delivery
                                </option>
                                <option value="READY">Ready</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="FAILED">Failed</option>
                              </select>
                            </span>
                          </td>
                          <td ref={componentRef}>
                            <QRCodeCanvas
                              value={JSON.stringify({id:delivery.id,routeId:delivery.routeId,deliveryDate:delivery.deliveryDate})}
                            />
                          </td>

                          <td>
                            <span>
                              {delivery.status !== "FAILED" ? (
                                <button
                                  type="button"
                                  class="btn btn-sm me-2 update"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#editModel-${delivery.id}`}
                                  onClick={() => getDeliveryById(delivery.id)}
                                >
                                  Edit
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="btn btn-sm me-2 update"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#resceduleModel-${delivery.id}`}
                                >
                                  Rescedule
                                </button>
                              )}

                              <div
                                class="modal fade"
                                id={`editModel-${delivery.id}`}
                                tabindex="-1"
                                aria-labelledby={`editModelLabel-${delivery.id}`}
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modal-dialog-centered">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5
                                        class="modal-title"
                                        id={`editModelLabel-${delivery.id}`}
                                      >
                                        Edit Deliveries
                                      </h5>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="row">
                                        <div className="col-md-6 col-xs-6">
                                          <label>Type:</label>
                                          <div
                                            className="col-md-12 col-xs-12 form-field"
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>
                                              <label
                                                className="d-flex align-items-center"
                                                htmlFor="dossetteTrakr"
                                              >
                                                Rx
                                              </label>
                                            </span>
                                            <span>
                                              <input
                                                type="checkbox"
                                                name="type"
                                                value="rx"
                                                checked={formData.type.includes("rx")}
                                                onChange={handleChange}
                                              />
                                            </span>
                                          </div>
                                          <div
                                            className="col-md- col-xs-12 form-field"
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>
                                              <label
                                                className="d-flex align-items-center"
                                                htmlFor="dossetteTrakr"
                                              >
                                                OTC
                                              </label>
                                            </span>
                                            <span>
                                              <input
                                                type="checkbox"
                                                name="type"
                                                value="otc"
                                                checked={formData.type.includes("otc")}
                                                onChange={handleChange}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                        <div className="col-md-3 col-xs-6">
                                          <label>Storage:</label>
                                          <div
                                            className="col-md-12 col-xs-12 form-field"
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>
                                              <label
                                                className="d-flex align-items-center"
                                                htmlFor="cd"
                                              >
                                                CD
                                              </label>
                                            </span>
                                            <span>
                                              <input
                                                type="checkbox"
                                                name="deliveryStorage"
                                                value="cd"
                                                checked={formData.deliveryStorage?.includes(
                                                  "cd"
                                                )}
                                                onChange={handleChange}
                                              />
                                            </span>
                                          </div>
                                          <div
                                            className="col-md-12 col-xs-12 form-field"
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>
                                              <label
                                                className="d-flex align-items-center"
                                                htmlFor="fridge"
                                              >
                                                Fridge
                                              </label>
                                            </span>
                                            <span>
                                              <input
                                                type="checkbox"
                                                name="deliveryStorage"
                                                value="fridge"
                                                checked={formData.deliveryStorage?.includes(
                                                  "fridge"
                                                )}
                                                onChange={handleChange}
                                              />
                                            </span>
                                          </div>
                                          <div
                                            className="col-md-12 col-xs-12 form-field"
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <span>
                                              <label
                                                className="d-flex align-items-center"
                                                htmlFor="none"
                                              >
                                                None
                                              </label>
                                            </span>
                                            <span>
                                              <input
                                                type="checkbox"
                                                name="deliveryStorage"
                                                value="none"
                                                checked={
                                                  formData.deliveryStorage ===
                                                  null
                                                }
                                                onChange={handleChange}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                        <div className=" col-xs-12 form-field">
                                          <label>Note:</label>
                                          <textarea
                                            style={{
                                              width: "100%",
                                              height: "auto",
                                            }}
                                            name="deliveryNote"
                                            value={formData.deliveryNote}
                                            onChange={handleChange}
                                          ></textarea>
                                        </div>
                                        <div className=" col-xs-12 form-field">
                                          <label>Payment Exemption:</label>
                                          <select
                                            name="exemption"
                                            required
                                            value={formData.exemption}
                                            onChange={handleChange}
                                          >
                                            <option value="">
                                              Select Exemption
                                            </option>
                                            <option value="exemption">
                                              Exemption
                                            </option>
                                            <option value="pay">To Pay</option>
                                          </select>
                                        </div>
                                        {formData.exemption === "pay" ? (
                                          <div className=" col-xs-12 form-field">
                                            <label>Amount:</label>
                                            <input
                                              name="charges"
                                              required
                                              placeholder="Enter the amount in £"
                                              type="number"
                                              value={formData.charges}
                                              onChange={handleChange}
                                              min="0"
                                              max="1000"
                                              step="0.0000001"
                                            />
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                    <div class="modal-footer">
                                      <button
                                        type="button"
                                        class="btn btn-light"
                                        data-bs-dismiss="modal"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        class="btn save"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                          updateDelivery(delivery);
                                        }}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="modal fade"
                                id={`resceduleModel-${delivery.id}`}
                                tabindex="-1"
                                aria-labelledby={`resceduleModelLabel-${delivery.id}`}
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modal-dialog-centered">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5
                                        class="modal-title"
                                        id={`resceduleModelLabel-${delivery.id}`}
                                      >
                                        Rescedule Delivery
                                      </h5>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div class="modal-body"></div>
                                    <div class="modal-footer">
                                      <button
                                        type="button"
                                        class="btn btn-light"
                                        data-bs-dismiss="modal"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        class="btn save"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                          updateDelivery(delivery);
                                        }}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                className="btn delete btn-sm"
                                onClick={() => {
                                  deleteDelivery(delivery);
                                }}
                              >
                                Delete
                              </button>

                              <button className="ms-2" onClick={handlePrint}>
                                Scan Qr Code
                              </button>
                            </span>
                          </td>
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

export default CreateDelivery;
