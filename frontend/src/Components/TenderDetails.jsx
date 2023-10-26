import React, { useState, useEffect } from 'react';
import { getallbidsquery, createbid } from '../api/bid';
import { useParams } from 'react-router-dom';
import { tenderdetailsquery } from '../api/tender';

const TenderDetails = () => {
  const { tenderId } = useParams(); // Get the 'tenderId' from URL parameters
  // const [tenderDetails, setTenderDetails] = useState(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
   const { data: tenderDetails, isLoading: tenderDetailsLoading, isError: tenderDetailsError} = tenderdetailsquery(tenderId);
  const { data: bids, isLoading: bidsLoading, isError: bidsError } = getallbidsquery(tenderId); // Pass 'tenderId' to getallbidsquery

console.log("TenderId",tenderId);


  // useEffect(() => {
  //   // Fetch tender details based on tenderId
  //   tenderdetailsquery(tenderId)
  //     .then((data) => {
  //       setTenderDetails(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching tender details:', error);
  //     });
  // }, [tenderId]);

  // if (tenderDetails === null) {
  //   console.log("Tenderdnull");
  //   return <div>Loading tender details...</div>;
  // } else if (tenderDetails === undefined) {
  //    console.log("Tenderundef");
  //   return <div>Tender not found.</div>;
  // }
   if (tenderDetailsLoading) {
    return <div>Loading tenderdetails...</div>;
  }

  if (tenderDetailsError) {
    return <div>Error loading tenderdetails.</div>;
  }

console.log("TenderDetails1",tenderDetails);
  const handleBid = async () => {
    try {
      const newBid = await createbid(bidAmount, tenderId);
      setIsBidding(false);
    } catch (error) {
      console.error('Error creating bid:', error);
      // Handle error here
    }
  };

  if (bidsLoading) {
    return <div>Loading bids...</div>;
  }

  if (bidsError) {
    return <div>Error loading bids.</div>;
  }
console.log("Bids:",bids);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-4xl mx-4 md:mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={tenderDetails.imageUrl}
            alt={tenderDetails.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-3xl font-bold">{tenderDetails.name}</h2>
            <p className="text-gray-600">{tenderDetails.company}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-700">{tenderDetails.category}</p>
          <p className="text-2xl text-blue-500">${tenderDetails.cost}</p>
          <p className="text-gray-600">Status: {tenderDetails.status}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {isBidding ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter your bid amount"
              className="w-48 py-2 px-3 border rounded-l-lg"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={handleBid}
              className="bg-blue-500 text-white py-2 px-6 rounded-r-lg hover:bg-blue-600"
            >
              Submit Bid
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsBidding(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover-bg-green-600"
          >
            Bid
          </button>
        )}
      </div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <h3 className="text-2xl font-semibold">Bids</h3>
        {bids?.length > 0 ? (
          bids.map((bid, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-700">{bid.vendor}</p>
                <p className="text-gray-500">Amount: ${bid.amount}</p>
                <p className="text-gray-500">Date: {bid.date}</p>
              </div>
              <div>
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg mx-2 hover:bg-green-600">
                  Accept
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover-bg-red-600">
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No bids yet.</p>
        )}
      </div>
    </div>
  );
};

export default TenderDetails;
