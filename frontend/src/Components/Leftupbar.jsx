import React, { useState } from 'react';
import { getallcategoryquery } from '../api/tender';

const Leftupbar = () => {
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = getallcategoryquery();

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  if (categoriesError) {
    return <div>Error loading categories.</div>;
  }

  console.log('Categories:', categories);

  // State to track selected categories (normalized to lowercase)
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    // Normalize the category names to lowercase
    const categoryName = categories[categoryId].toLowerCase();

    // Check if the category is already selected
    if (selectedCategories.includes(categoryName)) {
      // If selected, remove it from the list
      setSelectedCategories(selectedCategories.filter((name) => name !== categoryName));
    } else {
      // If not selected, add it to the list
      setSelectedCategories([...selectedCategories, categoryName]);
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
        {categories.map((category, index) => (
          <div
            className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 p-1 group cursor-pointer hover:shadow-lg m-auto"
            key={index}
          >
            <input
              type="checkbox"
              id={`category-${index}`}
              checked={selectedCategories.includes(category.toLowerCase())}
              onChange={() => handleCategoryChange(index)}
              style={{ transform: 'scale(1.5)' }}
            />
            <label
              htmlFor={`category-${index}`}
              className={`text-base ${
                selectedCategories.includes(category.toLowerCase())
                  ? 'text-gray-600'
                  : 'text-gray-400'
              } font-semibold`}
            >
              {category}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Leftupbar;
