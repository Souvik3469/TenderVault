import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast, useToasterStore } from "react-hot-toast";
import { useEffect } from "react";

import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Createtender from "./Components/Createtender";

function App() {
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
        toast.error("Session expired! Please Login");
      }
      if (val === null) {
        toast.success("Please Login");
      }
    }
  }, []);

  const MAX_TOAST_LIMIT = 1;
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= MAX_TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <div className="App">
      
        <Routes>
          <Route path="/">
            <Route path="/" element={<Landing/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
             <Route path="/home" element={<Home />} />
               <Route path="/createtender" element={<Createtender />} />
          </Route>
        </Routes>
        </div>
  );
}

export default App;
