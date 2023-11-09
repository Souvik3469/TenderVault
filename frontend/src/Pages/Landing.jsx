import React, { useState,useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Hero from '../Components/hero'
import Featured from '../Components/featured'
import Discover from '../Components/discover'
import Form from '../Components/form'
import Blog from '../Components/blog'
import Footer from '../Components/footer'
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai";
import LogoutIcon from '@mui/icons-material/Logout';
import { RiSearchLine } from "react-icons/ri";
import featured from "../img/featured1.jpg"
import electric from "../img/electric.jpg"
import solar from "../img/solar.jpg"
import hotel from "../img/hotel.jpg"
import road from "../img/road.jpg"
import img1 from "../img/water.jpg"
import img2 from "../img/cloud.png"
import img3 from "../img/hotel.jpg"
import img4 from "../img/solar.jpg"
import { GetUserQuery } from "../../src/api/user";

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
import { useTranslation } from "react-i18next";
import i18n from "../../src/Language/i18n"

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState('');
    const [dropDown, setDropDown] = useState(false);
      const [user, setuser] = useState();
 const { t, i18n } = useTranslation();
const data = GetUserQuery();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
 useEffect(() => {
    setuser(data?.data);
  }, [data.data]);
// console.log("User2:",user);
   
  return (
    
     <>
      <div className='flex flex-col w-full'>
        {/* <Navbar /> */}
         <div className='flex flex-col bg-blue-950 w-full sticky top-0 z-50'>
         <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center justify-between">
            <Link to="/">
               <div>
                  <span className='font-mont text-blue-300 text-4xl font-bold'>Tender</span>
                  <span className='font-mont text-gray-50 text-xl font-bold'>Vault</span>
               </div>
            </Link>
          
            <nav className="md:ml-auto flex flex-wrap pl-3 items-center text-base justify-center">
                {
                    user?(
                         <Link to="/home">
                  <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Home</span>
               </Link>
                    ):(" ")
                }
               {/* <Link to="/home">
                  <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Home</span>
               </Link> */}
               {/* <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Language</span> */}
             <span className="font-mont text-gray-800 text-lg font-bold mr-10 hover:text-blue-500 hover:cursor-pointer">
                 <select
              name="language"
              className="outline-none"
              id="language"
              onChange={() => {
                changeLanguage(document.getElementById("language").value);
              }}
            >
              <option value="en">English</option>
              <option value="be">বাংলা</option>
              <option value="hi">हिंदी</option>
              <option value="gj">ગુજરાતી</option>
          
            
     
              <option value="pu">ਪੰਜਾਬੀ</option>
           
            </select>
            </span>
              
<span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">About us</span>
<span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Explore</span>
<span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Stories</span>
             {
                user?(
                    <div>
                     <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Hello, {user.name}</span>
                     <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
               <Link  onClick={() => {
                        localStorage.removeItem("token");
                      }}
                      to="/login">

      <LogoutIcon style={{ color: "white",fontSize: 32 }} />
      </Link>
      </span>
      </div>
                ):(
                   <Link to="/login">
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Login</span>
               </Link> 
                )
             }  
               {/* 
               <Link to="/login">
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Login</span>
               </Link>
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
               <Link  onClick={() => {
                        localStorage.removeItem("token");
                      }}
                      to="/login">

      <LogoutIcon style={{ color: "white",fontSize: 32 }} />
      </Link> */}

           {/* {user ? (
              <button
                className=" primary-btn "
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                LOG OUT
              </button>
            ) : (
              <Link to="/login">
                <button className=" primary-btn ">Login</button>
              </Link>
            )} */}
      {/* </span> */}
            </nav>
            {
                user?(
<div className='flex mt-4 md:mt-0'>
               <Link to="/myprofile">
              <AccountCircleOutlined style={{ color: "white",fontSize: 32}} />
               </Link>
            </div>
                ):(
" "
                )
            }
            
           
         </div>
      </div>
      {/* <Hero/> */}
          <div className='w-screen h-[calc(100vh-5rem)]'>
            <div className="bg-cover bg-[url('/public/hero2.png')] bg-center bg-no-repeat h-full w-full" >
                <div className="container mx-auto flex flex-col my-auto align-middle h-full" >
                    <div className='my-auto  mx-auto lg:mx-0 w-10/12 lg:w-2/5'>
                        <h1 className="text-5xl mb-4 font-mont font-bold "><span className='font-mont text-6xl text-blue-500 font-bold'>Your tenders</span> your way!</h1>
                        <p className="text-2xl mb-8">Navigate the complexities of tenders effortlessly with our management system!</p>
                        {/* <div className='flex items-center'>
                            <button className='rounded px-10 py-3 text-white bg-violet-500 hover:bg-violet-600'>Share your story</button>
                            <img alt='icon' className='pl-4 pr-2' src={icon1} />
                            <p> Watch highlights</p>
                        </div> */}

                    </div>
                </div >
            </div >
        </div>
        {/* <Featured /> */}
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container py-24 flex items-center mx-auto">
                <div className="flex flex-wrap">
                    <img alt="feature" className="lg:w-1/2 w-5/6 lg:mx-0 mx-auto lg:h-96 h-64 object-cover object-center rounded" src={featured} />
                    <div className="lg:w-1/2 w-5/6 lg:mx-0 mx-auto px-0 lg:px-8 py-8">
                        <h2 className="text-5xl font-bold text-blue-700 mb-5">{t("a1")}</h2>
                        <h1 className="text-4xl	text-gray-900 font-normal mb-4"> {t("a2")}</h1>
                        <p className="leading-relaxed text-lg">{t("a3")} </p>
                        {/* <div className="flex mt-6 mb-4">
                            <img alt='icon' className='pr-2' src={icon2} />
                            <button className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Watch Now</button>

                        </div> */}
                    </div>
                </div>
            </div>
        </section>
        {/* <Discover /> */}
    <section className="text-gray-600 body-font" >
            <div className="container px-5 py-24 mx-auto">
                <h2 className='text-2xl font-bold text-blue-700 flex justify-center'>{t("a4")}</h2>
                <h1 className='flex justify-center text-4xl	text-gray-900 font-normal mb-12'>{t("a5")}</h1>
                <div className="flex flex-wrap -m-4">
                    <div className="xl:w-1/4 md:w-1/2 sm:w-5/6 mx-auto lg:mx-0 p-4">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={electric} alt="content" />
                        <h3 className="flex justify-center text-2xl"> {t("a6")}</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">{t("a0")}</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={solar} alt="content" />
                        <h3 className="flex justify-center text-2xl">{t("a7")}</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">{t("a0")}</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={hotel} alt="content" />
                        <h3 className="flex justify-center items-center text-2xl">{t("a8")}</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">{t("a0")}</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={road} alt="content" />
                        <h3 className="flex justify-center text-2xl">{t("a9")}</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">{t("a0")}</h2>
                    </div>
                </div>
            </div>
        </section >
   
        {/* <Blog /> */}

         <section className="text-gray-600 mt-20 lg:mb-20 mb-0 body-font" >
            <h2 className="flex justify-center text-lg font-bold text-blue-700">{t("a11")}</h2>
            <h1 className="flex justify-center text-4xl text-gray-900 font-normal mb-2 lg:mb-7">{t("a12")}</h1>
            <div className="container px-5 py-12 lg:py-24 mx-auto flex flex-wrap">


                <div className="rounded-lg h-auto bg-gray-100 lg:w-1/2 w-full mb-4 lg:mb-0">
                    <img alt="feature" className="object-cover object-center h-8/12 w-full" src={img1} />
                    <div className='flex items-center justify-center px-6 py-3.5'>
                        <div className='flex flex-col my-auto'>
                            <h2 className='text-2xl'>{t("a13")}</h2>
                            <p className='text-base w-11/12'>"{t("a14")}"</p>
                        </div>
                      
                    </div>


                </div>
                <div className="flex flex-col flex-wrap lg:w-1/2 lg:pl-2.5 lg:text-left text-center">
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img2} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">{t("a15")}</h2>
                            <p className='text-base'>"{t("a16")}"</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img3} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">{t("a17")}</h2>
                            <p className=" text-base">"{t("a18")}"</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img4} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">{t("a19")}</h2>
                            <p className="text-base">"{t("a20")}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section >

        <Footer />
      </div>
    </>
    
    
  )
}

export default Landing