import React from "react";
import { tenderdetailsquery } from "../../api/tender";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import BidList from "../bids/BidList";
import TenderDetailsCard from "./TenderDetailsCard";
import QASection from "./QASection";

const TenderDetails = () => {
  const { tenderId } = useParams();
  const { data: tenderDetails, isLoading, isError } = tenderdetailsquery(tenderId);

  if (isLoading) return <Loading />;
  if (isError)   return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      Failed to load tender details.
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      <TenderDetailsCard tenderDetails={tenderDetails} />
      <BidList />
      <QASection tenderStatus={tenderDetails?.status} />
    </div>
  );
};

export default TenderDetails;
