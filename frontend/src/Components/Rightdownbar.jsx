
import { Avatar } from "@chakra-ui/react";
import React from "react";
import { GetVendorQuery } from "../api/user";
import Loading from "./Loading";

const Rightdownbar = () => {
  const { data: vendors, isLoading: vendorsLoading, isError: vendorsError } = GetVendorQuery();

  if (vendorsLoading) {
    return  <div style={{ minHeight: '800px',minWidth:'400px' }}>
        <Loading/>
      </div>
  }

  if (vendorsError) {
    return <div>Error loading vendors.</div>;
  }

  return (
    <div className="w-[70%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Registered Vendors
        </h1>
      </div>
      <ul>
        {vendors.map((vendor) => {
          return (
            <div
              className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto"
              key={vendor.id}
            >
              <Avatar className="w-10 h-10 bg-gray-400 rounded-3xl" src={vendor.profileImage} />
              <h3
                className="text-gray-900 group-hover:text-gray-200 font-semibold"
              >
                {vendor.name}
              </h3>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Rightdownbar;
