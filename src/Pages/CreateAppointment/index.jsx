import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import ConfirmationModal from "../../Components/confirmationModal";

const Appointment = () => {
  const slot = {
    startTime: "",
    endTime: "",
  };

  const dummy = [
    {
      id: 1,
      name: "Fly Job",
      slotDuration: 10,
      capacity: 3,
      startDate: "2024-03-16",
      endDate: "2024-04-16",
      slots: [
        { startTime: "10:00", endTime: "12:00" },
        { startTime: "14:00", endTime: "16:00" },
      ],
      status: "active",
    },
    {
      id: 2,
      name: "Cancer",
      slotDuration: 15,
      capacity: 3,
      startDate: "2024-04-16",
      endDate: "2024-05-16",
      slots: [{ startTime: "18:00", endTime: "23:00" }],
      status: "active",
    },
    {
      id: 3,
      name: "Carona",
      slotDuration: 20,
      capacity: 3,
      startDate: "2024-05-16",
      endDate: "2024-06-16",
      slots: [{ startTime: "01:00", endTime: "17:00" }],
      status: "active",
    },
    {
      id: 4,
      name: "Dengue",
      slotDuration: 30,
      capacity: 3,
      startDate: "2024-06-16",
      endDate: "2024-07-16",
      slots: [{ startTime: "05:00", endTime: "19:00" }],
      status: "active",
    },
  ];

  const formInitialState = {
    name: "",
    slotDuration: 0,
    startDate: "",
    endDate: "",
    slots: [slot],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNA] = useState(formInitialState);
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedRow, setIsSelectedRow] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If the input name is "slotDuration", parse the value to a number
    const parsedValue = name === "slotDuration" ? parseInt(value) : value;

    // If the input name is "startDate" or "endDate", convert the value to a Date object
    const dateValue = ["startDate", "endDate"].includes(name)
      ? new Date(value)
      : null;

    // Check if the end date is earlier than or equal to the start date
    if (name === "endDate" && dateValue <= new Date(newAppointment.startDate)) {
      toast.error("End date cannot be earlier than or equal to start date.", {
        position: "top-right",
      });
      return; // Prevent updating state if end date is invalid
    }

    setNA({ ...newAppointment, [name]: parsedValue });
  };

  // Function to save appointments to AsyncStorage
  const saveAppointmentsToStorage = async (appointments) => {
    try {
      await AsyncStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  // Function to retrieve appointments from AsyncStorage
  const getAppointmentsFromStorage = async () => {
    try {
      const appointmentsJSON = await AsyncStorage.getItem("appointments");
      return appointmentsJSON != null ? JSON.parse(appointmentsJSON) : [];
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return [];
    }
  };

  // Function to add a new appointment
  const addNewAppointment = async (e) => {
    e.preventDefault();
    if (
      !newAppointment.name ||
      !newAppointment.startDate ||
      !newAppointment.endDate ||
      !newAppointment.slots.some((slot) => slot.startTime && slot.endTime) ||
      newAppointment.slotDuration < 10 ||
      newAppointment.slotDuration > 60
    ) {
      // Display warning message for missing required fields
      toast.warning(
        "Please fill in all required fields and ensure the slot duration is between 10 and 60.",
        { position: "top-right" }
      );
      return; // Prevent appointment creation
    }

    // Generate a unique ID for the new appointment
    const newId =
      appointments.length > 0
        ? appointments[appointments.length - 1].id + 1
        : 1;
    const newAppointmentWithId = { ...newAppointment, id: newId };
    const updatedAppointments = [...appointments, newAppointmentWithId];
    setAppointments(updatedAppointments);
    setModal(false);
    toast.success("Appointment Added Successfully", { position: "top-right" });
    // Save appointments to AsyncStorage after adding
    await saveAppointmentsToStorage(updatedAppointments);
    setIsLoading(false);
  };

  // Function to retrieve appointments when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const storedAppointments = await getAppointmentsFromStorage();
      if (storedAppointments.length > 0) {
        setAppointments(storedAppointments);
      } else {
        // If no appointments found in AsyncStorage, use dummy data
        setAppointments(dummy);
        await saveAppointmentsToStorage(dummy);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (
      !newAppointment.name ||
      !newAppointment.startDate ||
      !newAppointment.endDate ||
      !newAppointment.slots.some((slot) => slot.startTime && slot.endTime) ||
      newAppointment.slotDuration < 10 ||
      newAppointment.slotDuration > 60
    ) {
      // Display warning message for missing required fields
      toast.warning(
        "Please fill in all required fields and ensure the slot duration is between 10 and 60.",
        { position: "top-right" }
      );
      return; // Prevent appointment update
    }

    if (
      new Date(newAppointment.startDate) >= new Date(newAppointment.endDate)
    ) {
      toast.warning("Start date must be earlier than end date.", {
        position: "top-right",
      });
      alert();
      return;
    }

    const editedAppointments = appointments.map((appointment) => {
      if (appointment.id === selectedRow.id) {
        return {
          ...appointment,
          name: newAppointment.name,
          slotDuration: newAppointment.slotDuration,
          startDate: newAppointment.startDate,
          endDate: newAppointment.endDate,
          slots: newAppointment.slots,
        };
      }
      return appointment;
    });

    // Update appointments state
    setAppointments(editedAppointments);

    // Save updated appointments to AsyncStorage
    await saveAppointmentsToStorage(editedAppointments);

    toast.success("Appointment Edited Successfully", { position: "top-right" });
    setModal(false); // Close the modal after editing
  };

  const handleDelete = async () => {
    // Filter out the appointment to be deleted
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== selectedRow.id
    );

    // Update appointments state
    setAppointments(updatedAppointments);

    // Save updated appointments to AsyncStorage
    await saveAppointmentsToStorage(updatedAppointments);

    // Display success message
    toast.success("Appointment Deleted Successfully", {
      position: "top-right",
    });

    // Close the confirmation modal
    setConfirmationModal(false);
  };

  const addSlot = () => {
    var updatedSlots = newAppointment.slots;
    updatedSlots.push(slot);
    setNA({ ...newAppointment, slots: updatedSlots });
  };

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

  const formatTime = (time) => {
    // Split the time string into hours, minutes, and AM/PM
    const [timePart, ampm] = time.split(" ");
    // Split the time into hours and minutes
    const [hours, minutes] = timePart.split(":");
    // Convert hours to 24-hour format if it's PM
    const formattedHours = ampm === "PM" ? parseInt(hours, 10) + 12 : hours;
    // Return the time in "HH:mm" format
    return `${formattedHours}:${minutes}`;
  };

  const handleSlotUpdate = (e, index) => {
    const { name, value } = e.target;
    const updatedSlots = [...newAppointment.slots]; // Create a copy of the slots array

    // Update the specific slot's start or end time based on the input name
    updatedSlots[index] = {
      ...updatedSlots[index],
      [name]: value,
    };

    // Ensure the end time is after the start time
    if (name === "startTime") {
      const startTime = value;
      const endTime = updatedSlots[index].endTime;

      // Check if the end time is before the start time, if yes, adjust it
      if (endTime <= startTime) {
        // Assuming the slot duration is always in minutes
        const newEndTime = new Date(value);
        newEndTime.setMinutes(
          newEndTime.getMinutes() + newAppointment.slotDuration
        );
        updatedSlots[index] = {
          ...updatedSlots[index],
          endTime: newEndTime.toTimeString().slice(0, 5), // Format the time to HH:MM
        };
      }
    }

    // Update the state with the updated slots array
    setNA({ ...newAppointment, slots: updatedSlots });
  };

  const getAppointments = () => {
    setAppointments(dummy);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getAppointments();
  }, []);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const openModal = (mode, appointment) => {
    if (mode === "edit") {
      setNA({
        name: appointment.name,
        slotDuration: appointment.slotDuration,
        startDate: appointment.startDate,
        endDate: appointment.endDate,
        slots: appointment?.slots?.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });
    } else {
      setNA(formInitialState);
    }

    setModal(true);
    setMode(mode);
    setIsSelectedRow(appointment);
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        {isLoading ? (
          // Render a loading screen with a loading spinner when isLoading is true
          <div
            className="loading-screen"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <ClipLoader
              css={override}
              size={50}
              color={"#123abc"}
              loading={isLoading}
            />
          </div>
        ) : (
          <div className="card">
            <div className="page-heading">Appointments</div>
            <div className="row">
              <div className="col-xs-12">
                <button
                  className="btn add"
                  onClick={() => {
                    setNA(formInitialState);
                    setMode("add");
                    setModal(true);
                  }}
                >
                  + Create
                </button>
              </div>
              <div className="col-xs-12" style={{ marginTop: "1rem" }}>
                <table className="table table-bordered w-100">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Per Slot Time (in Minutes)</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.name}</td>
                        <td>{appointment.slotDuration}</td>
                        <td>{formatDate(appointment.startDate)}</td>
                        <td>{formatDate(appointment.endDate)}</td>
                        <td>
                          <span>
                            <div
                              style={{
                                backgroundColor: "green",
                                borderRadius: "5px",
                                padding: "5px",
                                display: "inline-block",
                                color: "white",
                                fontSize: "80%",
                              }}
                            >
                              Active
                            </div>
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm update "
                            onClick={() => {
                              openModal("edit", appointment);
                              setIsSelectedRow(appointment);
                              setMode("edit");
                            }}
                          >
                            <span>Edit</span>
                          </button>

                          <button
                            className="btn btn-sm delete ms-2"
                            onClick={() => {
                              setIsSelectedRow(appointment);
                              setConfirmationModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {confirmationModal && (
              <ConfirmationModal
                action={handleDelete}
                handleClose={() => {
                  setIsSelectedRow({});
                  setConfirmationModal(false);
                }}
              />
            )}
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
                  <h4>{mode === "add" ? "Add" : "Edit"} Appointment</h4>
                  <div className="row">
                    <div className="col-xs-6 col-md-6">
                      <label>
                        <span className="me-1" style={{ color: "red" }}>
                          *
                        </span>
                        Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={newAppointment.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-xs-6 col-md-6">
                      <label>
                        <span className="me-1" style={{ color: "red" }}>
                          *
                        </span>
                        Time of Slot (in mins):
                      </label>
                      <input
                        type="number"
                        name="slotDuration"
                        required
                        value={newAppointment.slotDuration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-xs-6 col-md-6">
                      <label>
                        <span className="me-1" style={{ color: "red" }}>
                          *
                        </span>
                        StartDate:
                      </label>
                      <input
                        type="date"
                        max="2100-10-29"
                        name="startDate"
                        required
                        value={newAppointment.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-xs-6 col-md-6">
                      <label>
                        <span className="me-1" style={{ color: "red" }}>
                          *
                        </span>
                        EndDate:
                      </label>
                      <input
                        type="date"
                        max="2100-10-29"
                        name="endDate"
                        required
                        value={newAppointment.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-xs-12 col-md-12">
                    <button
                      className="btn add btn-sm"
                      style={{ margin: "0.75rem 0" }}
                      onClick={() => {
                        addSlot();
                      }}
                    >
                      Add Slot
                    </button>
                  </div>
                  <div
                    className="row"
                    style={{ display: "flex", alignItems: "end" }}
                  >
                    {newAppointment?.slots?.map((slot, index) => {
                      return (
                        <>
                          <div className="col-xs-5 col-md-5">
                            <label>StartTime:</label>
                            <input
                              type="time"
                              name="startTime"
                              required
                              value={formatTime(slot.startTime)}
                              onChange={(e) => {
                                handleSlotUpdate(e, index);
                              }}
                            />
                          </div>
                          <div className="col-xs-5 col-md-5">
                            <label>EndTime:</label>
                            <input
                              type="time"
                              name="endTime"
                              required
                              value={formatTime(slot.endTime)}
                              onChange={(e) => {
                                const newEndTime = e.target.value;
                                if (newEndTime > slot.startTime) {
                                  handleSlotUpdate(e, index);
                                } else {
                                  toast.error(
                                    "End time cannot be earlier than or equal to start time.",
                                    {
                                      position: "top-right",
                                    }
                                  );
                                }
                              }}
                            />
                          </div>
                          <div className="col-xs-2 col-md-2">
                            <button
                              className="btn btn-sm delete"
                              onClick={() => {
                                let oldSlots = newAppointment.slots;
                                oldSlots.splice(index, 1);
                                setNA({ ...newAppointment, slots: oldSlots });
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      );
                    })}
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
                        className="btn btn-light"
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
                        className="btn save"
                        style={{ marginLeft: "1rem", width: "100px" }}
                        onClick={(e) => {
                          mode === "add" ? addNewAppointment(e) : handleEdit(e);
                        }}
                      >
                        {mode === "add" ? "Create" : "Update"}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
