import React, { useState, useEffect } from 'react';
import { getallbidsquery, createbid } from '../api/bid';
import {GetUserQuery} from '../api/user'

import { useParams } from 'react-router-dom';
import { tenderdetailsquery } from '../api/tender';
import { toast } from 'react-hot-toast';
import Loading from './Loading'

const TenderDetails = () => {
  const { tenderId } = useParams();
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
   const [sortBy, setSortBy] = useState(null);
    const { data: user, isLoading: userLoading, isError: userError} = GetUserQuery();
   const { data: tenderDetails, isLoading: tenderDetailsLoading, isError: tenderDetailsError} = tenderdetailsquery(tenderId);
  const { data: bids, isLoading: bidsLoading, isError: bidsError } = getallbidsquery(tenderId); // Pass 'tenderId' to getallbidsquery

// console.log("TenderId",tenderId);
 if (userLoading || tenderDetailsLoading || bidsLoading) {
    return (
      <div style={{ minHeight: '800px',minWidth:'1200px' }}>
        <Loading />
      </div>
    );
  }
  if (userError) {
    return <div>Error loading loggedinuser.</div>;
  }

  if (tenderDetailsError) {
    return <div>Error loading tenderdetails.</div>;
  }

const handleBid = async () => {
  try {
    const bidAmountFloat = parseFloat(bidAmount);

    if (isNaN(bidAmountFloat)) {
      console.error('Invalid bid amount:', bidAmount);
       toast.error('Invalid bid amount:');
      return;
    }


    const newBid = await createbid(bidAmountFloat, tenderId);

    setBids((prevBids) => [newBid, ...prevBids]);

    setIsBidding(false);
    setBidAmount(0);
  } catch (error) {
     console.error('Error creating bid:', error);

      toast.error('Failed to create a bid. Please try again later.',error);
  }
}


 
  if (bidsError) {
    return <div><Loading/></div>;
  }
     const handleSort = (order) => {
    setSortBy(order);
  };
const loggedInUserId = user.id;
  const sortedBids = [...bids];

  if (sortBy === 'lowToHigh') {
    sortedBids.sort((a, b) => a.amount - b.amount);
  } else if (sortBy === 'highToLow') {
    sortedBids.sort((a, b) => b.amount - a.amount);
  }
 
console.log("Bids:",bids);
  return (
   <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide pt-4">
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
              style={{ alignSelf: 'center' }}
            >
              Submit Bid
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsBidding(true)}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover-bg-green-600"
            >
              Bid
            </button>
          </div>
        )}
      </div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex justify-center">
          <h3 className="text-2xl font-semibold">Bids</h3>
          <div className="ml-4 flex">
            <button
              className={`${
                sortBy === 'lowToHigh' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } py-2 px-4 rounded-l-lg hover-bg-blue-600`}
              onClick={() => handleSort('lowToHigh')}
            >
              Low to High
            </button>
            <button
              className={`${
                sortBy === 'highToLow' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } py-2 px-4 rounded-r-lg hover-bg-blue-600`}
              onClick={() => handleSort('highToLow')}
            >
              High to Low
            </button>
          </div>
        </div>
        {sortedBids?.length > 0 ? (
          sortedBids.map((bid, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-700">Vendor: {bid.vendorId}</p>
                <p className="text-gray-500">Amount: ${bid.amount}</p>
                <p className="text-gray-500">Date: {bid.updatedAt}</p>
              </div>
              <div>
                {loggedInUserId === tenderDetails.companyId ? (
                  <div>
                    <button className="bg-green-500 text-white py-2 px-4 rounded-lg mx-2 hover-bg-green-600">
                      Accept
                    </button>
                    <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover-bg-red-600">
                      Reject
                    </button>
                  </div>
                ) : (
                  loggedInUserId === bid.vendorId && (
                    <button
                      onClick={() => handleDeleteBid(bid.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover-bg-red-600"
                    >
                      Delete
                    </button>
                  )
                )}
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
