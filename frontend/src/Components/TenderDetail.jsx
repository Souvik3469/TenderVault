import React from 'react';
import TenderDetails from './TenderDetails';
import Navbar from './Navbar';
import Rightupbar from './Rightupbar';
import Rightdownbar from './Rightdownbar';
import Leftupbar from './Leftupbar';
import Leftdownbar from './Leftdownbar';

const TenderDetail = () => {
  return (
   
     <div className="t">
      <div className="">
        <Navbar />
        <div className="flex flex-row h-[90vh] min-w-screen ">
          {/* <div className="bg-zinc-900 w-[42%] py-12 px-5 hidden lg:flex ">
      <div className="flex justify-left bg-zinc-800 w-full h-[95%] rounded-2xl "> */}
       {/* <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
          <Leftupbar />
          <Leftdownbar />
          </div> */}
          {/* </div>
    </div> */}
          <TenderDetails />
          {/* <div className="flex flex-col bg-zinc-900 w-[42%] py-12 px-5 hidden lg:flex ">
      <div className="flex justify-left bg-zinc-800 w-full h-[95%] rounded-2xl "> */}
          <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
            <Rightupbar />

            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
