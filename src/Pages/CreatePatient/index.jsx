import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./CreatePatient.css";
import Axios from "../../Services/axios";
import { DateTimeFormat } from "intl";
import ConfirmationModal from "../../Components/confirmationModal";
import { GrView } from "react-icons/gr";
import { GrEdit } from "react-icons/gr";
import { LuSubtitles } from "react-icons/lu";
import { useRef } from "react";

function CreatePatient() {
  const modalRef = useRef();

  const scrollToTop = () => {
    modalRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  };
  const formInitialState = {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    nhsNumber: "",
    dateOfBirth: "",
    displayName: "",
    email: "",
    mobileNo: "",
    alternativeContactNo: "",
    landlineNo: "",
    dependentContactNo: "",
    status: "active",
    addressLine1: "",
    addressLine2: "",
    postCode: "",
    country: "",
    deliveryType: "",
    service: "",
    nursingHome: "",
    route: "",
    paymentException: "",
    surgery: "",
    deliveryNote: "",
    repeatTask: false,
    startDate: null,
    repeatEndDate: null,
    repeatCycle: "",
    weekdays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  };

  const [formData, setFormData] = useState(formInitialState);

  const dummyData = [
    {
      id: 1,
      name: "Ahmad Care Home",
      manager: "Dr. Ahmad",
      carer: "Hajra Bibi",
    },
    {
      id: 2,
      name: "Lahore Care Home",
      manager: "Hamid Khan",
      carer: "Khan Sahib",
    },
  ];

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
      country: "Pakistan",
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
      country: "Pakistan",
    },
  ];
  const [mode, setMode] = useState("add");
  const [searchPatient, setSP] = useState("");
  const [enableButton, setEB] = useState(false);
  const [patients, setPatients] = useState([]);
  const [careHome, setCH] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState("");
  const [selectedMember, setSM] = useState({});
  const [confirmationModal2, setCM2] = useState(false);
  const [confirmationModal1, setCM1] = useState(false);
  const handleChange = (e) => {
    console.log(e.target.value.dateOfBirth);
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    if (
      e.target.name === "landlineNo" ||
      e.target.name === "mobileNo" ||
      e.target.name === "dependentContactNo" ||
      e.target.name === "alternativeContactNo"
    ) {
      if (e.target.value.length < 12) {
        setFormData({
          ...formData,
          [name]: fieldValue,
        });
      }
    } else if (e.target.name === "nhsNumber") {
      if (e.target.value.length < 11) {
        setFormData({
          ...formData,
          [name]: fieldValue,
        });
      }
    } else if (e.target.name === "postCode") {
      if (e.target.value.length < 9) {
        setFormData({
          ...formData,
          [name]: fieldValue,
        });
      }
    } else if (e.target.name === "firstName") {
      setFormData({
        ...formData,
        firstName: fieldValue,
        displayName: fieldValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: fieldValue,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form: ", formData);
    try {
      console.log(formData);
      const response = await fetch(
        "https://app.medtrakr.com/patient/createPatient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        window.alert();
        toast.success("patient created successfully", {
          position: "top-right",
        });
        getPatients();
        setFormData(formInitialState);
        // Reset form fields or perform any necessary actions
      } else {
        toast.success("patient created Failed", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      if (error.response.status === 400) {
        getPatients();
      }
      // Handle error scenario
    }
  };
  const handleEdit = () => {
    console.log("Editing Patient: ", selectedMember);
    Axios.put("/patient/updatePatient/" + selectedMember.id, {
      title: formData.title,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      gender: formData.gender,
      nhsNumber: formData.nhsNumber,
      dateOfBirth: formData.dateOfBirth,
      displayName: formData.displayName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      alternativeContactNo: formData.alternativeContactNo,
      landlineNo: formData.landlineNo,
      dependentContactNo: formData.dependentContactNo,
      status: formData.statue,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      postCode: formData.postCode,
      country: formData.country,
      deliveryType: formData.deliveryType,
      service: formData.service,
      nursingHome: formData.nursingHome,
      route: formData.route,
      paymentException: formData.paymentException,
      surgery: formData.surgery,
      deliveryNote: formData.deliveryNote,
      repeatTask: false,
      startDate: formData.startDate,
      repeatEndDate: formData.repeatEndDate,
      repeatCycle: formData.repeatCycle,
      weekdays: {
        monday: formData.weekdays.monday,
        tuesday: formData.weekdays.tuesday,
        wednesday: formData.weekdays.wednesday,
        thursday: formData.weekdays.thursday,
        friday: formData.weekdays.friday,
        saturday: formData.weekdays.saturday,
        sunday: formData.weekdays.sunday,
      },
    })
      .then((res) => {
        console.log("Patinet Creation response");
        toast.success("patient Edited successfully", { position: "top-right" });
        setMode("add");
        getPatients();
        setFormData(formInitialState);
      })
      .catch((err) => {
        toast.error("patient Editing Failed", { position: "top-right" });
      });
  };
  const getCareHomes = () => {
    Axios.get("/carehome/carehome")
      .then((res) => {
        setCH(res.data);
      })
      .catch((err) => {
        console.log("Erorr: ", err);
        setCH(dummyData);
      });
  };
  useEffect(() => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.addressLine1 &&
      formData.postCode &&
      formData.dateOfBirth &&
      formData.nhsNumber
    ) {
      setEB(true);
    } else setEB(false);
  }, [formData]);

  useEffect(() => {
    getPatients();
    getRoutes();
    getCareHomes();
  }, []);

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
        alert(err);

        console.log(err);
        setPatients(dummyPatients);
      });
  };

  const selectPatient = (patient) => {
    console.log(
      patient.dateOfBirth,
      "=============================================="
    );
    setFormData({
      title: patient.title,
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      gender: patient.gender,
      nhsNumber: patient.nhsNumber,
      dateOfBirth: new Date(patient.dateOfBirth).toISOString().split("T")[0],
      displayName: patient.displayName,
      email: patient.email,
      mobileNo: patient.mobileNo,
      alternativeContactNo: patient.alternativeContactNo,
      landlineNo: patient.landlineNo,
      dependentContactNo: patient.dependentContactNo,
      status: patient.statue,
      addressLine1: patient.addressLine1,
      addressLine2: patient.addressLine2,
      postCode: patient.postCode,
      country: patient.country,
      deliveryType: patient.deliveryType,
      service: patient.service,
      nursingHome: patient.nursingHome,
      route: patient.route,
      paymentException: patient.paymentException,
      surgery: patient.surgery,
      deliveryNote: patient.deliveryNote,
      repeatTask: false,
      startDate: patient.startDate,
      repeatEndDate: patient.repeatEndDate,
      repeatCycle: patient.repeatCycle,
      weekdays: {
        monday: patient.weekdays.monday,
        tuesday: patient.weekdays.tuesday,
        wednesday: patient.weekdays.wednesday,
        thursday: patient.weekdays.thursday,
        friday: patient.weekdays.friday,
        saturday: patient.weekdays.saturday,
        sunday: patient.weekdays.sunday,
      },
    });
  };
  const getRoutes = () => {
    Axios.get("/routes/routes")
      .then((res) => {
        setRoutes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = () => {
    Axios.delete("/patient/deletePatient/" + selectedMember.id)
      .then((res) => {
        window.alert("Patient deleted.");
        toast.error("Patient Deleted Successfully", { position: "top-right" });
        setSM({});
        getPatients();
      })
      .catch((err) => {
        toast.error("patient Deletion Failed", { position: "top-right" });
      });
  };
  const handleSearchChange = (e) => {
    const trimmedValue = e.target.value.trim().toLowerCase();
    setSP(trimmedValue);
  };
  return (
    <>
      <div className="main-wrapper">
        <div className="container-fluid">
          <div className="card">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn add"
                data-toggle="modal"
                data-target="#patientModalCenter"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Add Patient
              </button>

              <div>
                <div className="form-field d-flex ">
                  <input
                    type="text"
                    // value={searchPatient}
                    placeholder="search"
                    onChange={handleSearchChange}
                  />

                  <button className="btn add ms-1">SEARCH</button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div
                class="modal fade"
                id="patientModalCenter"
                tabindex="-1"
                role="dialog"
                aria-labelledby="patientModalCenterTitle"
                aria-hidden="true"
              >
                <div
                  class="modal-dialog modal-dialog-centered "
                  id="specificDiv"
                  role="document"
                >
                  <div
                    class="modal-content "
                    style={{ minWidth: "800px", height: "95vh" }}
                  >
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">
                        Create a patient
                      </h5>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={scrollToTop}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body modal-scroll " ref={modalRef}>
                      <form onSubmit={handleSubmit} className="row">
                        <div className="personal-info col-md-6 col-xs-12">
                          <div className="page-heading">
                            Personal Information
                          </div>
                          <div className="form-field">
                            <label>Title:</label>
                            <select
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                            >
                              <option value="">Select Title</option>
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                              <option value="Ms">Ms</option>
                              <option value="Dr">Dr</option>
                            </select>
                          </div>
                          <div className="form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              First Name:{" "}
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>Middle Name:</label>
                            <input
                              type="text"
                              name="middleName"
                              value={formData.middleName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Surname:{" "}
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>Gender:</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              NHS Number:
                            </label>
                            <input
                              type="number"
                              name="nhsNumber"
                              value={formData.nhsNumber}
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Date of Birth:
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              max="2027-10-29"
                            />
                          </div>
                          <div className="row" style={{ padding: "0 1rem" }}>
                            <div className="col-md-5 col-xs-12">
                              <label>Patient Type:</label>
                              <select
                                name="mds"
                                required
                                value={formData.mds ? "mds" : "normal"}
                                onChange={(e) => {
                                  if (e.target.value === "normal") {
                                    setFormData({ ...formData, mds: false });
                                  } else {
                                    setFormData({ ...formData, mds: true });
                                  }
                                }}
                              >
                                <option value="">Select Type</option>
                                <option value="normal">Regular</option>
                                <option value="mds">MDS</option>
                              </select>
                            </div>
                            {formData.mds ? (
                              <div className="col-md-7 col-xs-12">
                                <label>Care Home:</label>
                                <select
                                  name="careHomeId"
                                  value={formData.careHomeId}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      careHomeId: parseInt(e.target.value),
                                    });
                                  }}
                                >
                                  <option value="">Select Carehome</option>
                                  {careHome.map((obj) => {
                                    return (
                                      <option value={obj.id}>{obj.name}</option>
                                    );
                                  })}
                                </select>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>

                        <div className="contact-info col-md-6 col-xs-12">
                          <div className="page-heading">
                            Contact Information
                          </div>
                          <div className="form-field">
                            <label>Display Name:</label>
                            <input
                              type="text"
                              name="displayName"
                              value={formData.displayName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>Email ID:</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div
                            className="form-field"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <span style={{ marginRight: "1rem" }}>
                              <label>Email Notification:</label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="sendEmail"
                                value={formData.sendEmail}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                          <div className="form-field">
                            <label>Mobile No:</label>
                            <input
                              type="number"
                              name="mobileNo"
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              value={formData.mobileNo}
                              onChange={handleChange}
                            />
                          </div>
                          <div
                            className="form-field"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <span style={{ marginRight: "1rem" }}>
                              <label>SMS Notification:</label>
                            </span>
                            <span>
                              <input
                                type="checkbox"
                                name="sendMessage"
                                value={formData.sendMessage}
                                onChange={handleChange}
                              />
                            </span>
                          </div>
                          <div className="form-field">
                            <label>Alternative Contact No:</label>
                            <input
                              type="number"
                              name="alternativeContactNo"
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              value={formData.alternativeContactNo}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>Landline No:</label>
                            <input
                              type="number"
                              name="landlineNo"
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              value={formData.landlineNo}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-field">
                            <label>Dependent Contact No:</label>
                            <input
                              type="number"
                              name="dependentContactNo"
                              value={formData.dependentContactNo}
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="page-heading mt-5">
                          Address Information
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>
                            <span className="me-1" style={{ color: "red" }}>
                              *
                            </span>
                            Address Line 1:{" "}
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            required
                            value={formData.addressLine1}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Address Line 2:</label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Town Name:</label>
                          <input
                            type="text"
                            name="townName"
                            value={formData.townName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>
                            <span className="me-1" style={{ color: "red" }}>
                              *
                            </span>
                            Post Code:{" "}
                          </label>
                          <input
                            type="text"
                            name="postCode"
                            required
                            value={formData.postCode}
                            onChange={handleChange}
                          />
                        </div>
                        <h4>Alternative Address (Optional)</h4>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Address Line 1:</label>
                          <input
                            type="text"
                            name="alternativeaddressLine1"
                            value={formData.alternativeaddressLine1}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Address Line 2:</label>
                          <input
                            type="text"
                            name="alternativeaddressLine2"
                            value={formData.alternativeaddressLine2}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Town Name:</label>
                          <input
                            type="text"
                            name="alternativetownName"
                            value={formData.alternativetownName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 form-field">
                          <label>Post Code:</label>
                          <input
                            type="text"
                            name="alternativepostCode"
                            value={formData.alternativepostCode}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="page-heading">Service Information</div>
                        <div className="col-md-4 col-sm-12 form-field">
                          <label>Service Type:</label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                          >
                            <option value="">Select Service Type</option>
                            <option value="collection">Collection</option>
                            <option value="delivery">Delivery</option>
                          </select>
                        </div>
                        <div className="col-md-4 col-sm-12 form-field">
                          <label>Repeat Cycle:</label>
                          <select
                            name="repeatCycle"
                            value={formData.repeatCycle}
                            onChange={handleChange}
                          >
                            <option value="">Select repeat cycle</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="28">28 days</option>
                            <option value="56">56 days</option>
                            <option value="84">84 days</option>
                          </select>
                        </div>
                        {formData.repeatCycle === "weekly" ? (
                          <div className="col-md-6 col-sm-12 form-field row">
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <label style={{ flex: 2 }}>Monday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.monday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Tuesday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.tuesday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Wednesday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.wednesday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Thursday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.thursday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Friday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.friday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Saturday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.saturday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Sunday:</label>
                              <input
                                style={{ flex: 1 }}
                                type="checkbox"
                                value={formData.weekdays.sunday}
                                onChange={(e) => {
                                  var tweekdays = formData.weekdays;
                                  tweekdays.monday = e.target.checked;
                                  setFormData({
                                    ...formData,
                                    weekdays: tweekdays,
                                  });
                                }}
                              />
                            </div>
                            <div
                              className="col-md-6 col-xs-6"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "flex-start",
                              }}
                            >
                              <label style={{ flex: 2 }}>Every: (Weeks)</label>
                              <input
                                style={{ flex: 1 }}
                                name="repeatEvery"
                                value={formData.repeatEvery}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    [e.target.name]: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="page-heading">Delivery Information</div>
                        <div className="col-md-4 col-sm-12 form-field">
                          <label>Prefered contact type:</label>
                          <select
                            name="preferedDeliveryContact"
                            value={formData.preferedDeliveryContact}
                            onChange={handleChange}
                          >
                            <option value="">Select Type</option>
                            <option value="mobile">Mobile</option>
                            <option value="landline">Landline</option>
                            <option value="alternative contact">
                              Alternative Contact
                            </option>
                            <option value="dependant contact">
                              Dependant Contact
                            </option>
                          </select>
                        </div>

                        <div className="col-md-4 col-sm-12 form-field">
                          <label>Nursing Home:</label>
                          <select
                            name="nursingHome"
                            value={formData.nursingHome}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                nursingHome: parseInt(e.target.value),
                              });
                            }}
                          >
                            <option value="">Select Carehome</option>
                            {careHome.map((obj) => {
                              return <option value={obj.id}>{obj.name}</option>;
                            })}
                          </select>
                        </div>
                        <div className="col-md-4 col-sm-12 form-field">
                          <label>Route:</label>
                          <select
                            name="route"
                            value={formData.route}
                            onChange={handleChange}
                          >
                            <option value="">Select Route</option>
                            {routes.map((route) => {
                              return (
                                <option value={route.id}>{route.name}</option>
                              );
                            })}
                          </select>
                        </div>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <div
                        class="row"
                        style={{
                          padding: "0.75rem 0.75rem 0 0",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          class="btn btn-light"
                          data-dismiss="modal"
                          style={{
                            marginRight: "1rem",
                            width: "auto",
                          }}
                        >
                          Close
                        </button>
                        {enableButton === false ? (
                          <button
                            type="submit"
                            class="btn save "
                            onClick={scrollToTop}
                            style={{
                              width: "auto",
                            }}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            type="submit"
                            class="btn  save-enable"
                            data-dismiss="modal"
                            onClick={(e) => {
                              mode === "add" ? handleSubmit(e) : handleEdit();
                            }}
                            style={{
                              width: "auto",
                            }}
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12 form-field">
              <table className="w-100 table-bordered  table mt-2">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>NHS Number</th>
                    <th>DOB</th>
                    <th>Service</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((patient) => {
                      if (
                        patient.firstName
                          ?.toLowerCase()
                          .includes(searchPatient) ||
                        patient.lastName
                          ?.toLowerCase()
                          .includes(searchPatient) ||
                        patient.middleName
                          ?.toLowerCase()
                          .includes(searchPatient) ||
                        patient.nhsNumber?.toLowerCase().includes(searchPatient)
                      )
                        return patient;
                    })

                    .map((patient) => (
                      <>
                        <tr key={patient.id}>
                          <td>
                            {patient?.firstName + " " + patient?.lastName}
                          </td>
                          <td>{patient.nhsNumber}</td>
                          <td>{patient.dateOfBirth}</td>
                          <td>{patient.service}</td>
                          <td>
                            <button
                              className="btn btn-sm  view    me-1 "
                              data-toggle="modal"
                              data-target="#ViewPatientModalCenter"
                              onClick={() => {
                                setOpen(true);
                                setViewId(patient.id);
                              }}
                            >
                              <span>View</span>{" "}
                            </button>

                            <button
                              className="btn btn-sm update "
                              onClick={() => {
                                setSM(patient);
                                selectPatient(patient);
                                setMode("edit");
                                setCM1(true);
                              }}
                            >
                              <span>Edit</span>
                            </button>

                            <button
                              className="btn btn-sm delete ms-2"
                              onClick={() => {
                                setSM(patient);
                                setCM2(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>

            {confirmationModal1 && (
              <ConfirmationModal
                action={() => {}}
                handleClose={() => {
                  setCM1(false);
                }}
                toggleId={"#patientModalCenter"}
              />
            )}

            {confirmationModal2 && (
              <ConfirmationModal
                action={handleDelete}
                handleClose={() => {
                  setSM({});
                  setCM2(false);
                }}
              />
            )}

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnHover
              theme="dark"
            />
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
                Patient Details
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
            <div class="modal-body modal-scroll">
              <div className="row">
                <div className="col-md-6"></div>
                {patients
                  .filter((patient) => {
                    if (patient.id === viewId) {
                      return patient;
                    }
                  })

                  .map((patient) => (
                    <>
                      <h3 className="heading-color">Personal Information</h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1 ">
                          <LuSubtitles className="me-1" size={20} />
                          <span className="fw-bold">Title:</span>{" "}
                          {patient?.title}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">NHS Number: </span>{" "}
                          {patient?.nhsNumber}
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">First Name: </span>{" "}
                          {patient?.firstName}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Gender: </span>{" "}
                          {patient?.gender}
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Middle Name: </span>{" "}
                          {patient?.middleName}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Date of Birth: </span>{" "}
                          {patient?.dateOfBirth}
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Surname: </span>{" "}
                          {patient?.lastName}
                        </div>
                      </div>

                      <h3 className="mt-4 heading-color">
                        Contact Information
                      </h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Display Name:</span>{" "}
                          {patient?.displayName}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Mobile No:</span>{" "}
                          {patient?.mobileNo}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Email:</span>{" "}
                          {patient?.email}
                        </div>

                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">
                            Alternative Contact No:
                          </span>{" "}
                          {patient?.alternativeContactNo}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Landline No:</span>{" "}
                          {patient?.landlineNo}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Dependent Contact No:</span>{" "}
                          {patient?.dependentContactNo}
                        </div>
                      </div>

                      <h3 className="mt-4 heading-color">
                        Address Information
                      </h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Address Line 1:</span>{" "}
                          {patient?.addressLine1}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Address Line 2:</span>{" "}
                          {patient?.addressLine12}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Town Name:</span>{" "}
                          {patient?.townName}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Post Code:</span>{" "}
                          {patient?.postCode}
                        </div>
                      </div>

                      <h3 className="mt-4 heading-color">
                        Service Information
                      </h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Service Type:</span>{" "}
                          {patient?.service}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Repeat Cycle:</span>{" "}
                          {patient?.repeatCycle}
                        </div>
                      </div>

                      <h3 className="mt-4 heading-color">
                        Delivery Information
                      </h3>
                      <div className="row ms-1">
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">
                            Prefered contact type:
                          </span>{" "}
                          {patient?.preferredContactType}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Nursing Home:</span>{" "}
                          {patient?.nursingHome}
                        </div>
                        <div className="col-md-6 mt-1">
                          <span className="fw-bold">Route:</span>{" "}
                          {patient?.route}
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

export default CreatePatient;
