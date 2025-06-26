import { Route, Routes } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import ComposeMail from "./pages/ComposeMail";
import Inbox from "./pages/Inbox";
import MainNavbar from "./components/MainNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SentMail from "./pages/SentMail";

const App = () => {

  return (
    <>
      <MainNavbar />
      <Routes>
        <Route path="/login" element={<Loginpage/>} />
        <Route path="/" element={<Inbox />} />
        <Route path="/composeMail" element={<ComposeMail />} />
        <Route path="/sentMail" element={<SentMail/>} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;

