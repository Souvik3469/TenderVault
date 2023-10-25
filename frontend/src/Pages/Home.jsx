
import React from 'react'
import Navbar from '../Components/Navbar'

import Rightdownbar from '../Components/Rightdownbar'
import Rightupbar from '../Components/Rightupbar'
import Home1 from '../Components/Home1'
import Leftupbar from '../Components/Leftupbar'
import Leftdownbar from '../Components/Leftdownbar'

const Home = () => {
  return (
    
    // <div className="flex flex-col">
    //   <div className="sticky top-0">
    //     <Navbar />
    //   </div>
    //   <div className='flex flex-row'>
    //   <div className="flex flex-col p-4">
    //     <div className='p-4 '>
    //     <Leftupbar />
    //     </div>
    //     <div className='p-4'>
    //     <Leftdownbar />
    //     </div>
    //   </div>
    //   <div className="flex-1">
    //     <Home1 />
    //   </div>
    //   <div className="flex flex-col  p-4">
    //       <div className='p-4'>
    //     <Rightupbar />
    //     </div>
    //     <div className='p-4'>
    //     <Rightdownbar />
    //     </div>
    //   </div>
    //   </div>
    // </div>


     <div className="t">
      <div className="">
        <Navbar />
        <div className="flex flex-row h-[90vh] ">
        
       <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
          <Leftupbar />
          <Leftdownbar />
          </div>
    
          <Home1 />
    
          <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
            <Rightupbar />

            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
