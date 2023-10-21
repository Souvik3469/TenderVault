// import React from 'react';

// const Rightdownbar = () => {
//   // Mock data for registered companies
//   const companies = ['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'];

//   return (
//     <div className="  bg-white border-4 border-sky-500 shadow p-4  ">
//       <h2 className="text-xl font-semibold mb-4">Registered Companies</h2>
//       <ul className="space-y-2">
//         {companies.map((company, index) => (
//           <li key={index}>
//             <a href="#" className="text-blue-500 hover:underline">
//               {company}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Rightdownbar;

import { Avatar } from "@chakra-ui/react";
import React from "react";
import { FaShoppingBag } from "react-icons/fa";

const Rightdownbar = () => {
  // Dummy array of vendors
  const dummyVendors = [
    {
      id: 1,
      username: "Vendor1dsgs vdfrgffffff ffffffffff ffffffff ffffffffffdcccsss cds",
      picture: "vendor1-image-url",
    },
    {
      id: 2,
      username: "Vendor2",
      picture: "vendor2-image-url",
    },
    {
      id: 3,
      username: "Vendor2",
      picture: "vendor2-image-url",
    },
    {
      id: 4,
      username: "Vendor2",
      picture: "vendor2-image-url",
    },
    {
      id: 5,
      username: "Vendor2",
      picture: "vendor2-image-url",
    },
    {
      id: 2,
      username: "Vendor2",
      picture: "vendor2-image-url",
    },
    // Add more vendors as needed
  ];

  return (
    <div className="w-[70%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50  overflow-scroll scrollbar-hide">
       <div className="sticky top-0 z-40 bg-blue-700 p-1     h-10 w-full   ">
        <h1 className=" text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full ">
         Registered Vendors
        </h1>
      </div>
      <ul>
        {dummyVendors.map((vendor) => {
          return (
       
             <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto"key={vendor.id}>
              <Avatar className="w-10 h-10 bg-gray-400 rounded-3xl" src={vendor.picture} />
              <h3
                className=" text-gray-900 group-hover:text-gray-200 font-semibold"
                // Handle navigation or any other action as needed
              >
                {vendor.username}
              </h3>
            
            </div>
      
       
          );
        })}
      </ul>
    </div>
  );
};

export default Rightdownbar;
