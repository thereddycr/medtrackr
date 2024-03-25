import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { toast } from "react-toastify";
import "./ViewAppointment.css";
import ConfirmationModal from "../../Components/confirmationModal";

const ViewAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setIsDetails] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [customersData, setCustomersData] = useState([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRow, setIsSelectedRow] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const getCustomers = async () => {
    try {
      const storedCustomersData = await AsyncStorage.getItem("customersData");
      if (storedCustomersData) {
        setCustomersData(JSON.parse(storedCustomersData));
        setSelectedCustomer("All");
      }
    } catch (error) {
      console.error("Error retrieving customer data:", error);
    } finally {
      setIsCustomersLoading(false);
    }
  };

  // Function to save appointments to AsyncStorage
  const saveAppointmentsToStorage = async (appointments) => {
    try {
      await AsyncStorage.setItem("bookings", JSON.stringify(appointments));
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

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

  useEffect(() => {
    // Load customers and bookings
    const loadData = async () => {
      setIsLoading(true);
      setIsCustomersLoading(true);
      await Promise.all([getBookings(), getCustomers()]);
    };

    loadData();
  }, []);

  const handleDelete = async () => {
    const updatedAppointments = details.filter(
      (appointment) => appointment.id !== selectedRow.id
    );

    setIsDetails(updatedAppointments);

    await saveAppointmentsToStorage(updatedAppointments);

    toast.success("Appointment Deleted Successfully", {
      position: "top-right",
    });

    setConfirmationModal(false);
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer.customername || "");
    setShowDropdown(false);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        {isLoading || isCustomersLoading ? (
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
              loading={isLoading || isCustomersLoading}
            />
          </div>
        ) : (
          <div className="card">
            <div className="page-heading">View Appointment</div>
            <div className="row" style={{ gap: 10 }}>
              <div className="col-xs-12">
                <div className="dropdown-container">
                  <input
                    type="search"
                    name="customername"
                    required
                    value={selectedCustomer}
                    placeholder="Search Customer"
                    onChange={handleCustomerChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      marginRight: "5px",
                      width: "25%",
                      maxWidth: "250px",
                    }}
                  />
                  {showDropdown && (
                    <div className="dropdown-card">
                      <div
                        className="dropdown-item"
                        onClick={() =>
                          handleCustomerClick({ customername: "All" })
                        }
                      >
                        All
                      </div>
                      {customersData
                        .filter((customer) =>
                          customer.customername
                            .toLowerCase()
                            .includes(selectedCustomer.toLowerCase())
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
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <table
                className="table table-bordered"
                style={{ width: "100% !important" }}
              >
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Appointment</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    {/* <th>Comment</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {details
                    .filter((appointment) =>
                      selectedCustomer === "All"
                        ? true
                        : appointment.customername.toLowerCase() ===
                          selectedCustomer.toLowerCase()
                    )
                    .map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.customername}</td>
                        <td>{appointment.name}</td>
                        <td>{appointment.mobile}</td>
                        <td>{appointment.address}</td>
                        <td>{appointment.selectedDate}</td>
                        <td>{appointment.timeSlot}</td>
                        {/* <td>{appointment.comment}</td> */}
                        <td>
                          <button
                            className="btn btn-sm update "
                            onClick={() => {
                              setIsSelectedRow(appointment);
                              navigate(`/bookAppointment`, {
                                state: { selectedAppointment: appointment },
                              });
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

            {confirmationModal && (
              <ConfirmationModal
                action={handleDelete}
                handleClose={() => {
                  setIsSelectedRow({});
                  setConfirmationModal(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAppointment;
