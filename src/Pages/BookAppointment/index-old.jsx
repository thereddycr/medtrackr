import React, { useEffect, useState, useRef } from "react";
import Axios from "../../Services/axios";
import { toast } from "react-toastify";
import "./BookAppointment.css";
const BookAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsPatient, setAppointmentsPatient] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchT] = useState("");
  const [selectedType, setST] = useState("");
  const [newBooking, setNB] = useState({});
  const [modal, setModal] = useState(false);
  const [slots, setSlots] = useState({});

  const handleInputChange = (e) => {
    if (e.target.name === "slot") setModal(true);
    if (e.target.name === "date") getSlots(e.target.value);
    console.log(e.target.value);
    setNB({ ...newBooking, [e.target.name]: e.target.value });
  };

  const getPatients = () => {
    Axios.get("/patient/getPatient")
      .then((res) => {
        setPatients(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getappointmentPatients = () => {
    Axios.get("/appointment/getAppointmentsAllPatient")
      .then((res) => {
        setAppointmentsPatient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAppointmentTypes = () => {
    Axios.get("/appointment/getAppointments")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        console.log("Error getting appointments: ", err);
      });
  };

  const getSlots = (inputDate) => {
    Axios.post("/appointment/getAppointmentsById", {
      appointmentId: selectedType,
    }).then((res) => {
      let dateSlots = res.data.Dates.filter((date) => {
        if (date.endDate.split("T")[0] === inputDate) return true;
        else return false;
      })[0];
      console.log("Filtered Slots: ", dateSlots);
      setSlots(dateSlots);
    });
  };

  const addBooking = () => {
    Axios.post("/appointment/assignAppointment", {
      timeSlotId: newBooking.slot,
      patientId: newBooking.patientId,
    })
      .then((res) => {
        toast.success("Booking added...", {
          position: "top-right",
        });
        setModal(false);
        setST("");
        setNB({});
      })
      .catch((err) => {
        toast.error("Error adding Booking", {
          position: "top-right",
        });
        console.log("Error adding booking: ", err);
      });
  };

  const add = () => {
    toast.success("Booking added...", {
      position: "top-right",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    getAppointmentTypes();
    getPatients();
    getappointmentPatients();
  }, []);

  return (
    <div className="main-wrapper">
      {/* <button onClick={add}>ajfka</button> */}
      <div className="container-fluid">
        <div className="card">
          {/* <div className="container"> */}
          <div className="page-heading">Book Appointment</div>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <select
                name="type"
                style={{ padding: "0.3rem" }}
                value={selectedType}
                onChange={(e) => {
                  setST(e.target.value);
                }}
              >
                <option value="">Select appointment</option>
                {appointments.map((appointment) => {
                  return (
                    <option value={appointment.id}>{appointment.name}</option>
                  );
                })}
              </select>
            </div>
            {selectedType !== "" ? (
              <>
                <div
                  className="col-xs-6 col-md-6"
                  style={{ marginTop: "0.75rem" }}
                >
                  <label>Appointment Date:</label>
                  <input
                    type="date"
                    name="date"
                    max="2100-10-29"
                    required
                    value={newBooking.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  className="col-xs-6 col-md-6"
                  style={{ marginTop: "0.75rem" }}
                >
                  <label>Select slot:</label>
                  <select
                    name="slot"
                    style={{ padding: "0.3rem" }}
                    value={newBooking.slot}
                    onChange={handleInputChange}
                  >
                    <option value="">Please select a slot</option>
                    {slots?.TimeSlots?.map((slot) => {
                      return (
                        <option value={slot.id}>
                          {slot.startTime} - {slot.endTime}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {/* </div> */}

          {/* <div className="container-fluid"> */}
          <h2>Appointments with Patients</h2>
          <table
            className="table table-bordered"
            style={{ width: "100% !important" }}
          >
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>NHS Number</th>
                <th>Time Slot</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsPatient.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td>{patient.nhsNumber}</td>
                  <td>
                    {patient.TimeSlotBookings.map((booking) => (
                      <div key={booking.id}>
                        {booking.TimeSlot
                          ? `${booking.TimeSlot.startTime} - ${booking.TimeSlot.endTime}`
                          : "No time slot available"}
                      </div>
                    ))}
                  </td>
                  <td>
                    {patient.TimeSlotBookings.map((booking) => (
                      <div key={booking.id}>
                        {booking.TimeSlot
                          ? formatDate(booking.TimeSlot.Date.startDate)
                          : "No time slot available"}
                      </div>
                    ))}
                  </td>
                  <td>
                    {patient.TimeSlotBookings.map((booking) => (
                      <div key={booking.id}>
                        {booking.TimeSlot
                          ? formatDate(booking.TimeSlot.Date.endDate)
                          : "No time slot available"}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* </div> */}
        </div>
      </div>
      {modal ? (
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
              width: "550px",
              height: "auto",
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "1rem",
            }}
          >
            <h4>Select Patient</h4>
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <label>Name:</label>
                {/* <input
										type="text"
										name="name"
										required
										value={searchText}
										onChange={(e) => {
											setSearchT(e.target.value);
										}}
									/> */}
                <select
                  name="patientId"
                  style={{ padding: "0.3rem", marginTop: "1rem" }}
                  value={newBooking.patientId}
                  onChange={handleInputChange}
                >
                  <option value="">Please select a patient</option>
                  {patients
                    .filter(
                      (patient) =>
                        patient.firstName.includes(searchText) ||
                        patient.middleName.includes(searchText)
                    )
                    .map((patient) => {
                      return (
                        <option value={patient.id}>
                          {patient.firstName + " " + patient.middleName}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <span>
                <button
                  className="btn btn-dark"
                  style={{ width: "100px" }}
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  Close
                </button>
              </span>
              <span>
                <button
                  className="btn btn-light"
                  style={{ marginLeft: "1rem", width: "150px" }}
                  onClick={() => {
                    addBooking();
                  }}
                >
                  Add Booking
                </button>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BookAppointment;
