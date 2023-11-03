import React, { useState, useEffect } from 'react';
import { getallbidsquery, createbid ,acceptBid,rejectBid} from '../api/bid';
import {GetUserQuery} from '../api/user'
import { deletebid } from '../api/bid';

import { useParams } from 'react-router-dom';
import { tenderdetailsquery } from '../api/tender';
import { toast } from 'react-hot-toast';
import Loading from './Loading'
const TenderDetails = () => {
  const { tenderId } = useParams();
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [sortBy, setSortBy] = useState(null);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [bidToDelete, setBidToDelete] = useState(null);
  const [bidToAccept, setBidToAccept] = useState(null);
  const [bidToReject, setBidToReject] = useState(null);
  const { data: user, isLoading: userLoading, isError: userError } = GetUserQuery();
  const { data: tenderDetails, isLoading: tenderDetailsLoading, isError: tenderDetailsError } = tenderdetailsquery(tenderId);
  const { data: bids, isLoading: bidsLoading, isError: bidsError } = getallbidsquery(tenderId);

  if (userLoading || tenderDetailsLoading || bidsLoading) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
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

      toast.error('Failed to create a bid. Please try again later.', error);
    }
  };

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

  // State to control the confirmation dialog


   const handleDeleteBid = (bidId) => {
    // Display the confirmation dialog for deleting the bid
    setBidToDelete(bidId);
    setShowDeleteConfirmation(true);
  };

  const handleAcceptBid = (bidId) => {
    // Display the confirmation dialog for accepting the bid
    setBidToAccept(bidId);
    setShowAcceptConfirmation(true);
  };

  const handleRejectBid = (bidId) => {
    // Display the confirmation dialog for rejecting the bid
    setBidToReject(bidId);
    setShowRejectConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (bidToDelete) {
      try {
        // Send a request to your API to delete the bid
        // Replace with your actual API function for deleting bids.
        await deletebid(bidToDelete);

        // Remove the bid from the state if deletion was successful
        setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidToDelete));

        // Show a success message
        toast.success('Bid deleted successfully');
      } catch (error) {
        console.error('Error deleting bid:', error);
        // Handle the error, e.g., show an error message
        toast.error('Failed to delete the bid. Please try again later.');
      }
    }

    // Close the confirmation dialog
    setBidToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleConfirmAccept = async () => {
    if (bidToAccept) {
      try {
        // Send a request to your API to accept the bid
        // Replace with your actual API function for accepting bids.
        await acceptBid(bidToAccept);

        // Remove the accepted bid from the state
        setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidToAccept));

        // Show a success message
        toast.success('Bid accepted successfully');
      } catch (error) {
        console.error('Error accepting bid:', error);
        // Handle the error, e.g., show an error message
        toast.error('Failed to accept the bid. Please try again later.');
      }
    }

    // Close the confirmation dialog
    setBidToAccept(null);
    setShowAcceptConfirmation(false);
  };

  const handleConfirmReject = async () => {
    if (bidToReject) {
      try {
        // Send a request to your API to reject the bid
        // Replace with your actual API function for rejecting bids.
        await rejectBid(bidToReject);

        // Remove the rejected bid from the state
        setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidToReject));

        // Show a success message
        toast.success('Bid rejected successfully');
      } catch (error) {
        console.error('Error rejecting bid:', error);
        // Handle the error, e.g., show an error message
        toast.error('Failed to reject the bid. Please try again later.');
      }
    }

    // Close the confirmation dialog
    setBidToReject(null);
    setShowRejectConfirmation(false);
  };

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
        <p className="text-gray-500">Status: {bid.status}</p>
        <p className="text-gray-500">Date: {bid.updatedAt}</p>
      </div>
      <div>
        {loggedInUserId === tenderDetails.companyId ? (
          <div>
            {tenderDetails.status !== 'sold' && (
              <div className="flex space-x-2">
                {bid.status !== 'rejected' && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    onClick={() => handleAcceptBid(bid.id)}
                  >
                    Accept
                  </button>
                )}
                {bid.status !== 'rejected' && (
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover-bg-red-600"
                    onClick={() => handleRejectBid(bid.id)}
                  >
                    Reject
                  </button>
               ) }
              </div>
            )}
          </div>
        ) : (
          loggedInUserId === bid.vendorId && (
            // Conditionally render the "Delete" button based on bid status
            bid.status !== 'rejected' && (
              <button
                onClick={() => handleDeleteBid(bid.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            )
          )
        )}
      </div>
    </div>
  ))
) : (
  <p className="text-gray-600">No bids yet.</p>
)}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p>Are you sure you want to delete this bid?</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
     ) }

      {/* Accept Confirmation Dialog */}
      {showAcceptConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p>Are you sure you want to accept this bid?</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleConfirmAccept}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowAcceptConfirmation(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
    )  }

      {/* Reject Confirmation Dialog */}
      {showRejectConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p>Are you sure you want to reject this bid?</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={handleConfirmReject}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRejectConfirmation(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover-bg-blue-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
     ) }
    </div>
  );
};

export default TenderDetails;