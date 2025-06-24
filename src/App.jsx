import React from "react"
import Loginpage from "./pages/Loginpage"
import ComposeMail from "./components/composeMail"
import Inbox from "./components/Inbox"
import { ToastContainer } from "react-toastify"
const App = () => {
  return (<>
    {/* <Loginpage /> */}
    <ComposeMail  senderEmail="admin@gmail.com"/>
    <Inbox userEmail="admin@gmail.com"/>
    <ToastContainer/>
  </>)
}

export default App