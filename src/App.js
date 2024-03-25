import { Suspense } from "react";
import React from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import HomePage from "./Pages/HomePage";
export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes></AppRoutes>
    </>
  );
}
