// import React from 'react';

// // Helper function to generate a star rating UI
// const renderStarRating = (rating) => {
//   const stars = [];
//   for (let i = 0; i < 5; i++) {
//     stars.push(
//       <span
//         key={i}
//         className={`text-yellow-400 ${
//           i < rating ? 'text-opacity-100' : 'text-opacity-40'
//         } text-lg mr-1`}
//       >
//         ★
//       </span>
//     );
//   }
//   return stars;
// };

// const Home1 = () => {
//   // Sample data for tender cards (you would replace this with your actual data)
//   const tenders = [
//     {
//       id: 1,
//       companyName: 'Company A',
//       tenderName: 'Tender 1',
//       description: 'Description for Tender 1',
//       pictureUrl:
//         'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
//       cost: '$5,000',
//       closingDate: 'September 30, 2023',
//       rating: 4, // Add the rating for each tender
//     },
//     {
//       id: 2,
//       companyName: 'Company B',
//       tenderName: 'Tender 2',
//       description: 'Description for Tender 2',
//       pictureUrl:
//         'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
//       cost: '$8,000',
//       closingDate: 'October 15, 2023',
//       rating: 5, // Add the rating for each tender
//     },
//     {
//       id: 3,
//       companyName: 'Company B',
//       tenderName: 'Tender 2',
//       description: 'Description for Tender 2',
//       pictureUrl:
//         'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
//       cost: '$8,000',
//       closingDate: 'October 15, 2023',
//       rating: 5, // Add the rating for each tender
//     },
//     {
//       id: 4,
//       companyName: 'Company B',
//       tenderName: 'Tender 2',
//       description: 'Description for Tender 2',
//       pictureUrl:
//         'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
//       cost: '$8,000',
//       closingDate: 'October 15, 2023',
//       rating: 5, // Add the rating for each tender
//     },
//     {
//       id: 5,
//       companyName: 'Company B',
//       tenderName: 'Tender 2',
//       description: 'Description for Tender 2',
//       pictureUrl:
//         'https://media.istockphoto.com/id/496119890/photo/new-road-construction.jpg?s=612x612&w=0&k=20&c=yyBsEAcd07RME72Dlykh5x018xvv7dG3lQ55y_wrvlA=',
//       cost: '$8,000',
//       closingDate: 'October 15, 2023',
//       rating: 5, // Add the rating for each tender
//     },
//     // Add more tender objects here
//   ];

//   return (
//     <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//         {tenders.map((tender) => (
//           <div
//             key={tender.id}
//             className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg"
//             style={{
//               boxShadow:
//                 '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//             }}
//           >
//             <img
//               src={tender.pictureUrl}
//               alt={tender.companyName}
//               className="w-full h-40 object-cover rounded-lg mb-2"
//             />
//             <h2 className="text-xl font-semibold">{tender.tenderName}</h2>
//             <p className="text-gray-600 text-sm">{tender.description}</p>
//             <p className="text-gray-400 text-sm mt-2">
//               Company: {tender.companyName}
//             </p>
//             <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
//             <p className="text-gray-400 text-sm">Closing Date: {tender.closingDate}</p>
//             <div className="flex items-center mt-2">
//               <div className="mr-2">{renderStarRating(tender.rating)}</div>
//               <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
//             </div>
//             <div className="mt-4">
//               <button className="bg-blue-500 text-white rounded-md px-3 py-1 mr-2">
//                 Bid
//               </button>
//               <button className="bg-gray-400 text-white rounded-md px-3 py-1">
//                 Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home1;


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getalltenderquery } from '../api/tender/index'; // Import the function to get all tenders

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
  // Use the `useQuery` hook to fetch all tenders
  const { data: tenders, isLoading, isError } = getalltenderquery();
//console.log("Tenders:",tenders)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading tenders.</div>;
  }

  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
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
              src={tender.pictureUrl}
              alt={tender.companyName}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <h2 className="text-xl font-semibold">{tender.tenderName}</h2>
            <p className="text-gray-600 text-sm">{tender.description}</p>
            <p className="text-gray-400 text-sm mt-2">
              Company: {tender.companyName}
            </p>
            <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
            <p className="text-gray-400 text-sm">Closing Date: {tender.closingDate}</p>
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
  );
};

export default Home1;

