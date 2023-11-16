
import React from 'react'
import Navbar from '../Components/Navbar'

import Rightdownbar from '../Components/Rightdownbar'
import Rightupbar from '../Components/Rightupbar'

import Leftupbar from '../Components/Leftupbar'
import Leftdownbar from '../Components/Leftdownbar'
import Profile1 from './Profile1'

const Profile = () => {
  return (



     <div className="t">
      <div className="">
        <Navbar />
        <div className="flex flex-row h-[90vh] ">
          {/* <div className="bg-zinc-900 w-[42%] py-12 px-5 hidden lg:flex ">
      <div className="flex justify-left bg-zinc-800 w-full h-[95%] rounded-2xl "> */}
       <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
          {/* <Leftupbar /> */}
          <Leftdownbar />
          </div>
          {/* </div>
    </div> */}
          <Profile1 />
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
}

export default Profile;
