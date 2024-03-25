import React, { useEffect, useState } from "react";
import "./CareHome.css";
import Axios from "../../Services/axios";
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
const defaultDetails = {
  name: "",
  address: "",
  postCode: "",
  Landline: "",
  mobile: "",
  note: "",
};
const defaultManager = {
  name: "",
  landline: "",
  mobile: "",
};
const defaultCarer = {
  name: "",
  landline: "",
  mobile: "",
};
const CareHome = () => {
  const [careHomes, setCH] = useState([]);
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
  const [viewId, setViewId] = useState("");
  const [newDetails, setND] = useState({});
  const [newManagerDetails, setMD] = useState({});
  const [newCarerDetails, setCD] = useState({});
  const [mode, setMode] = useState("add");
  const [careHoem, setCareHome] = useState([]);
  const [careHomeShow,setCareHomeShow]=useState(false);
  const componentRef1 = useRef();
  const handlePrint1 = useReactToPrint({
    content: () => componentRef1.current,
  });
  const componentRef2 = useRef();
  const handlePrint2 = useReactToPrint({
    content: () => componentRef2.current,
  });
  const handleSave = () => {
    if (
      !newDetails.name ||
      !newDetails.address ||
      (!newDetails.landline && !newDetails.mobile)
    ) {
      toast.warning('"Please provide a name, address, and at least one phone number (mobile or landline)."', {
        position: 'top-right',
        });
      return;
    }
    Axios.post("/carehome/createcarehome", {
      name: newDetails.name,
      address: newDetails.address,
      post_code: newDetails.postCode,
      Landline: newDetails.landline,
      mobile: newDetails.mobile,
      note: newDetails.note,
      manager_name: newManagerDetails.name,
      manager_landline: newManagerDetails.landline,
      manager_mobile: newManagerDetails.mobile,
      careDetails_name: newCarerDetails.name,
      careDetails_landline: newCarerDetails.landline,
      careDetails_mobile: newCarerDetails.mobile,
    })
      .then((res) => {
        toast.success('Care Home added...', {position: 'top-right',});
        setND(defaultDetails);
        setMD(defaultManager);
        setCD(defaultCarer);
        getCareHomes();
      })
      .catch((err) => {
        toast.error('Failed to add Care Home', {position: 'top-right',});
        setND(defaultDetails);
        setMD(defaultManager);
        setCD(defaultCarer);
        getCareHomes();
      });
  };

  const handleEdit = () => {
    Axios.put("/carehome/updatecarehome/" + newDetails.id, {
      name: newDetails.name,
      address: newDetails.address,
      post_code: newDetails.postCode,
      Landline: newDetails.landline,
      mobile: newDetails.mobile,
      note: newDetails.note,
      manager_name: newManagerDetails.name,
      manager_landline: newManagerDetails.landline,
      manager_mobile: newManagerDetails.mobile,
      careDetails_name: newCarerDetails.name,
      careDetails_landline: newCarerDetails.landline,
      careDetails_mobile: newCarerDetails.mobile,
    })
      .then((res) => {
        toast.success('Care Home Edited', {position: 'top-right',});
        setND(defaultDetails);
        setMD(defaultManager);
        setCD(defaultCarer);
        getCareHomes();
      })
      .catch((err) => {
        toast.error('Failed to Edit  Care Home', {position: 'top-right',});
        setND(defaultDetails);
        setMD(defaultManager);
        setCD(defaultCarer);
        setMode("add");
        getCareHomes();
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

  const deleteCareHome = (id) => {
    Axios.delete("/carehome/deletecarehome/" + id)
      .then((res) => {
        toast.success('Care Home Deleted', {position: 'top-right',});
        getCareHomes();
      })
      .catch((err) => {
        toast.error('Failed to Delete Care Home', {position: 'top-right',});
        console.log(err);
        getCareHomes();
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "landline" || e.target.name === "mobile") {
      if (e.target.value.length < 12) {
        setND({ ...newDetails, [e.target.name]: e.target.value });
      }
    } else setND({ ...newDetails, [e.target.name]: e.target.value });
  };

  const handleManagerChange = (e) => {
    if (e.target.name === "landline" || e.target.name === "mobile") {
      if (e.target.value.length < 12) {
        setMD({ ...newManagerDetails, [e.target.name]: e.target.value });
      }
    } else setMD({ ...newManagerDetails, [e.target.name]: e.target.value });
  };

  const handleCarerChange = (e) => {
    if (e.target.name === "landline" || e.target.name === "mobile") {
      if (e.target.value.length < 12) {
        setCD({ ...newCarerDetails, [e.target.name]: e.target.value });
      }
    } else setCD({ ...newCarerDetails, [e.target.name]: e.target.value });
  };
  const careHomeDetails = (careHome) => {
    console.log(careHome);

    Axios.get("/carehome/carehomePatients/" + careHome.id)
      .then((res) => {
        console.log(res.data);

        setCareHomeShow(true)

        setCareHome(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCareHomes();
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
  return (
    <>
     


      <div className="main-wrapper">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="page-holder">
                {/* <div className="page-heading">Care Homes</div> */}
                <div className="col-md-12 col-xs-12">
                  <button
                    className="btn add"
                    data-toggle="modal"
                    data-target="#carehomeModalCenter"
                    style={{ margin: "0 0 1rem 0" }}
                  >
                    Create Care Home
                  </button>

                 
                </div>
                 
                 <div className="col-md-12 col-xs-12 mb-2">
                 <button onClick={handlePrint1} className="print">Print</button>

                 </div>


                <div
                  class="modal fade"
                  id="carehomeModalCenter"
                  tabindex="-1"
                  role="dialog"
                  aria-labelledby="carehomeModalCenterTitle"
                  aria-hidden="true"
                >
                  <div
                    class="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">
                          Create a carehome
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
                        <div className="row">
                          <h4 style={{ padding: "0 0.75rem" }}>
                            Care Home Details
                          </h4>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Name:
                            </label>
                            <input
                              type="string"
                              name="name"
                              required
                              value={newDetails.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Address:
                            </label>
                            <input
                              type="string"
                              name="address"
                              required
                              value={newDetails.address}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Post Code:</label>
                            <input
                              type="string"
                              name="postCode"
                              required
                              value={newDetails?.postCode}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Landline:
                            </label>
                            <input
                              type="number"
                              name="landline"
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              value={newDetails.landline}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>
                              <span className="me-1" style={{ color: "red" }}>
                                *
                              </span>
                              Mobile:
                            </label>
                            <input
                              type="number"
                              name="mobile"
                              required
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                              value={newDetails.mobile}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 col-xs-12 form-field">
                            <label>Note:</label>
                            <input
                              type="string"
                              name="note"
                              value={newDetails.note}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-xs-12">
                            <h4 style={{ padding: "0 0.75rem" }}>
                              Manager Details
                            </h4>
                            <div className="col-xs-12 form-field">
                              <label>Name:</label>
                              <input
                                type="string"
                                name="name"
                                required
                                value={newManagerDetails.name}
                                onChange={handleManagerChange}
                              />
                            </div>
                            <div className="col-xs-12 form-field">
                              <label>Landline:</label>
                              <input
                                type="number"
                                name="landline"
                                required
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={newManagerDetails.landline}
                                onChange={handleManagerChange}
                              />
                            </div>
                            <div className="col-xs-12 form-field">
                              <label>Mobile:</label>
                              <input
                                type="number"
                                name="mobile"
                                required
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={newManagerDetails.mobile}
                                onChange={handleManagerChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-xs-12">
                            <h4 style={{ padding: "0 0.75rem" }}>
                              Carer Details
                            </h4>
                            <div className="col-xs-12 form-field">
                              <label>Name:</label>
                              <input
                                type="string"
                                name="name"
                                required
                                value={newCarerDetails.name}
                                onChange={handleCarerChange}
                              />
                            </div>
                            <div className="col-xs-12 form-field">
                              <label>Landline:</label>
                              <input
                                type="number"
                                name="landline"
                                required
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={newCarerDetails.landline}
                                onChange={handleCarerChange}
                              />
                            </div>
                            <div className="col-xs-12 form-field">
                              <label>Mobile1:</label>
                              <input
                                type="number"
                                name="mobile"
                                required
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                maxLength={5}
                                value={newCarerDetails.mobile}
                                onChange={handleCarerChange}
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
                          onClick={() => {
                            setND(defaultDetails);
                            setMD(defaultManager);
                            setCD(defaultCarer);
                          }}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          class="btn save"
                          data-dismiss="modal"
                          onClick={() => {
                            if (mode === "add") handleSave();
                            else handleEdit();
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row" style={{ padding: "0.5rem 1rem" }}>
                  <table className="w-100 table-bordered table" ref={componentRef1} >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Manager</th>
                        <th>Carer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careHomes.map((careHome) => (

                        <tr key={careHome.id}>
                          <td>{careHome.name}</td>
                          <td>{careHome.manager_name}</td>
                          <td>{careHome.careDetails_name}</td>
                          <td>
                            <span
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <button
                                className="btn btn-sm update"
                                data-toggle="modal"
                                data-target="#carehomeModalCenter"
                                style={{ marginRight: "0.5rem" }}
                                onClick={() => {
                                  setND({
                                    id: careHome.id,
                                    name: careHome.name,
                                    address: careHome.address,
                                    postCode: careHome.post_code,
                                    Landline: careHome.landline,
                                    mobile: careHome.mobile,
                                    note: careHome.note,
                                  });
                                  setMD({
                                    name: careHome.manager_name,
                                    landline: careHome.manager_landline,
                                    mobile: careHome.manager_mobile,
                                  });
                                  setCD({
                                    name: careHome.careDetails_name,
                                    landline: careHome.careDetails_landline,
                                    mobile: careHome.careDetails_mobile,
                                  });
                                  setMode("edit");
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm delete"
                                onClick={() => {
                                  deleteCareHome(careHome.id);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="btn view btn-sm ms-2"
                                data-toggle="modal"
                                data-target="#ViewPatientModalCenter"
                                onClick={() => {
                                  setViewId(careHome.id);
                                  careHomeDetails(careHome);
                                }}
                              >
                                View
                              </button>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* =================Care Home================================ */}
                {careHomeShow   &&    (<div className="row" style={{ padding: "0.5rem 1rem" }}>

                <div className="d-flex mb-3">  
                <button onClick={handlePrint2} className="print">Print</button>
                </div>
                  <table className="w-100 table-bordered table" ref={componentRef2}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Mobile Number</th>
                        <th>NHS Number</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {careHoem.map((element, index) => (
                        <tr key={index}>

                          <td>{element.title + " " +element.firstName+ " "+ element.lastName}</td>
                          <td>{formatDate(element.dateOfBirth)}</td>
                          <td>{element.mobileNo}</td>
                          <td>{element.nhsNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex   cancel-wrapper">
                  <button type="button" class="btn delete mt-3"  onClick={()=>{setCareHomeShow(false)}} >Cancel</button>
                  </div>
                </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareHome;
