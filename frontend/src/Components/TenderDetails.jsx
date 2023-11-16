import React, { useState, useEffect } from 'react';
import { getallbidsquery, createbid ,acceptBid,rejectBid} from '../api/bid';
import {GetUserQuery} from '../api/user'
import {tenderdetailsquery} from '../api/tender'
import { deletebid } from '../api/bid';

import { useParams } from 'react-router-dom';

import Loading from './Loading'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
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
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
   const [shouldRefetch, setShouldRefetch] = useState(false); 
  const { data: user, isLoading: userLoading, isError: userError } = GetUserQuery();
 
  const {
    data: tenderDetails,
    isLoading: tenderDetailsLoading,
    isError: tenderDetailsError,
    refetch: refetchTenderDetails,
  } = tenderdetailsquery(tenderId, {
    enabled: shouldRefetch, 
  });

 
  const { data: bids, isLoading: bidsLoading, isError: bidsError, refetch: refetchBids } = getallbidsquery(tenderId, {
    enabled: shouldRefetch,
  });
 useEffect(() => {
   
    if (shouldRefetch) {
      Promise.all([refetchTenderDetails(), refetchBids()]).then(() => setShouldRefetch(false));
    }
  }, [refetchTenderDetails, refetchBids, shouldRefetch]);

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };


  if (loadingAdd||shouldRefetch||loadingAccept||loadingReject||loadingDelete ) {
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
if (userLoading || tenderDetailsLoading || bidsLoading) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }
  const handleBid = async () => {
    try {
       setLoadingAdd(true); 
      const bidAmountFloat = parseFloat(bidAmount);

      if (isNaN(bidAmountFloat)) {
      
         showToast('Invalid bid amount:', 'error');
        return;
      }
      if(bidAmountFloat<tenderDetails.cost){
      
        showToast('Bid amount should be more than the cost of the tender', 'error');
       console.error('Bid amount should be more than cost of tender', bidAmount);
        return;
      }

      const newBid = await createbid(bidAmountFloat, tenderId);
      

      
      setIsBidding(false);
      setBidAmount(0);

     showToast('Bid Listed Successfully', 'success');
        setShouldRefetch(true);
    } catch (error) {
      console.error('Error creating bid:', error);
       showToast('Some Error occurred in listing bid', 'error');
      
    }
     finally {
      setLoadingAdd(false); 
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




   const handleDeleteBid = (bidId) => {
   
    setBidToDelete(bidId);
    setShowDeleteConfirmation(true);
  };

  const handleAcceptBid = (bidId) => {
  
    setBidToAccept(bidId);
    setShowAcceptConfirmation(true);
  };

  const handleRejectBid = (bidId) => {
   
    setBidToReject(bidId);
    setShowRejectConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (bidToDelete) {
      try {
         setLoadingDelete(true); 
        await deletebid(bidToDelete);

        showToast('Bid deleted successfully', 'success');
         setShouldRefetch(true);

      } catch (error) {
        console.error('Error deleting bid:', error);
 
         showToast('Some Error occurred in deleting bid', 'error');
      }
      finally{
        setLoadingDelete(false);
      }
    }

 
    setBidToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleConfirmAccept = async () => {
    if (bidToAccept) {
      try {
        setLoadingAccept(true); 
        await acceptBid(bidToAccept);

   showToast('Bid accepted successfully', 'success');
  setShouldRefetch(true);
  
      } catch (error) {
        console.error('Error accepting bid:', error);
   
         showToast('Some Error occurred in accepting bid', 'error');
      }
      finally{
         setLoadingAccept(false); 
      }
    }

  
    setBidToAccept(null);
    setShowAcceptConfirmation(false);
  };

  const handleConfirmReject = async () => {
    if (bidToReject) {
      try {
       setLoadingReject(true); 
        await rejectBid(bidToReject);

 showToast('Bid rejected successfully', 'success');

          setShouldRefetch(true);

      } catch (error) {
        console.error('Error rejecting bid:', error);

            showToast('Some Error occurred in accepting bid', 'error');
      }
      finally{
         setLoadingReject(false); 
      }
    }

    
    setBidToReject(null);
    setShowRejectConfirmation(false);
  };
 
  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide pt-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-4xl mx-4 md:mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={tenderDetails.imageUrl||'https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo='}
            alt={tenderDetails.title}
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-3xl font-bold">{tenderDetails.title}</h2>
            <p className="text-gray-600">{tenderDetails.companyName}</p>
            <p className="text-gray-600">{tenderDetails.id}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-700">{tenderDetails.category}</p>
          <p className="text-2xl text-blue-500">{tenderDetails.cost} Lakhs</p>
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
            {
              user.role==='vendor'&&(
                   <button
              onClick={() => setIsBidding(true)}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover-bg-green-600"
            >
              Bid
            </button>
              )
            }
           
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
        <p className="text-gray-700">Reference Id: {bid?.id}</p>
        <p className="text-gray-700">Vendor: {bid?.vendor.name}</p>
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
  <div className='flex items-center justify-center'>
  <p className="text-gray-600">No bids yet.</p>
  </div>
)}
      </div>

   
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
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    </div>
  );
};

export default TenderDetails;