
import { Avatar } from "@chakra-ui/react";
import React from "react";
import { GetCompanyQuery } from "../api/user";
import Loading from "./Loading";
import { Link } from "react-router-dom";
const Rightupbar = () => {
  const { data: companies, isLoading: companiesLoading, isError: companiesError } = GetCompanyQuery();

  if (companiesLoading) {
    return  <div style={{ minHeight: '800px',minWidth:'400px' }}>
        <Loading />
      </div>
  }

  if (companiesError) {
    return <div>Error loading companies.</div>;
  }
// console.log("Companies",companies);
  return (
    <div className="w-[70%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Registered Companies
        </h1>
      </div>
      <ul>
        {companies.map((company) => {
          return (
            <div
              className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto"
              key={company.id}
            >
              <Avatar className="w-10 h-10 bg-gray-400 rounded-3xl" src={company.profileImage} />
              <Link to={`/profile/${company.id}`}>
              <h3
                className="text-gray-900 group-hover:text-gray-200 font-semibold"
              >
                {company.name}
              </h3>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Rightupbar;
