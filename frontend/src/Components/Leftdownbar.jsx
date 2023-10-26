import React, { useState } from 'react';

const Leftdownbar = () => {

  const dummyPriceRanges = [
    {
      id: 1,
      label: 'Under $100',
    },
    {
      id: 2,
      label: '$100 - $500',
    },
    {
      id: 3,
      label: '$500 - $1000',
    },
    {
      id: 4,
      label: 'Over $1000',
    },
  ];

  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const handlePriceRangeChange = (priceRangeId) => {
    if (selectedPriceRanges.includes(priceRangeId)) {
      setSelectedPriceRanges(selectedPriceRanges.filter((id) => id !== priceRangeId));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, priceRangeId]);
    }
  };

  return (
    <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Price Ranges
        </h1>
      </div>
      <ul>
        {dummyPriceRanges.map((priceRange) => (
          <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto" key={priceRange.id}>
            <input
              type="checkbox"
              id={`price-range-${priceRange.id}`}
              checked={selectedPriceRanges.includes(priceRange.id)}
              onChange={() => handlePriceRangeChange(priceRange.id)}
              style={{ transform: 'scale(1.5)' }}
            />
            <label
              htmlFor={`price-range-${priceRange.id}`}
              className={`text-base ${selectedPriceRanges.includes(priceRange.id) ? 'text-gray-600'  : 'text-gray-400'} font-semibold`}
            >
              {priceRange.label}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Leftdownbar;
