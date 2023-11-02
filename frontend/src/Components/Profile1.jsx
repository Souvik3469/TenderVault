import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getalltenderquery, getMyTendersQuery, deleteTender } from '../api/tender/index';
import { GetUserQuery } from '../api/user';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-hot-toast';

// Helper function to generate a star rating UI
const renderStarRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-yellow-400 ${
          i < rating ? 'text-opacity-100' : 'text-opacity-40'
        } text-lg mr-1`}
      >
        ★
      </span>
    );
  }
  return stars;
};

const Profile1 = () => {
  const [tenderToDelete, setTenderToDelete] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  // Use the `useQuery` hook to fetch user profile
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = GetUserQuery();

  // Use the `useQuery` hook to fetch all tenders
  const { data: allTenders, isLoading: allTendersLoading, isError: allTendersError } = getalltenderquery();

  // Use the `useQuery` hook to fetch user's created tenders
  const { data: userTenders, isLoading: userTendersLoading, isError: userTendersError } = getMyTendersQuery();

  const handleDeleteTender = async (tenderId) => {
    const result = await deleteTender(tenderId);

    if (result.success) {
      // The tender was deleted successfully
      console.log(result.message);

      // Optionally, you can update your local state or perform other actions here
      // For example, you can remove the deleted tender from your local state.

      // Optionally, you can show a success toast message using react-hot-toast
      toast.success(result.message);
    } else {
      // Failed to delete the tender
      console.error(result.message);

      // Optionally, you can show an error toast message using react-hot-toast
      toast.error(result.message);
    }

    // Close the confirmation dialog
    closeConfirmation();
  };

  const openConfirmation = (tenderId) => {
    setTenderToDelete(tenderId);
    setConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setTenderToDelete(null);
    setConfirmationOpen(false);
  };

  if (profileLoading || allTendersLoading || userTendersLoading) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }

  if (profileError || allTendersError || userTendersError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
      {/* Display user information with improved styling */}
      <div className="p-4 text-center">
        <div className="relative inline-block">
          <img
            src={userProfile.avatarUrl || 'https://i.pinimg.com/originals/76/ec/75/76ec755f9404d4be609b951aebc80b18.jpg'}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
        <p className="text-gray-600">{userProfile.role}</p>
      </div>

      {/* Display user's tenders or all tenders based on their role */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        {userProfile.role === 'company' ? (
          userTenders?.map((tender) => (
            // Render cards for user's created tenders
            <div
              key={tender.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg"
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
                 <div className="flex flex-col items-center">
              <img
                src={tender.imageUrl}
                alt={tender.companyId}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-gray-600 text-sm">{tender.description}</p>
              <p className="text-gray-400 text-sm mt-2">Company: {tender.companyId}</p>
              <p className="text-gray-400 text-sm">Category: {tender.category}</p>
              <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
              <p className="text-gray-400 text-sm">Status: {tender.status}</p>
              <div className="flex items-center mt-2">
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <Link to={`/updatetender/${tender.id}`}>
                  <button className="bg-blue-500 text-white rounded-md px-2 py-1 mr-2">
                    Update
                  </button>
                </Link>
                <button
                  onClick={() => openConfirmation(tender.id)}
                  className="bg-red-500 text-white rounded-md px-2 py-1 mr-2"
                >
                  Delete
                </button>
                <Link to={`/tender/${tender.id}`}>
                  <button className="bg-green-500 text-white rounded-md px-2 py-1 mr-2">
                    Details
                  </button>
                </Link>
              </div>
            </div>
            </div>
          ))
        ) : (
          allTenders.map((tender) => (
            // Render cards for all tenders
            <div
              key={tender.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg"
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
                 <div className="flex flex-col items-center">
              <img
                src={tender.imageUrl}
                alt={tender.companyName}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-gray-600 text-sm">{tender.description}</p>
              <p className="text-gray-400 text-sm mt-2">Company: {tender.owner}</p>
              <p className="text-gray-400 text-sm">Category: {tender.category}</p>
              <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
              <p className="text-gray-400 text-sm">Status: {tender.status}</p>
              <div className="flex items-center mt-2">
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <Link to={`/tender/${tender.id}`}>
                  <button className="bg-green-500 text-white rounded-md px-3 py-1">
                    Details
                  </button>
                </Link>
              </div>
            </div>
            </div>
          ))
        )}
      </div>
      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this tender?</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeConfirmation}
                className="bg-gray-400 text-white rounded-md px-2 py-1 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTender(tenderToDelete);
                  closeConfirmation();
                }}
                className="bg-red-500 text-white rounded-md px-2 py-1"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile1;
