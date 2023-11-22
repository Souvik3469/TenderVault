import React, { useState,useEffect } from 'react';
import Rightupbar from './Rightupbar';
import Rightdownbar from './Rightdownbar';
import { getalltenderquery, getMyTendersQuery, deleteTender,searchTendersQuery ,getallcategoryquery} from '../api/tender/index';
import { GetUserQuery } from '../api/user';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { RiSearchLine } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import LogoutIcon from '@mui/icons-material/Logout';
import {
  
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,

} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Profile1 = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
   const [showSoldTenders, setShowSoldTenders] = useState(true);
  const [tenderToDelete, setTenderToDelete] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
   const [loadingDelete, setLoadingDelete] = useState('');
 const { data: searchResults, isLoading: searchResultsLoading, isError: searchResultsError } = searchTendersQuery(searchTerm);
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = GetUserQuery();

 const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = getallcategoryquery();
  const { data: allTenders, isLoading: allTendersLoading, isError: allTendersError,  refetch: refetchAllTenders} = getalltenderquery();

  
  const { data: userTenders, isLoading: userTendersLoading, isError: userTendersError, refetch: refetchUserTenders} = getMyTendersQuery();
 const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

   if (profileLoading || allTendersLoading || userTendersLoading||categoriesLoading||loadingDelete) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }

  if (profileError || allTendersError || userTendersError||categoriesError) {
    return <div>Error loading data.</div>;
  }
const dummyPriceRanges = [
  {
    id: 1,
    label: 'Under 1000',
    minPrice: 0,
    maxPrice: 1000,
  },
  {
    id: 2,
    label: '1001 - 1500',
    minPrice: 1001,
    maxPrice: 1500,
  },
  {
    id: 3,
    label: '1501 - 2000',
    minPrice: 1501,
    maxPrice: 2000,
  },
  {
    id: 4,
    label: '2001 - 2500',
    minPrice: 2001,
    maxPrice: 2500,
  },
  {
    id: 5,
    label: 'Over 2500',
    minPrice: 2501,
    maxPrice: Infinity,
  },
];
const handlePriceRangeChange = (priceRangeId) => {
  if (selectedPriceRanges.includes(priceRangeId)) {
    setSelectedPriceRanges(selectedPriceRanges.filter((range) => range !== priceRangeId));
  } else {
    setSelectedPriceRanges([...selectedPriceRanges, priceRangeId]);
  }
};
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


  const handleSearch =  () => {
    try {
     
    } catch (error) {
      console.error('Error searching tenders', error);
    }
  };


 const filteredTenders = userTenders?.filter((tender) => {
  const categoryName = tender?.category?.toLowerCase();

  const isCategorySelected = selectedCategories?.length === 0 || selectedCategories?.includes(categoryName);

  const isPriceInRange =
    selectedPriceRanges?.length === 0 ||
    selectedPriceRanges?.some((priceRangeId) => {
      const range = dummyPriceRanges?.find((r) => r.id === priceRangeId);
      return range && tender.cost >= range.minPrice && tender.cost <= range.maxPrice;
    });

  if (showSoldTenders) {
    return isCategorySelected && tender.status === 'sold' && isPriceInRange;
  } else {
    return isCategorySelected && tender.status !== 'sold' && isPriceInRange;
  }
});

 const allfilteredTenders = allTenders?.filter((tender) => {
  const categoryName = tender?.category?.toLowerCase();

  const isCategorySelected = selectedCategories?.length === 0 || selectedCategories?.includes(categoryName);

  const isPriceInRange =
    selectedPriceRanges?.length === 0 ||
    selectedPriceRanges?.some((priceRangeId) => {
      const range = dummyPriceRanges?.find((r) => r.id === priceRangeId);
      return range && tender.cost >= range.minPrice && tender.cost <= range.maxPrice;
    });

  if (showSoldTenders) {
    return isCategorySelected && tender.status === 'sold' && isPriceInRange;
  } else {
    return isCategorySelected && tender.status !== 'sold' && isPriceInRange;
  }
});

 const handleCategoryChange = (categoryId) => {
    const categoryName = categories[categoryId].toLowerCase();

    if (selectedCategories?.includes(categoryName)) {
      setSelectedCategories(selectedCategories?.filter((name) => name !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };
  const handleDeleteTender = async (tenderId) => {
    try {
      setLoadingDelete(true);
    const result = await deleteTender(tenderId);

    if (result.success) {
    
      console.log(result.message);

    refetchUserTenders();
    refetchAllTenders();
   showToast('Tender Deleted Successfully', 'success');
     closeConfirmation();
    } 
  }catch (error) {
      console.error(result.message);
        showToast('Some Error Occured in Deleting Tender', 'error');
    }
    finally{
      setLoadingDelete(false);
    }
   
  };

  const openConfirmation = (tenderId) => {
  
    setTenderToDelete(tenderId);
    setConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setTenderToDelete(null);
    setConfirmationOpen(false);
  };

  
 const renderTenders = () => {
    if (searchTerm !== '' && searchResults) {
      if (searchResults?.length === 0) {
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
                  src={tender.imageUrl|| 'https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo='}
                  alt={tender.companyName}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h2 className="text-xl font-semibold">{tender.title}</h2>
                <p className="text-gray-600 text-sm">{tender.description}</p>
                <p className="text-gray-400 text-sm mt-2">Reference Id: {tender.id}</p>
                <p className="text-gray-400 text-sm mt-2">Company: {tender.companyName}</p>
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
          ))}
        </div>
      );
    } else {
      if(userProfile?.role=="company"){
      if (filteredTenders?.length === 0) {
        return <p className="text-gray-600">No tenders found.</p>;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          {filteredTenders?.map((tender) => (
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
                  src={tender.imageUrl||'https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo='}
                  alt={tender.companyName}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h2 className="text-xl font-semibold">{tender.title}</h2>
                <p className="text-gray-600 text-sm">{tender.description}</p>
                <p className="text-gray-400 text-sm mt-2">Reference Id: {tender.id}</p>
                <p className="text-gray-400 text-sm mt-2">Company: {tender.companyName}</p>
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
       
          ))}
           <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
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
    }
    else if(userProfile?.role==="vendor"){
        if (allfilteredTenders?.length === 0) {
        return <p className="text-gray-600">No tenders found.</p>;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          {allfilteredTenders?.map((tender) => (
            tender.buyerId === userProfile.id && (
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
                  src={tender.imageUrl||'https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo='}
                  alt={tender.companyName}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h2 className="text-xl font-semibold">{tender.title}</h2>
                <p className="text-gray-600 text-sm">{tender.description}</p>
                <p className="text-gray-400 text-sm mt-2">Reference Id: {tender.id}</p>
                <p className="text-gray-400 text-sm mt-2">Company: {tender.companyName}</p>
                <p className="text-gray-400 text-sm">Category: {tender.category}</p>
                <p className="text-gray-400 text-sm">Cost: {tender.cost}</p>
                <p className="text-gray-400 text-sm">Status: {tender.status}</p>
                <div className="flex items-center mt-2">
                
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
              </div>
          
             
                      <div className="mt-4 flex justify-center items-center">
              
                <Link to={`/tender/${tender.id}`}>
                  <button className="bg-green-500 text-white rounded-md px-2 py-1 mr-2">
                    Details
                  </button>
                </Link>
              </div>
              </div>
            </div>
         ) ))}
           <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
        </div>
      );
    }
  }
  
  };
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
               
       {
  userProfile && userProfile?.role === "company" && (
    <Link to="/createtender">
      <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
        Create
      </span>
    </Link>
  )
}
                

               
               <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer"> Hello, {userProfile?.name}</span>
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
              <div className="sticky top-0 z-0 bg-blue-700 p-1 h-10 w-full">
                <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
                  Registered Categories
                </h1>
              </div>
              <ul>
                {categories?.map((category, index) => (
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
                          ? 'text-gray-800'
                          : 'text-gray-800'
                      } font-semibold`}
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </ul>
            </div>
            {/* <Leftdownbar /> */}
    <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide">
      <div className="sticky top-0 z-0 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Price Ranges (in Lakhs)
        </h1>
      </div>
      <ul>
       {dummyPriceRanges?.map((priceRange) => (
                <div
                  className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-500 hover:text-gray-100 p-1 group cursor-pointer hover:shadow-lg m-auto"
                  key={priceRange.id}
                >
                  <input
                    type="checkbox"
                    id={`price-range-${priceRange.id}`}
                    checked={selectedPriceRanges.includes(priceRange.id)}
                    onChange={() => handlePriceRangeChange(priceRange.id)}
                    style={{ transform: 'scale(1.5)' }}
                  />
                  <label
                    htmlFor={`price-range-${priceRange.id}`}
                    className={`text-base ${
                      selectedPriceRanges.includes(priceRange.id) ? 'text-gray-800' : 'text-gray-800 '
                    } font-semibold`}
                  >
                    {priceRange.label}
                  </label>
                </div>
              ))}

      </ul>
    </div>
   </div>
          <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
                 <div className="p-4 text-center">
       <div className="relative inline-block">
          <img
            src={userProfile.profileImage || 'https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg'}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
        <p className="text-gray-600">{userProfile.role}</p>
     </div>
     
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
       <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    </div>
 
  );
};

export default Profile1;
