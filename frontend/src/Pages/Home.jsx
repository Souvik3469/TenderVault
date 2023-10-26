import React, { useState } from 'react';
import { getallcategoryquery, getalltenderquery } from '../api/tender';
import Navbar from '../Components/Navbar';
import Rightdownbar from '../Components/Rightdownbar';
import Leftdownbar from '../Components/Leftdownbar';
import Rightupbar from '../Components/Rightupbar';

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

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = getallcategoryquery();
  const { data: tenders, isLoading: tendersLoading, isError: tendersError } = getalltenderquery();
 if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  if (categoriesError) {
    return <div>Error loading categories.</div>;
  }
   if (tendersLoading) {
    return <div>Loading categories...</div>;
  }

  if (tendersError) {
    return <div>Error loading categories.</div>;
  }
  const filteredTenders = tenders.filter((tender) => {
    if (selectedCategories.length === 0) {
      return true; 
    } else {
      return selectedCategories.includes(tender.category.toLowerCase());
    }
  });

  const handleCategoryChange = (categoryId) => {
    const categoryName = categories[categoryId].toLowerCase();

    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter((name) => name !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

 

  return (
    <div className="t">
      <div className="">
        <Navbar />
        <div className="flex flex-row h-[90vh]">
          {/* Leftupbar */}

          <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
            <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
              <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
                <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">Categories</h1>
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
            <Leftdownbar/>
          </div>
              <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredTenders.map((tender) => (
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
          <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
            <Rightupbar />
            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
