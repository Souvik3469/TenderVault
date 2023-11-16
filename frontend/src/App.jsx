import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { Toaster, toast, useToasterStore } from "react-hot-toast";
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Createtender from "./Components/Createtender";
import UpdateTender from "./Components/Updatetender";
import Profile from "./Components/Profile";
import TenderDetail from "./Components/TenderDetail";
import TenderDetails from "./Components/TenderDetails";
import Loading from "./Components/Loading";
import Profile1 from "./Components/Profile1";
import UserProfile from "./Components/Userprofile";

function App() {
  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  function isJWTValid() {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  }
  useEffect(() => {
    if (!isJWTValid()) {
      let val = localStorage.getItem("token");
      if (val !== null) {
       
          showToast('Session Expired! Please Login', 'error');
      }
      if (val === null) {
     
        showToast('Please Login!', 'success');
      }
    }
  }, []);

  // const MAX_TOAST_LIMIT = 1;
  // const { toasts } = useToasterStore();
  // useEffect(() => {
  //   toasts
  //     .filter((t) => t.visible)
  //     .filter((_, i) => i >= MAX_TOAST_LIMIT)
  //     .forEach((t) => toast.dismiss(t.id));
  // }, [toasts]);

  return (
    <div className="App">
      
        <Routes>
          <Route path="/">
            <Route path="/" element={<Landing/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
             <Route path="/home" element={<Home />} />
              <Route path="/myprofile" element={<Profile1 />} />
               <Route path="/createtender" element={<Createtender />} />
               <Route path="/tender/:tenderId"  element={<TenderDetail />} />
               <Route path="/profile/:userId"  element={<UserProfile />} />
               <Route path="/updatetender/:tenderId" element={<UpdateTender />} />
               <Route path="/loading" element={<Loading />} />
          </Route>
        </Routes>
          <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={true}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
        </div>
  );
}

export default App;
