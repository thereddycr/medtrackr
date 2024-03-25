import React, { useEffect, useState } from "react";
import axios from "axios";
import "./createroutes.css";
import Axios from "../../Services/axios";
import ConfirmationModal from "../../Components/confirmationModal";
import { toast } from "react-toastify";

function CreateRoutes() {
  const [routes, setRoutes] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedRoute, setSR] = useState({});
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [assignedDriverId, setAssignedDriverId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [confirmationModal1, setCM1] = useState(false);
  const [confirmationModal2, setCM2] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState("");

  // Fetch drivers when the component mounts
  useEffect(() => {
    fetchDrivers();
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        "https://app.medtrakr.com/routes/routes"
      );
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        "https://app.medtrakr.com/users/getDrivers"
      );
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleRouteNameChange = (e) => {
    setRouteName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleIsActiveChange = (e) => {
    setIsActive(e.target.checked);
  };

  const handleAssignedDriverChange = (e) => {
    setAssignedDriverId(e.target.value);
  };

  const handleSave = async () => {
    console.log("Saving route");
    try {
      const newRoute = {
        name: routeName,
        description: description,
        activeStatus: isActive,
        assignedDriverId: assignedDriverId ? assignedDriverId : null,
      };

      await axios.post("https://app.medtrakr.com/routes/routes", newRoute);
      fetchRoutes();
      setRouteName("");
      setDescription("");
      toast.success("Route Saved Successfully", { position: "top-right" });
      setIsActive(false);
      setAssignedDriverId("");
    } catch (error) {
      toast.error("Route Creation Failed", { position: "top-right" });
      console.error("Error creating route:", error);
    }
  };

  const handleEditSave = () => {
    Axios.put("/routes/routes/" + selectedRoute.id, {
      name: routeName,
      description: description,
      activeStatus: isActive,
      assignedDriverId: assignedDriverId ? assignedDriverId : null,
    })
      .then((res) => {
        toast.success("Route Updated Successfully", { position: "top-right" });
        fetchRoutes();
        setRouteName("");
        setDescription("");
        setIsActive(false);
        setMode("add");
        setAssignedDriverId("");
      })
      .catch((err) => {
        toast.error("Route Updating Failed", { position: "top-right" });
        console.log("Error: ", err);
      });
  };

  const handleEdit = () => {
    setRouteName(selectedRoute.name);
    setDescription(selectedRoute.description);
    setIsActive(selectedRoute.activeStatus);
    setAssignedDriverId(selectedRoute.assignedDriverId);
  };

  const handleDelete = () => {
    Axios.delete("/routes/routes/" + selectedRoute.id).then((res) => {
      toast.success("Route Deleted Successfully", { position: "top-right" });
      setSR({});
      fetchRoutes();
    });
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="container-fluid">
          <div className="card">
            {/* <div className="col-xs-12 page-heading">Create Route</div> */}
            <div className="col-xs-12" style={{ margin: "1rem" }}>
              <button
                type="button"
                class="btn add "
                data-toggle="modal"
                data-target="#routeModalCenter"
              >
                Create Route
              </button>
            </div>
            <div className="card-body">
              <div
                class="modal fade"
                id="routeModalCenter"
                tabindex="-1"
                role="dialog"
                aria-labelledby="routeModalCenterTitle"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">
                        Create a route
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
                    <div class="modal-body row">
                      <div className="col-md-6">
                        <div>
                          <label htmlFor="routeName">Route Name:</label>
                          <input
                            type="text"
                            id="routeName"
                            required
                            value={routeName}
                            onChange={handleRouteNameChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <label htmlFor="description">Description:</label>
                          <input
                            type="text"
                            id="description"
                            required
                            value={description}
                            onChange={handleDescriptionChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 pt-3">
                        <div className="">
                          <label htmlFor="assignedDriver">
                            Assigned Driver:
                          </label>
                          <select
                            id="assignedDriver"
                            value={assignedDriverId}
                            required
                            onChange={handleAssignedDriverChange}
                            style={{ padding: "0.4rem" }}
                          >
                            <option value="">Select a driver</option>
                            {drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 pt-3">
                        <label>Status</label>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: "0.75rem",
                            }}
                          >
                            <label>Active:</label>
                            <input
                              class="form-check-input"
                              style={{ margin: "0 0 0.25rem 0.75rem" }}
                              type="checkbox"
                              id="flexCheckDefault"
                              value={isActive}
                              onChange={handleIsActiveChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-light"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      {mode === "add" ? (
                        <button
                          type="button"
                          class="btn  save"
                          data-dismiss="modal"
                          onClick={handleSave}
                        >
                          Create
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="btn btn-dark"
                          data-dismiss="modal"
                          onClick={handleEditSave}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="modal fade"
                id="routeDetailsModalCenter"
                tabindex="-1"
                role="dialog"
                aria-labelledby="routeDetailsModalCenterTitle"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLongTitle">
                        Route Details
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
                    <div class="modal-body row">
                      <div className="col-md-6">
                        <div>
                          <label htmlFor="routeName">Route Name:</label>
                          <span>{selectedRoute.name}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <label htmlFor="description">Description:</label>
                          <span>{selectedRoute.description}</span>
                        </div>
                      </div>
                      <div className="col-md-6 pt-3">
                        <div className="">
                          <label htmlFor="assignedDriver">
                            Assigned Driver:
                          </label>
                          <span>{selectedRoute.assignedDriverId}</span>
                        </div>
                      </div>
                      <div className="col-md-6 pt-3">
                        <label>Status</label>
                        <span>
                          {selectedRoute.activeStatus ? "true" : "false"}
                        </span>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-light"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <table className="table w-100 table-bordered ms-3">
                  <thead>
                    <tr>
                      <th>Route Name</th>
                      <th>Description</th>
                      <th>Active</th>
                      <th>Assigned Driver</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, index) => {
                      var driver = drivers.filter(
                        (driver) => driver.id === route?.assignedDriverId
                      )[0];
                      return (
                        <tr key={index}>
                          <td
                            data-toggle="modal"
                            data-target="#routeDetailsModalCenter"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSR(route);
                            }}
                          >
                            {route.name}
                          </td>
                          <td
                            data-toggle="modal"
                            data-target="#routeDetailsModalCenter"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSR(route);
                            }}
                          >
                            {route.description}
                          </td>
                          <td
                            data-toggle="modal"
                            data-target="#routeDetailsModalCenter"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSR(route);
                            }}
                          >
                            {route.activeStatus ? "Yes" : "No"}
                          </td>
                          <td
                            data-toggle="modal"
                            data-target="#routeDetailsModalCenter"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSR(route);
                            }}
                          >
                            {driver ? driver?.name + " " + driver?.surname : ""}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm  view    me-1 "
                              data-toggle="modal"
                              data-target="#ViewPatientModalCenter"
                              onClick={() => {
                                setOpen(true);
                                setViewId(route.id);
                              }}
                            >
                              <span>View</span>{" "}
                            </button>
                            <button
                              className="btn update btn-sm"
                              // data-toggle="modal"
                              // data-target="#routeModalCenter"
                              onClick={() => {
                                setMode("edit");
                                setSR(route);
                                setCM1(true);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn delete btn-sm ms-2"
                              onClick={() => {
                                setSR(route);
                                setCM2(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {confirmationModal1 && (
            <ConfirmationModal
              action={handleEdit}
              handleClose={() => {
                setCM1(false);
              }}
              toggleId={"#routeModalCenter"}
            />
          )}
          {confirmationModal2 && (
            <ConfirmationModal
              action={handleDelete}
              handleClose={() => {
                setSR({});
                setCM2(false);
              }}
            />
          )}
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
                Routes Details
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
            <div class="modal-body">
                                     {routes.filter((route) => {
                    if (route.id === viewId) {
                      return route;
                    }
                  }).map((route, index) => {

                                 
                      var driver = drivers.filter(
                        (driver) => driver.id === route?.assignedDriverId  
                      )[0];
                      return (
						<>						<h3 className="heading-color">Route Information</h3>
						<div className="row ms-1">
                        <div className="col-md-12 mt-1 ">
                          
                          <span className="fw-bold">Route Name:</span>{" "}
						  {route.name}
                          
                        </div>
                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Description: </span>{" "}
						  {route.description}
                        </div>

                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Active: </span>{" "}
						  {route.activeStatus ? "Yes" : "No"}
                          
                        </div>
                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Assigned Driver: </span>{" "}
						  {driver ? driver?.name + " " + driver?.surname : ""}
                        </div>                        
                      </div>
					  </>
                      );
                    })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRoutes;


{/* <h3 className="heading-color">Route Information</h3>
                      <div className="row ms-1">
                        <div className="col-md-12 mt-1 ">
                          
                          <span className="fw-bold">Route Name:</span>{" "}
						  {route.name}
                          
                        </div>
                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Description: </span>{" "}
						  {route.description}
                        </div>

                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Active: </span>{" "}
						  {route.activeStatus ? "Yes" : "No"}
                          
                        </div>
                        <div className="col-md-12 mt-1">
                          <span className="fw-bold">Assigned Driver: </span>{" "}
                        </div>                        
                      </div> */}