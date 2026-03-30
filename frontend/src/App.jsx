import "./App.css";
import { Routes, Route } from "react-router-dom";
//import { Toaster, toast, useToasterStore } from "react-hot-toast";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import MyProfilePage from "./Pages/MyProfilePage";
import UserProfilePage from "./Pages/UserProfilePage";
import TenderDetailsPage from "./Pages/TenderDetailsPage";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Pages/LandingPage";
import CreateTenderPage from "./Pages/CreateTenderPage";
import UpdateTenderPage from "./Pages/UpdateTenderPage";
import AdminDashboardPage from "./Pages/AdminDashboardPage";

function App() {
  const showToast = (message, type = "error") => {
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
        showToast("Session Expired! Please Login", "error");
      }
      if (val === null) {
        showToast("Please Login!", "success");
      }
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/createtender" element={<CreateTenderPage />} />
          <Route
            path="/updatetender/:tenderId"
            element={<UpdateTenderPage />}
          />
          <Route path="/tender/:tenderId" element={<TenderDetailsPage />} />
          <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
