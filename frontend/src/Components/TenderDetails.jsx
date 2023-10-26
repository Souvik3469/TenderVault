import React, { useState } from 'react';

const TenderDetails = ({ tender }) => {
  const [bids, setBids] = useState([]);
  const [isBidding, setIsBidding] = useState(false);

  const handleBid = () => {
    // You can implement the bid submission logic here and update the 'bids' state with the new bid.
    const newBid = {
      vendor: 'Your Company Name',
      amount: 1000, // Example bid amount
      date: new Date().toLocaleString(),
    };

    setBids([...bids, newBid]);
    setIsBidding(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-4xl mx-4 md:mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={tender.imageUrl}
            alt={tender.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-3xl font-bold">{tender.name}</h2>
            <p className="text-gray-600">{tender.company}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-700">{tender.category}</p>
          <p className="text-2xl text-blue-500">${tender.cost}</p>
          <p className="text-gray-600">Status: {tender.status}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {isBidding ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter your bid amount"
              className="w-48 py-2 px-3 border rounded-l-lg"
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
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          >
            Bid
          </button>
        )}
      </div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <h3 className="text-2xl font-semibold">Bids</h3>
        {bids.length > 0 ? (
          bids.map((bid, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-700">{bid.vendor} bid ${bid.amount}</p>
                <p className="text-gray-500">Submitted on {bid.date}</p>
              </div>
              <div>
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg mx-2 hover:bg-green-600">
                  Accept
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
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
