import React, { useState } from 'react';

const Leftupbar = () => {
  // Dummy array of categories
  const dummyCategories = [
    {
      id: 1,
      name: 'Category 1',
    },
    {
      id: 2,
      name: 'Category 2',
    },
    {
      id: 3,
      name: 'Category 3',
    },
    // Add more categories as needed
  ];

  // State to track selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    // Check if the category is already selected
    if (selectedCategories.includes(categoryId)) {
      // If selected, remove it from the list
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      // If not selected, add it to the list
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Categories
        </h1>
      </div>
      <ul>
        {dummyCategories.map((category) => (
          <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto" key={category.id}>
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              style={{ transform: 'scale(1.5)' }} 
            />
            <label
              htmlFor={`category-${category.id}`}
              className={`text-base ${selectedCategories.includes(category.id) ? 'text-gray-600' : 'text-gray-400'} font-semibold`}
            >
              {category.name}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Leftupbar;
