import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Login from "../Components/Login";
import Signup from "../Components/SignUp";
import InputData from "../Pages/InputData";
import HelpDesk from "../Components/helpDesk/helpDesk";
import Complaint from "../Components/complaints/helpDesk";
import SideBar from "../Components/sidebar";
import Reports from "../Pages/Reports";
import Patients from "../Pages/Patients";
import ParcelLocation from "../Pages/ParcelLocation";
import Delivery from "../Pages/Delivery";
import HomePage from "../Pages/HomePage";
import CreatePatient from "../Pages/CreatePatient";
import CreateMember from "../Pages/CreateMember";
import Collection from "../Pages/Collection";
import Handouts from "../Pages/Handouts";
import CreateRoutes from "../Pages/CreateRoutes";
import CreateDelivery from "../Pages/CreateDelivery";
import DeliveryHistory from "../Pages/DeliveryHistory";
import CollectionReports from "../Pages/CollectionReports";
import MdsEdit from "../Pages/MDSEdit";
import MdsLanding from "../Pages/MDSLanding";
import RegVehicle from "../Pages/RegVehicales";
import Vehicales from "../Pages/Vehicles";
import CollectionShelves from "../Pages/CollectionShelves";
import CareHome from "../Pages/CareHomes";
import Vehicles from "../Pages/Vehicles";
import Appointment from "../Pages/CreateAppointment";
import BookAppointment from "../Pages/BookAppointment";
import ViewAppointment from "../Pages/ViewAppointment";
import ContactForm from "../Pages/ContactUs/contactUs";
import Terms from "../Pages/Terms/Terms";
import Privacy from "../Pages/Privacy/Privacy";
import Gdpr from "../Pages/GDPR/Gdpr";
import ForgotPassword from "../Components/ForgotPassword";
const AppRoutes = () => {
  const isAuthenticatedUser = localStorage.getItem("tokenMedt");
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/gdpr" element={<Gdpr />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<ContactForm />} />
      {isAuthenticatedUser ? (
        <Route path="/" element={<SideBar />}>
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/carehomes" element={<CareHome />} />
          <Route path="/deliveryhistory" element={<DeliveryHistory />} />
          <Route path="/allreports" element={<Reports />} />
          <Route path="/collectionreports" element={<CollectionReports />} />
          <Route path="/shelves" element={<CollectionShelves />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/mdsedit" element={<MdsEdit />} />
          <Route path="/mdslanding" element={<MdsLanding />} />
          <Route path="/handouts" element={<Handouts />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/createMember" element={<CreateMember />} />
          <Route path="/createRoutes" element={<CreateRoutes />} />
          <Route path="/createVehicle" element={<Vehicles />} />
          <Route path="/createDelivery" element={<CreateDelivery />} />
          <Route path="/createpatient" element={<CreatePatient />} />
          <Route path="/parcellocation" element={<ParcelLocation />} />
          <Route path="/createAppointment" element={<Appointment />} />
          <Route path="/bookAppointment" element={<BookAppointment />} />
          <Route path="/viewAppointment" element={<ViewAppointment />} />
          <Route path="/HelpDesk" element={<HelpDesk />} />
          <Route path="/complaints" element={<Complaint />} />
          <Route path="/user/:userId" element={<InputData />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Regvahicle" element={<RegVehicle />} />
          <Route path="/vahicle" element={<Vehicales />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      ) : (
        <Route path="/*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
