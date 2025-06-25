import { Route, Routes } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import ComposeMail from "./components/ComposeMail";
import Inbox from "./components/Inbox";
import MainNavbar from "./components/MainNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const App = () => {

  return (
    <>
      <MainNavbar />
      <Routes>
        <Route path="/login" element={<Loginpage/>} />
        <Route path="/" element={<Inbox />} />
        <Route path="/composeMail" element={<ComposeMail />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;

