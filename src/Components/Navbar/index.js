import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { RiBook3Fill } from "react-icons/ri";
import Axios from "../../Services/axios";
import { Dropdown, Badge } from "react-bootstrap";
import { BsBell } from "react-icons/bs";

function NavBar() {
  const [notificationText, setNotificationText] = useState("");
  const [mdsRecordsQueries, setMdsRecordsQueries] = useState([]);
  const [mdsRecordsRemind, setMdsRecordsRemind] = useState([]);
  const [mdsRecordsRemindNonMds, setMdsRecordsRemindNonMds] = useState([]);

  const getAllNotification = () => {
    Axios.get("mds/getNotifications")
      .then((res) => {
        setMdsRecordsQueries(res.data.mdsRecordsQueries);
        setMdsRecordsRemind(res.data.mdsRecordsRemind);
        setMdsRecordsRemindNonMds(res.data.mdsRecordsRemindNonMds);

        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  const userName = localStorage.getItem("userName");

  
  const totalNotifications = [
    ...mdsRecordsQueries,
    ...mdsRecordsRemind,
    ...mdsRecordsRemindNonMds,
  ];
  function handleSignout() {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } 
  useEffect(() => {
    if (totalNotifications.length === 0) {
      setNotificationText("You don't have any notifications.");
    } else {
      setNotificationText("");
    }
  }, [totalNotifications]);

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
      <div className="topBar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid me-5 containNavbar">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav ms-auto d-flex align-items-center">
                <li>
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                      <Badge bg="danger">{totalNotifications.length}</Badge>
                      <span className="sr-only">Notifications</span>
                      <BsBell size={30} color="#04938B"></BsBell>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Header>Notifications</Dropdown.Header>
                      {notificationText && <Dropdown.Item>{notificationText}</Dropdown.Item>}
                      {mdsRecordsQueries.map((notification, index) => (
                        <Dropdown.Item key={index}>
                            <Link to="mdslanding">
                          MDS Query for {notification?.Patient?.firstName} requested {notification.queries}
                            </Link>
                        </Dropdown.Item>
                      ))}
                      {mdsRecordsRemind.map((notification, index) => (
                        <Dropdown.Item key={index}>
                            <Link to="mdslanding">
                          Rx due for {notification?.Patient?.firstName} on {formatDate(notification.remind)}
                            </Link>
                        </Dropdown.Item>
                      ))}
                      {mdsRecordsRemindNonMds.map((notification, index) => (
                        <Dropdown.Item key={index}>
                            <Link to="mdslanding">
                        Rx due for {notification?.Patient?.firstName} on {formatDate(notification.remind)}
                            </Link>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-black"
                    href="#"
                    id="navbarDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >

                    <span>
                      <CgProfile size={30} color="#04938B"></CgProfile>
                    </span>{" "}
                    {userName}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <li className="">
                    <Link
                       to={`/createMember?specialUser=${true}`}
                        className="dropdown-item"
                      >
                        <CgProfile size={30} color="black" className="me-1"></CgProfile> {userName}
                      </Link>
                    </li>
                    
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleSignout}>
                        <RiLogoutCircleRLine className="me-1"></RiLogoutCircleRLine> LogOut
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavBar;
