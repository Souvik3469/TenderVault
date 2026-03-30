import React from "react";
import TenderDetails from "./TenderDetails";
import Navbar from "../Navbar";
import { GetMyDetailsQuery } from "../../api/user";
import Loading from "../utils/Loading";

const TenderDetail = () => {
  const { data: user, isLoading } = GetMyDetailsQuery();

  if (isLoading) return <Loading />;

  return (
    <div className="page-container flex flex-col h-screen">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <TenderDetails />
      </div>
    </div>
  );
};

export default TenderDetail;
