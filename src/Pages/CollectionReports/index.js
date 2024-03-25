import React, { useEffect, useState } from "react";
import "./CollectionReports.css";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "../../Services/axios";
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';


function CollectionReports() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isRxChecked, setIsRxChecked] = useState(false);
  const [isMdsChecked, setIsMdsChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [data, setData] = useState([]);
  const fetchData = () => {
    Axios.get("/collection/getCollection")
      .then((res) => {
        const updatedCollection = res.data.map((collection) => {
          // Format dates to "yyyy-MM-dd" format
          let dateCollected 
          if(collection.CollectedDate) dateCollected = new Date(collection.CollectedDate);
          const dateCreated = new Date(collection.createdAt);

          if (!isNaN(dateCollected) && !isNaN(dateCreated)) {
            const formattedCollectedDate = dateCollected.toISOString().split('T')[0];
            const formattedCreatedAt = dateCreated.toISOString().split('T')[0];

            return {
              ...collection,
              CollectedDate: formattedCollectedDate,
              createdAt: formattedCreatedAt,
            };
          } else {
            // Handle invalid dates in the API response
            console.error("Invalid date detected in the API response.");
            return collection; // Return as is
          }
        });

        setData(updatedCollection);
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === "rx") {
      setIsRxChecked(checked);
    } else if (name === "mds") {
      setIsMdsChecked(checked);
    }
  };

  const handleSearch = () => {
    setCalendarOpen(false); 
  };
  const filteredData = data.filter((patient) => {
    const isRxMatched = !isRxChecked || patient.Status === "Collected";
    const isNameMatched = (
      patient.Patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.Patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.Patient?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.Patient?.nhsNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const createdAt = new Date(patient.createdAt);
    const collectedDate = new Date(patient.CollectedDate);
  
    // Convert start and end dates to Date objects for comparison
    const startDateObject = startDate ? new Date(startDate) : null;
    const endDateObject = endDate ? new Date(endDate) : null;
  
    // Check if the createdAt and collectedDate are within the date range
    const isDateRangeMatched =
      (!startDateObject || !endDateObject) ||
      (!startDateObject && !endDateObject) ||
      (!startDateObject && endDateObject && collectedDate <= endDateObject) ||
      (startDateObject && !endDateObject && createdAt >= startDateObject) ||
      (startDateObject && endDateObject && createdAt >= startDateObject && collectedDate <= endDateObject);
  
    return isRxMatched && isNameMatched && isDateRangeMatched;  
  });
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="page-holder">
              <div className="page-heading">Collection Reports</div>
              <div className="row">
                <div className="col-md-6 col-xs-12 row filters">
                  <label>Type:</label>
                  <div
                    className="col-md-6 col-xs-12"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <label style={{ marginRight: "1rem" }}>RX</label>
                    <input
                      type="checkbox"
                      name="rx"
                      checked={isRxChecked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div
                    className="col-md-6 col-xs-12"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <label style={{ marginRight: "1rem" }}>MDS</label>
                    <input
                      type="checkbox"
                      name="mds"
                      checked={isMdsChecked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </div>
                <div
                  className="col-md-4 col-xs-12 filters"
                  style={{ paddingRight: "1.25rem" }}
                >
                  <label>Search Patient:</label>
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="col-xs-12 row filters">
                  <div className="col-md-4 col-xs-12">
                    <label>Select Date:</label>
                    <input
                      type="date"
                      max="2100-10-29"
                      name="selectedDate"
                      value={startDate}
                      onChange={(e)=> setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 col-xs-12">
                    <label>Select Date Range:</label>
                    <input
                      type="date"
                      max="2100-10-29"
                      name="dateRange"
                      value={endDate}
                      onChange={(e)=> setEndDate(e.target.value)}
                    />
                  </div>
                </div>

              
               <div className="col-6 mt-4">
                <button onClick={handlePrint}>Print this out!</button>
                </div>
                <div
                  className="filters col-6"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "1.25rem",
                  }}
                >
                  <button
                    className="btn add"
                    onClick={handleSearch}
                    style={{ width: "auto", }}
                  >
                    SEARCH REPORTS
                  </button>
                </div>
              </div>
              <div className="table-container">
        <table className="table w-100"  ref={componentRef}>
          <thead>
            <tr>
              <th>NHS Number</th>
              <th>Name</th>
              <th>Address</th>
              <th>Action</th>
              {/* <th>No of Bags</th>
              <th>Shelf No</th> */}
              <th>Date Stored</th>
              <th>Date Collected</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((patient, index) => (
              <tr key={index}>
                <td>{patient.Patient?.nhsNumber}</td>
                <td>
                  {patient.Patient?.firstName} {patient.Patient?.lastName}
                </td>
                <td>{patient.Patient?.addressLine1}</td>
                <td>{patient?.Status}</td>
                {/* <td>{patient.numOfBags}</td>
                <td>{patient.shelveNo}</td> */}
                <td>{patient?.createdAt}</td>
                <td>{patient?.CollectedDate ? patient?.CollectedDate : "Not Yet Collected"}</td>
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
  );
}

export default CollectionReports;
