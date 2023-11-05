import React, { useState } from 'react';
import { getallcategoryquery, getalltenderquery,searchTendersQuery } from '../api/tender';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Rightdownbar from '../Components/Rightdownbar';
import Leftdownbar from '../Components/Leftdownbar';
import Rightupbar from '../Components/Rightupbar';
import Loading from '../Components/Loading';
import { AiOutlineSearch } from "react-icons/ai";
import LogoutIcon from '@mui/icons-material/Logout';
import { RiSearchLine } from "react-icons/ri";
import {
  
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,

} from "@mui/icons-material";

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
  const [showSoldTenders, setShowSoldTenders] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
    const [dropDown, setDropDown] = useState(false);


  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = getallcategoryquery();
  const { data: tenders, isLoading: tendersLoading, isError: tendersError } = getalltenderquery();
 const { data: searchResults, isLoading: searchResultsLoading, isError: searchResultsError } = searchTendersQuery(searchTerm);

 
  if (categoriesLoading || tendersLoading) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }

  if (categoriesError) {
    return <div>Error loading categories.</div>;
  }

  if (tendersError) {
    return <div>Error loading tenders.</div>;
  }

   const handleSearch =  () => {
    try {
      //const { data } =  searchTendersQuery(searchTerm);
      // Handle the search results (data) here
    } catch (error) {
      console.error('Error searching tenders', error);
    }
  };
 console.log("Search1:",searchResults?.data);
  // Filter tenders based on selected categories and whether to show sold or unsold tenders
    const filteredTenders1 = searchResults || tenders;
  const filteredTenders = tenders.filter((tender) => {
    const categoryName = tender.category.toLowerCase();
    const isCategorySelected = selectedCategories.length === 0 || selectedCategories.includes(categoryName);

    if (showSoldTenders) {
      return isCategorySelected && tender.status === 'sold';
    } else {
      return isCategorySelected && tender.status !== 'sold';
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

  // const toggleShowSoldTenders = () => {
  //   setShowSoldTenders(!showSoldTenders);
  // };
const renderTenders = () => {
  if (searchTerm !== '' && searchResults) {
    if (searchResults.length === 0) {
      return <div className="text-gray-600">No matches found.</div>;
    }
        return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        {searchResults?.data?.map((tender) => (
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
              <div className="mt-4">
                <button className="bg-blue-500 text-white rounded-md px-3 py-1 mr-2">
                  Bid
                </button>
                <Link to={`/tender/${tender.id}`}>
                  <button className="bg-gray-400 text-white rounded-md px-3 py-1">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  else {
    if (filteredTenders.length === 0) {
      return <p className="text-gray-600">No tenders found.</p>;
    }
       return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        {filteredTenders.map((tender) => (
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
              <div className="mt-4">
                <button className="bg-blue-500 text-white rounded-md px-3 py-1 mr-2">
                  Bid
                </button>
                <Link to={`/tender/${tender.id}`}>
                  <button className="bg-gray-400 text-white rounded-md px-3 py-1">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  }
  return (
    <div className="t">
      <div className="">
        {/* <Navbar /> */}
         <div className='flex flex-col bg-blue-950 w-full sticky top-0 z-50'>
         <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center justify-between">
            <Link to="/">
               <div>
                  <span className='font-mont text-blue-300 text-4xl font-bold'>Tender</span>
                  <span className='font-mont text-gray-50 text-xl font-bold'>Vault</span>
               </div>
            </Link>
              <div className="relative flex-1 px-4">
          <div className="absolute color-gray-900 inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <AiOutlineSearch />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="w-full py-2 text-sm text-gray-700 bg-gray-50 rounded-md pl-10 pr-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full bg-blue-400 px-3 flex items-center justify-center hover:bg-blue-600"
          >
            <RiSearchLine className="text-white" />
          </button>
        </div>
            <nav className="md:ml-auto flex flex-wrap pl-3 items-center text-base justify-center">
               <Link to="/home">
                  <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Home</span>
               </Link>
               {/* <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Language</span> */}
          
                <Link to="/createtender"><span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Create</span>
                </Link>

               
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">About us</span>
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
               <Link  onClick={() => {
                        localStorage.removeItem("token");
                      }}
                      to="/login">

      <LogoutIcon style={{ color: "white",fontSize: 32 }} />
      </Link>
      </span>
            </nav>
            <div className='flex mt-4 md:mt-0'>
               <Link to="/myprofile">
              <AccountCircleOutlined style={{ color: "white",fontSize: 32}} />
               </Link>
            </div>
           
         </div>
      </div>
        <div className="flex flex-row h-[90vh]">
          <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
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
            <Leftdownbar />
          </div>
          <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
            <div className="flex justify-between p-4 px-16">
              <h1
                className={`cursor-pointer font-bold text-xl ${
                  !showSoldTenders ? 'text-blue-700' : 'text-gray-500'
                }`}
                onClick={() => setShowSoldTenders(false)}
              >
                Unsold Tenders
              </h1>
              <h1
                className={`cursor-pointer font-bold text-xl ${
                  showSoldTenders ? 'text-blue-700' : 'text-gray-500'
                }`}
                onClick={() => setShowSoldTenders(true)}
              >
                Sold Tenders
              </h1>
            </div>
            {renderTenders()}
          </div>
          <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
            <Rightupbar />
            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;