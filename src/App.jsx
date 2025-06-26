import { Route, Routes } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import ComposeMail from "./pages/ComposeMail";
import Inbox from "./pages/Inbox";
import MainNavbar from "./components/MainNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SentMail from "./pages/SentMail";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {

  return (
    <>
      <MainNavbar />
      <Routes>
        <Route path="/login" element={<Loginpage/>} />
        <Route path="/" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/composeMail" element={<ProtectedRoute><ComposeMail /></ProtectedRoute>} />
        <Route path="/sentMail" element={<ProtectedRoute><SentMail/></ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;

