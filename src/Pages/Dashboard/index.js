import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { BarChart, PieChart, PolarAreaChart } from "../../Components/chart";
import faker from "faker";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link, useNavigate } from "react-router-dom";
import QrScanner from "../../Components/qrScanner";
import Axios from "../../Services/axios";
import { FaBeer } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
function Dashboard() {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [monthlyStatsDelivery, setMonthlyStatsDelivery] = useState([]);
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const bardata = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  const [piedata, setPieData] = useState({
    labels: ["Deliveries", "Collections"],
    datasets: [
      {
        label: "Orders this month",
        data: [1, 1],
        backgroundColor: ["#04938b", "rgba(255, 206, 86, 1)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  });

  const getData = () => {
    Axios.get("/patient/getMonthStats")
      .then((res) => {
        let deliveryCount = 0;
        res.data.deliveryStats.map((delivery) => {
          deliveryCount += delivery.count;
        });

        let collectionCount = 0;
        res.data.collectionStats.map((collection) => {
          collectionCount += collection.count;
        });

        let tempData = piedata.datasets;
        tempData[0].data = [
          deliveryCount ? deliveryCount : 1,
          collectionCount ? collectionCount : 1,
        ];
        setPieData({ ...piedata, datasets: tempData });
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  const getAllStatsDelivery = () => {
    Axios.get("delivery/getAllDeliveryStats")
      .then((res) => {
        setMonthlyStatsDelivery(res.data.monthlyStats);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  const getAllStats = () => {
    Axios.get("/mds/allStats")
      .then((res) => {
        setMonthlyStats(res.data.monthlyStats);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };
  useEffect(() => {
    getData();
    getAllStats();
    getAllStatsDelivery();
  }, []);
  return (
    <>
      <section className="main-wrapper">
        <div className="container-fluid">
          <div className="row nav-btns justify-content-center pt-2">
            <div className="col-md-4 col-12">
              <div className="text-center">
                <button
                  className="del-button"
                  onClick={() => {
                    navigate("/deliveryhistory");
                  }}
                >
                  <TbTruckDelivery size={70} className="me-2" />
                  Deliveries
                </button>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="text-center">
                <button
                  className="coll-button"
                  onClick={() => {
                    navigate("/collection");
                  }}
                >
                  <MdOutlineLibraryBooks size={70} className="me-2" />
                  Collections
                </button>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <div className="text-center">
                <button
                  className="appoint-button"
                  onClick={() => {
                    navigate("/allreports");
                  }}
                >
                  <TbReportSearch size={70} className="me-4" />
                  MDS
                </button>
              </div>
            </div>
          </div>

          <div className="row    mt-3 mb-0">
            <div className="chart-wrapper">
              <BarChart
                data={{
                  labels: monthlyStats.map((stats) =>
                    new Date(stats.month).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })
                  ),
                  datasets: [
                    {
                      label: "Received",

                      data: monthlyStats.map((stats) => stats.receivedStats),
                      backgroundColor: "rgba(255, 99, 132, 1)",
                    },
                    {
                      label: "Pending",
                      data: monthlyStats.map((stats) => stats.pendingStats),
                      backgroundColor: "rgba(54, 162, 235, 1)",
                    },
                    {
                      label: "Prepared",
                      data: monthlyStats.map((stats) => stats.preparedStats),
                      backgroundColor: "rgba(75, 192, 192, 1)",
                    },
                    {
                      label: "Requested",
                      data: monthlyStats.map((stats) => stats.requestedStats),
                      backgroundColor: "rgba(255, 87, 51, 1)",
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      grid: {
                        display: false, // hide x-axis grid lines
                      },
                    },
                    y: {
                      grid: {
                        display: false, // hide y-axis grid lines
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true, // display the legend
                      position: "top", // you can adjust the position as needed
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  backgroundColor: "white", // set the background color of the chart
                  canvas: {
                    width: 100, // set the starting width
                    height: 100, // set the starting height
                  },
                }}
              />
            </div>

            <div className="chart-wrapper">
              <PieChart data={piedata} />
            </div>
            </div>
            <div className="chart-wrapper">
              {" "}
              <PolarAreaChart
                data={{
                  labels: monthlyStatsDelivery.map((stats) =>
                    new Date(stats.month).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })
                  ),
                  datasets: [
                    {
                      label: "Completed",
                      data: monthlyStatsDelivery.map(
                        (stats) => stats.completed
                      ),
                      backgroundColor: "rgba(54, 162, 235, 1)",
                    },
                    {
                      label: "Out For Delivery",
                      data: monthlyStatsDelivery.map(
                        (stats) => stats.outForDelivery
                      ),
                      backgroundColor: "rgba(75, 192, 192, 1)",
                    },
                    {
                      label: "Ready",
                      data: monthlyStatsDelivery.map((stats) => stats.ready),
                      backgroundColor: "rgba(255, 87, 51, 1)",
                    },
                    {
                      label: "Failed",
                      data: monthlyStatsDelivery.map((stats) => stats.failed),
                      backgroundColor: "rgba(255, 0, 0, 1)",
                    },
                    {
                      label: "Cancelled",
                      data: monthlyStatsDelivery.map(
                        (stats) => stats.cancelled
                      ),
                      backgroundColor: "rgba(121, 52, 0, 1)",
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      grid: {
                        display: false, // hide x-axis grid lines
                      },
                    },
                    y: {
                      grid: {
                        display: false, // hide y-axis grid lines
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true, // display the legend
                      position: "top", // you can adjust the position as needed
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  backgroundColor: "white", // set the background color of the chart
                  canvas: {
                    width: 100, // set the starting width
                    height: 100, // set the starting height
                  },
                }}
              />
            </div>

            

            
       
        </div>
      </section>
    </>
  );
}

export default Dashboard;
