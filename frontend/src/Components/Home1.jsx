

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getalltenderquery } from '../api/tender/index'; // Import the function to get all tenders
// import Leftupbar from './Leftupbar';
// import Leftdownbar from './Leftdownbar';

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

const Home1 = () => {

  const { data: tenders, isLoading, isError } = getalltenderquery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tenders.</div>;
  }
console.log("tender",tenders);
  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
      
        
       {/* <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
          <Leftupbar />
          <Leftdownbar/>
        </div> */}
         <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {tenders.map((tender) => (
          
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
            <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
            <p className="text-gray-400 text-sm">Status: {tender.status}</p>
            <div className="flex items-center mt-2">
              <div className="mr-2">{renderStarRating(tender.rating)}</div>
              <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-500 text-white rounded-md px-3 py-1 mr-2">
                Bid
              </button>
              <button className="bg-gray-400 text-white rounded-md px-3 py-1">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Home1;
