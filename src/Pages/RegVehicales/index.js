import React, { useState } from "react";
import "./RegVehicles.css";

const RegVehicle = () => {
  const [formData, setFormData] = useState({
    // Vehicle Registration Fields
    vehicleName: "",
    make: "",
    model: "",
    manufactureYear: "",
    vehicleRegisterNo: "",
    colour: "",
    type: "car",
    ownedBy: "",
    driverCompany: "",
    vehiclePicture: null,
    // Insurance Details Fields
    insuranceName: "",
    coverDetails: "",
    insuranceStartTime: "",
    insuranceEndTime: "",
    insuranceReminderDate: "",
    insuranceCopy: null,
    // MOT Details Fields
    motStartDate: "",
    motEndDate: "",
    motReminderDate: "",
    motCopy: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Your form submission logic here
  };

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="container mt-5">
            <form onSubmit={handleSubmit}>
              {/* Vehicle Registration Section */}
              <h3 className="page-heading">Vehicle Registration</h3>
              <div className="mb-3">
                <label className="form-label">Vehicle Name</label>
                <input
                  type="text"
                  name="vehicleName"
                  className="form-control"
                  value={formData.vehicleName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Make</label>
                <input
                  type="text"
                  name="make"
                  className="form-control"
                  value={formData.make}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  name="model"
                  className="form-control"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Manufacture Year</label>
                <input
                  type="number"
                  name="manufactureYear"
                  className="form-control"
                  value={formData.manufactureYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vehicle Register No</label>
                <input
                  type="text"
                  name="vehicleRegisterNo"
                  className="form-control"
                  value={formData.vehicleRegisterNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Colour</label>
                <input
                  type="text"
                  name="colour"
                  className="form-control"
                  value={formData.colour}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Owned By</label>
                <input
                  type="text"
                  name="ownedBy"
                  className="form-control"
                  value={formData.ownedBy}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Driver Company</label>
                <input
                  type="text"
                  name="driverCompany"
                  className="form-control"
                  value={formData.driverCompany}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Upload a Picture of Vehicle
                </label>
                <input
                  type="file"
                  name="vehiclePicture"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              {/* Insurance Details Section */}
              <h3 className="page-heading"  >Insurance Details</h3>
              <div className="mb-3">
                <label className="form-label">Insurance Name</label>
                <input
                  type="text"
                  name="insuranceName"
                  className="form-control"
                  value={formData.insuranceName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cover Details</label>
                <input
                  type="text"
                  name="coverDetails"
                  className="form-control"
                  value={formData.coverDetails}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Insurance Start Time</label>
                <input
                  type="datetime-local"
                  name="insuranceStartTime"
                  className="form-control"
                  value={formData.insuranceStartTime}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Insurance End Time</label>
                <input
                  type="datetime-local"
                  name="insuranceEndTime"
                  className="form-control"
                  value={formData.insuranceEndTime}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Insurance Reminder Date</label>
                <input
                  type="date"
                  name="insuranceReminderDate"
                  className="form-control"
                  value={formData.insuranceReminderDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload a Copy of Insurance</label>
                <input
                  type="file"
                  name="insuranceCopy"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              {/* MOT Details Section */}
              <h3 className="page-heading">MOT Details</h3>
              <div className="mb-3">
                <label className="form-label">MOT Start Date</label>
                <input
                  type="date"
                  name="motStartDate"
                  className="form-control"
                  value={formData.motStartDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">MOT End Date</label>
                <input
                  type="date"
                  name="motEndDate"
                  className="form-control"
                  value={formData.motEndDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">MOT Reminder Date</label>
                <input
                  type="date"
                  name="motReminderDate"
                  className="form-control"
                  value={formData.motReminderDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload a Copy of MOT</label>
                <input
                  type="file"
                  name="motCopy"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Register Vehicle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegVehicle;
