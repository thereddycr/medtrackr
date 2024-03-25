import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClipLoader } from "react-spinners";
import { FaArrowRight, FaRegCircle } from "react-icons/fa";
import Calendar from "react-calendar";
import { css } from "@emotion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./BookAppointment.css";
import "react-calendar/dist/Calendar.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLocation = location?.state?.selectedAppointment;
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTS, setSelectedTS] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [details, setIsDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    isLocation ? isLocation?.selectedDate : selectedAppointment?.startDate
  );

  const [addNewCustomer, setIsAddNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    title: "",
    customername: "",
    dob: "",
    email: "",
    mobile: "",
    address: "",
    postCode: "",
    comment: "",
  });

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const dummyCustomers = [
    {
      id: 1,
      title: "ms",
      customername: "Emily Smith",
      dob: "12-12-1992",
      email: "emilysmith@example.com",
      mobile: "1122334455",
      address: "France",
      postCode: "34567",
      comment: "Bonjour!",
    },
    {
      id: 2,
      title: "ms",
      customername: "Jane Doe",
      dob: "15-09-1995",
      email: "janedoe@example.com",
      mobile: "1234567890",
      address: "USA",
      postCode: "12345",
      comment: "Nice to meet you!",
    },
    {
      id: 3,
      title: "mr",
      customername: "John Smith",
      dob: "20-07-1980",
      email: "johnsmith@example.com",
      mobile: "9876543210",
      address: "Canada",
      postCode: "ABCDE",
      comment: "Greetings!",
    },
    {
      id: 4,
      title: "mrs",
      customername: "Alice Johnson",
      dob: "25-03-1990",
      email: "alicejohnson@example.com",
      mobile: "4567891230",
      address: "UK",
      postCode: "67890",
      comment: "Welcome!",
    },
    {
      id: 5,
      title: "mr",
      customername: "Michael Brown",
      dob: "03-11-1985",
      email: "michaelbrown@example.com",
      mobile: "7418529630",
      address: "Australia",
      postCode: "54321",
      comment: "Good day!",
    },
  ];

  const saveCustomersToStorage = async (customers) => {
    try {
      await AsyncStorage.setItem("customersData", JSON.stringify(customers));
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const getCustomersFromStorage = async () => {
    try {
      const customerJSON = await AsyncStorage.getItem("customersData");
      return customerJSON != null ? JSON.parse(customerJSON) : [];
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLocation) {
          setSelectedAppointment(isLocation);
        }
        const appointmentsData = await AsyncStorage.getItem("appointments");
        if (appointmentsData !== null) {
          setAppointments(JSON.parse(appointmentsData));
        }
        if (selectedAppointment && selectedAppointment.startDate) {
          setSelectedDate(selectedAppointment.startDate);
        } else if (isLocation && isLocation?.selectedDate) {
          setSelectedDate(isLocation?.selectedDate);
        }
        const storedCustomers = await getCustomersFromStorage();
        if (storedCustomers.length > 0) {
          setCustomersData(storedCustomers);
        } else {
          setCustomersData(dummyCustomers);
          await saveCustomersToStorage(dummyCustomers);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting appointments from AsyncStorage:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    getBookings();
  }, [location.state]);

  const getBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem("bookings");
      if (storedBookings !== null) {
        setIsDetails(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Error getting bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBooking = async () => {
    if (!selectedAppointment || !selectedCustomer) {
      toast.error("Please select appointment and customer");
      return;
    }

    const bookingDetails = {
      ...selectedCustomer,
      name: selectedAppointment.name,
      slotDuration: selectedAppointment.slotDuration,
      capacity: selectedAppointment.capacity,
      slots: selectedAppointment.slots,
      startDate: selectedAppointment.startDate,
      endDate: selectedAppointment.endDate,
      status: selectedAppointment.status,
      timeSlot: selectedTS,
      selectedDate: formatDate(selectedDate || selectedAppointment?.startDate),
    };

    try {
      const existingBookings = await AsyncStorage.getItem("bookings");
      let bookings = [];

      if (existingBookings) {
        bookings = JSON.parse(existingBookings);
      }

      const isDuplicate = bookings.some((booking) => {
        const sameDate = booking.selectedDate === bookingDetails.selectedDate;
        const sameTimeSlot = booking.timeSlot === bookingDetails.timeSlot;
        const sameCustomer =
          booking.customername === bookingDetails.customername;
        const sameAppointment = booking.name === bookingDetails.name;

        if (sameDate && sameTimeSlot && sameCustomer && sameAppointment) {
          return true;
        }

        if (!sameDate && sameTimeSlot) {
          toast.error(
            "A booking with the same time slot already exists on a different date"
          );
          return false;
        }

        return false;
      });

      if (isDuplicate) {
        toast.error(
          "Booking already exists with this date, time slot, customer, and appointment"
        );
        return;
      }

      bookings.push(bookingDetails);

      await AsyncStorage.setItem("bookings", JSON.stringify(bookings));

      setIsDetails(bookings);

      setModal(false);
      setSelectedAppointment(null);
      setSelectedCustomer(null);
      setSearchText("");
      setSelectedTS("");

      toast.success("Booking added...", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      toast.error("Error adding booking", {
        position: "top-right",
      });
    }
  };

  const editBooking = async (timeSlot, selectedDate) => {
    try {
      if (!selectedAppointment || !selectedCustomer) {
        toast.error("Please select appointment and customer");
        return;
      }

      const updatedBookingDetails = {
        ...selectedCustomer,
        name: selectedAppointment.name,
        slotDuration: selectedAppointment.slotDuration,
        capacity: selectedAppointment.capacity,
        slots: selectedAppointment.slots,
        startDate: selectedAppointment.startDate,
        endDate: selectedAppointment.endDate,
        status: selectedAppointment.status,
        timeSlot: timeSlot,
        selectedDate: formatDate(
          selectedDate || selectedAppointment?.startDate
        ),
      };

      const existingBookings = await AsyncStorage.getItem("bookings");
      let bookings = [];
      if (existingBookings) {
        bookings = JSON.parse(existingBookings);
      }

      const updatedBookings = bookings.map((booking) =>
        booking.name === selectedAppointment.name
          ? updatedBookingDetails
          : booking
      );

      await AsyncStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setIsDetails(updatedBookings);
      navigate(-1);

      setModal(false);
      setSelectedAppointment(null);
      setSelectedCustomer(null);
      setSearchText("");
      setSelectedTS("");

      toast.success("Booking updated...", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error editing booking:", error);
      toast.error("Error editing booking", {
        position: "top-right",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const AppointmentScheduler = ({ selectedAppointment }) => {
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
      setTimeSlots(generateTimeSlots());
    }, [selectedAppointment]);

    const handleDateChange = (date) => {
      setSelectedDate(formatDate(date));
    };

    const generateTimeSlots = () => {
      const timeSlotsSet = new Set();

      selectedAppointment.slots.forEach((slot) => {
        const { startTime, endTime } = slot;
        let start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        while (start <= end) {
          const timeString = start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          timeSlotsSet.add(timeString);
          const clonedStart = new Date(start);
          clonedStart.setMinutes(
            clonedStart.getMinutes() + selectedAppointment.slotDuration
          );
          start = clonedStart;
        }
      });
      return Array.from(timeSlotsSet)?.map((time) => ({ time }));
    };

    const isSlotDisabled = (timeSlot) => {
      if (!timeSlot || !timeSlot.time) {
        return true;
      }

      return details.some(
        (booking) =>
          booking.selectedDate === formatDate(selectedDate) &&
          booking.timeSlot === timeSlot.time &&
          booking.name === selectedAppointment.name
      );
    };

    const handleSlotClick = (index, timeSlot) => {
      if (!isSlotDisabled(timeSlot)) {
        setSelectedTS(timeSlot.time);
        setModal(true);
      } else {
        console.log("Slot is already booked");
      }
    };

    const formatTimeTo12Hrs = (timeString) => {
      const time = new Date(`2000-01-01 ${timeString}`);
      return time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return (
      <div
        className="appointment-scheduler"
        style={{
          display: "flex",
        }}
      >
        <div
          className="calendar"
          style={{
            width: "50%",
          }}
        >
          <Calendar
            onChange={handleDateChange}
            value={selectedDate || new Date(selectedAppointment.startDate)}
            minDate={new Date(selectedAppointment.startDate)}
            maxDate={new Date(selectedAppointment.endDate)}
            defaultView="month"
            defaultValue={new Date(selectedAppointment.startDate)}
          />
        </div>
        <div
          style={{
            width: "50%",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "15px",
              marginBottom: "10px",
              backgroundColor: "#f0f0f0",
              padding: "7px",
            }}
          >
            {selectedDate || formatDate(new Date())}
          </div>
          {selectedDate !== "" &&
            selectedAppointment?.slots?.map((slot, index) => (
              <div key={index}>
                <div
                  key={index}
                  style={{
                    color: "gray",
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginBottom: "10px",
                    marginTop: index === 0 ? "0px" : "10px",
                  }}
                >
                  {`${formatTimeTo12Hrs(slot.startTime)} to ${formatTimeTo12Hrs(
                    slot.endTime
                  )}`}
                </div>

                <div
                  className="time-slots"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  {timeSlots?.map((timeSlot, i) => {
                    const slotTime = new Date(`2000-01-01 ${timeSlot.time}`);
                    const start = new Date(`2000-01-01 ${slot.startTime}`);
                    const end = new Date(`2000-01-01 ${slot.endTime}`);
                    const slotDisabled = isSlotDisabled(timeSlot);
                    if (slotTime >= start && slotTime <= end) {
                      return (
                        <div
                          key={i}
                          onClick={() => handleSlotClick(i, timeSlot)}
                          className={slotDisabled ? "disabled-slot" : ""}
                          style={{
                            cursor: slotDisabled ? "not-allowed" : "pointer",
                            border: "1px solid grey",
                            borderRadius: "5px",
                            padding: "5px",
                            backgroundColor: slotDisabled
                              ? "grey"
                              : timeSlot.time === selectedTS
                              ? "blue"
                              : "transparent",
                            color: slotDisabled
                              ? "white"
                              : timeSlot.time === selectedTS
                              ? "white"
                              : "black",
                            minWidth: "50px",
                            width: "100px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {timeSlot.time === selectedTS ? (
                              <FaArrowRight />
                            ) : (
                              <FaRegCircle />
                            )}
                          </span>
                          <span>{timeSlot.time}</span>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const handleAppointmentSelection = (name) => {
    if (isLocation) {
      return toast.error(
        "You cannot change the select type in this edit action",
        {
          position: "top-right",
        }
      );
    }
    const selected = appointments.find(
      (appointment) => appointment.name === name
    );
    setSelectedAppointment(selected);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (!addNewCustomer) {
      setSearchText(value);
      if (!showDropdown) setShowDropdown(true);
    } else {
      setNewCustomer((prevCustomer) => ({
        ...prevCustomer,
        [name]: value,
      }));
    }
  };

  const handleAddNewCustomer = async () => {
    try {
      const updatedCustomersData = [...customersData, newCustomer];
      setCustomersData(updatedCustomersData);
      await saveCustomersToStorage(updatedCustomersData);
      setSearchText(newCustomer.customername);
      setSelectedCustomer(newCustomer);

      setNewCustomer({
        title: "",
        customername: "",
        dob: "",
        email: "",
        mobile: "",
        address: "",
        postCode: "",
        comment: "",
      });
      setIsAddNewCustomer(false);
      toast.success("New customer added successfully.");
    } catch (error) {
      console.error("Error adding new customer:", error);
      toast.error("Failed to add new customer. Please try again.");
    }
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSearchText(customer.customername || "");
    setShowDropdown(false);
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        {isLoading ? (
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
            <div className="page-heading">Book Appointment</div>
            <div
              className="row"
              style={{
                gap: 10,
              }}
            >
              <div className="col-xs-12">
                <select
                  name="type"
                  value={
                    isLocation ? isLocation?.name : selectedAppointment?.name
                  }
                  onChange={(e) => handleAppointmentSelection(e.target.value)}
                >
                  <option value="">Select appointment</option>
                  {appointments?.map((appointment) => (
                    <option key={appointment.name} value={appointment.name}>
                      {appointment.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAppointment && (
                <AppointmentScheduler
                  selectedAppointment={selectedAppointment}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {modal ? (
        <div
          className="custom-modal"
          style={{
            transition: "ease",
            position: "fixed",
            bottom: 0,
            right: 0,
            top: addNewCustomer ? 40 : 0,
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
            <h4>Book Appointment @{selectedTS}</h4>
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <label>Customer</label>
                <div className="dropdown-container">
                  <input
                    type="search"
                    name="customername"
                    required
                    disabled={addNewCustomer}
                    value={searchText}
                    placeholder="Search Customer"
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{ marginRight: "5px" }}
                  />
                  <button
                    className="btn btn-light"
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={() => {
                      setIsAddNewCustomer(!addNewCustomer);
                    }}
                  >
                    {addNewCustomer ? "-" : "+"}
                  </button>
                  {showDropdown && (
                    <div className="dropdown-card">
                      {customersData
                        .filter((customer) =>
                          customer.customername
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                        )
                        .map((customer) => (
                          <div
                            key={customer.id}
                            className="dropdown-item"
                            onClick={() => handleCustomerClick(customer)}
                          >
                            {customer.customername}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {addNewCustomer && (
                  <>
                    <div className="row">
                      <div className="col-xs-6 col-md-6">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Enter Title"
                          required
                          value={newCustomer.title}
                          onChange={handleInputChange}
                          className="transparent-input"
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>
                          <span className="me-1" style={{ color: "red" }}>
                            *
                          </span>
                          Name
                        </label>
                        <input
                          type="text"
                          name="customername"
                          required
                          value={newCustomer.customername}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>
                          <span className="me-1" style={{ color: "red" }}>
                            *
                          </span>
                          DOB
                        </label>
                        <input
                          type="date"
                          max="2100-10-29"
                          name="dob"
                          required
                          value={newCustomer.dob}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={newCustomer.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>
                          <span className="me-1" style={{ color: "red" }}>
                            *
                          </span>
                          Mobile
                        </label>
                        <input
                          type="number"
                          name="mobile"
                          required
                          onKeyDown={(e) =>
                            ["e", "E", "+", "-"].includes(e.key) &&
                            e.preventDefault()
                          }
                          value={newCustomer.mobile}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "mobile",
                                value: value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>
                          <span className="me-1" style={{ color: "red" }}>
                            *
                          </span>
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={newCustomer.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>
                          <span className="me-1" style={{ color: "red" }}>
                            *
                          </span>
                          Post Code
                        </label>
                        <input
                          type="text"
                          name="postCode"
                          required
                          value={newCustomer.postCode}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 8);
                            handleInputChange({
                              target: {
                                name: "postCode",
                                value: value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="col-xs-6 col-md-6">
                        <label>Comment</label>
                        <input
                          type="text"
                          name="comment"
                          required
                          value={newCustomer.comment}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
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
                  className="btn btn-light"
                  style={{ width: "100px", border: "1px solid black" }}
                  onClick={() => {
                    setModal(false);
                    setSelectedCustomer(null);
                    setSearchText("");
                    setSelectedTS("");
                    setIsAddNewCustomer(false);
                    setNewCustomer({
                      title: "",
                      customername: "",
                      dob: "",
                      email: "",
                      mobile: "",
                      address: "",
                      postCode: "",
                      comment: "",
                    });
                  }}
                >
                  Close
                </button>
              </span>
              <span>
                <button
                  className="btn btn-dark"
                  style={{ marginLeft: "1rem", width: "150px" }}
                  onClick={() => {
                    if (addNewCustomer) {
                      handleAddNewCustomer();
                    } else if (isLocation) {
                      editBooking(selectedTS, selectedDate);
                    } else {
                      addBooking();
                    }
                  }}
                >
                  {addNewCustomer
                    ? "Add Customer"
                    : isLocation
                    ? "Update"
                    : "Submit"}
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
