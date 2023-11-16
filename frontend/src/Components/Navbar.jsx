import React, { useState } from 'react';
import logo from "../logo.png";
import profile from "../icons/profile.png";
import { Link } from 'react-router-dom';
import { GetUserQuery } from '../api/user'
import { AiOutlineSearch } from "react-icons/ai";
import LogoutIcon from '@mui/icons-material/Logout';
import { RiSearchLine } from "react-icons/ri";
import {
  Home,
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,

} from "@mui/icons-material";

function Navbar() {


 const { data: userProfile, isLoading: profileLoading, isError: profileError } = GetUserQuery();
   return (
      <div className='flex flex-col bg-blue-950 w-full sticky top-0 z-50'>
         <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center justify-between">
            <Link to="/">
               <div>
                  <span className='font-mont text-blue-300 text-4xl font-bold'>Tender</span>
                  <span className='font-mont text-gray-50 text-xl font-bold'>Vault</span>
               </div>
            </Link>
            
            <nav className="md:ml-auto flex flex-wrap pl-3 items-center text-base justify-center">
               <Link to="/home">
                  <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Home</span>
               </Link>
             
          
           {
  userProfile && userProfile.role === "company" && (
    <Link to="/createtender">
      <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
        Create
      </span>
    </Link>
  )
}
                

               
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer"> Hello, {userProfile?.name}</span>
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
               <Link  onClick={() => {
                        localStorage.removeItem("token");
                      }}
                      to="/login">

      <LogoutIcon style={{ color: "white",fontSize: 32 }} />
      </Link>
      </span>
            </nav>
            <div className='flex mt-4 md:mt-0'>
               <Link to="/myprofile">
              <AccountCircleOutlined style={{ color: "white",fontSize: 32}} />
               </Link>
            </div>
           
         </div>
      </div>
   );
}

export default Navbar;
