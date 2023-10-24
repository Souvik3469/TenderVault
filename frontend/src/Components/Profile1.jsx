import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getalltenderquery, getMyTendersQuery } from '../api/tender/index';
import { GetUserQuery } from '../api/user';

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
  // Use the `useQuery` hook to fetch user profile
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = GetUserQuery();

  // Use the `useQuery` hook to fetch all tenders
  const { data: allTenders, isLoading: allTendersLoading, isError: allTendersError } = getalltenderquery();

  // Use the `useQuery` hook to fetch user's created tenders
  const { data: userTenders, isLoading: userTendersLoading, isError: userTendersError } = getMyTendersQuery();

  if (profileLoading || allTendersLoading || userTendersLoading) {
    return <div>Loading...</div>;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {userProfile.role === 'company' ? (
          userTenders.map((tender) => (
            // Render cards for user's created tenders
            <div
              key={tender.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg"
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <img
                src={tender.imageUrl}
                alt={tender.companyName}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-gray-600 text-sm">{tender.description}</p>
              <p className="text-gray-400 text-sm mt-2">
                Company: {tender.owner}
              </p>
              <p className="text-gray-400 text-sm">Category: {tender.category}</p>
              <p className="text-gray-400 text-sm">Cost: {tender.cost}</p> {/* Added cost */}
              <p className="text-gray-400 text-sm">Status: {tender.status}</p>
              <div className="flex items-center mt-2">
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <button className="bg-blue-500 text-white rounded-md px-2 py-1 mr-2">
                  Update
                </button>
                <button className="bg-red-500 text-white rounded-md px-2 py-1 mr-2">
                  Delete
                </button>
                <button className="bg-green-500 text-white rounded-md px-2 py-1 mr-2">
                  Details
                </button>
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
              <img
                src={tender.imageUrl}
                alt={tender.companyName}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-gray-600 text-sm">{tender.description}</p>
              <p className="text-gray-400 text-sm mt-2">
                Company: {tender.owner}
              </p>
              <p className="text-gray-400 text-sm">Category: {tender.category}</p>
              <p className="text-gray-400 text-sm">Cost: {tender.cost}</p> {/* Added cost */}
              <p className="text-gray-400 text-sm">Status: {tender.status}</p>
              <div className="flex items-center mt-2">
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <button className="bg-green-500 text-white rounded-md px-3 py-1">
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile1;
