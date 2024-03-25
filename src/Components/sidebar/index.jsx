import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";

import "./sidebar.css";
import { Outlet } from "react-router-dom";
import NavBar from "../Navbar";
function SideBar() {
  const [expandCreated, setEC] = useState(false);
  const [expandTracker, setET] = useState(false);
  const [expandReports, setER] = useState(false);
  const [expandCollections, setECol] = useState(false);
  const [expandMDS, setEMDS] = useState(false);
  const [expandApointments, setAppoinments] = useState(false);

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <div className="sidebar-main">
        <div>
          <img src="White.png" className="sidebar-logo mt-3"></img>
        </div>
        <ul className="sidebar-ul ps-3 pe-3 pt-4">
          <li>
            <NavLink to="/dashboard" activeClassName="active">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <div
              className="w-100"
              onClick={() => {
                setEC(!expandCreated);
                setECol(false);
                setEMDS(false);
                setER(false);
                setET(false);
                setAppoinments(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas fa-plus nav-item"></i>
                <span className="nav-item">Create</span>
              </span>
              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandCreated ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink
                      className="nav-item"
                      activeClassName="active"
                      to="/createpatient"
                    >
                      Patient
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/createMember"
                      activeClassName="active"
                    >
                      Pharmacy Member/Driver
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/createRoutes"
                      activeClassName="active"
                    >
                      Routes
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/createVehicle"
                      activeClassName="active"
                    >
                      Vehicle
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/shelves"
                      activeClassName="active"
                    >
                      Shelves
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <NavLink to="/patients" activeClassName="active">
              <i className="fas fa-users"></i> Patients
            </NavLink>
          </li>
          <li>
            <div
              className="w-100"
              onClick={() => {
                setET(!expandTracker);
                setECol(false);
                setEMDS(false);
                setER(false);
                setEC(false);
                setAppoinments(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas nav-item fa-truck"></i>
                <span className="nav-item">Deliveries</span>
              </span>
              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandTracker ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/createDelivery"
                      activeClassName="active"
                    >
                      Add Delivery
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/deliveryhistory"
                      activeClassName="active"
                    >
                      Track Delivery
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/allreports"
                      activeClassName="active"
                    >
                      Report
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>

          <li>
            <div
              className="w-100"
              onClick={() => {
                setECol(!expandCollections);
                setEMDS(false);
                setER(false);
                setET(false);
                setEC(false);
                setAppoinments(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas fa-book nav-item"></i>
                <span className="nav-item">Collections</span>
              </span>

              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandCollections ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/collection"
                      activeClassName="active"
                    >
                      Rx Storage
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/handouts"
                      activeClassName="active"
                    >
                      Handouts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/collectionreports"
                      activeClassName="active"
                    >
                      Report
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <div
              className="w-100"
              onClick={() => {
                setEMDS(!expandMDS);
                setECol(false);
                setER(false);
                setET(false);
                setEC(false);
                setAppoinments(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas fa-square nav-item"></i>
                <span className="nav-item">MDS</span>
              </span>
              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandMDS ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/mdsedit"
                      activeClassName="active"
                    >
                      Update Rx
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/mdslanding"
                      activeClassName="active"
                    >
                      MDS Reports
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <NavLink to="/carehomes" activeClassName="active">
              <i className="fas fa-home"></i> Care Home
            </NavLink>
          </li>

          <li>
            <div
              className="w-100"
              onClick={() => {
                setER(false);
                setECol(false);
                setEMDS(false);
                setET(false);
                setEC(false);
                setAppoinments(!expandApointments);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas fa-file nav-item"></i>
                <span className="nav-item">Appointments Management</span>
              </span>
              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandApointments ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink to="/createAppointment" activeClassName="active">
                      <i className="fas fa-solid fa-book"></i>Appointments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/bookAppointment" activeClassName="active">
                      <i className="fas fa-solid fa-book"></i> Book Appointment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/viewAppointment" activeClassName="active">
                      <i className="fas fa-solid fa-book"></i> View Appointments
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>
          <li>
            <div
              className="w-100"
              onClick={() => {
                setER(!expandReports);
                setECol(false);
                setEMDS(false);
                setET(false);
                setEC(false);
                setAppoinments(false);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "0.75rem",
              }}
            >
              <span>
                <i className="fas fa-file nav-item"></i>
                <span className="nav-item">Reports</span>
              </span>
              <i className="fas fa-caret-down nav-item"></i>
            </div>
            {expandReports ? (
              <div>
                <ul className="sidebar-ul">
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/allreports"
                      activeClassName="active"
                    >
                      Delivery Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/collectionreports"
                      activeClassName="active"
                    >
                      Collection Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="nav-item"
                      to="/mdslanding"
                      activeClassName="active"
                    >
                      MDS Report
                    </NavLink>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </li>
        </ul>
      </div>
      <div
        className="outlet"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <NavBar />
          <div style={{ marginTop: "75px" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
