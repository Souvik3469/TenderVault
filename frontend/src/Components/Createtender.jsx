import React, { useState } from 'react';
import { createTender } from "../api/tender";
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Createtender = () => {
  const [tenderInfo, setTenderInfo] = useState({
    title: '',
    description: '',
    cost: 0.0, 
    category: '',
  });
   const toastsuccess = () => toast.success('Tender Listed Succesfully', {
position: "top-center",
autoClose: 5000,
hideProgressBar: true,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
   const toastfailure = () => toast.error('Some Error occured in listing tender', {
position: "top-center",
autoClose: 5000,
hideProgressBar: true,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
});
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const floatValue = name === 'cost' ? parseFloat(value) : value;
    setTenderInfo((prevTenderInfo) => ({
      ...prevTenderInfo,
      [name]: floatValue,
    }));
  };

  const createTenderHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await createTender(tenderInfo);

      if (response.success) {
toastsuccess();
        setTenderInfo({
          title: '',
          description: '',
          cost: 0.0,
          category: '',
        });
      } else {
        toastfailure();
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      toastfailure();
    }
  };

  return (
<div>   <Navbar/>
     
    <div className="bg-gray-200 min-h-[90vh] flex flex-col items-center justify-center">
    
      <div className="bg-white p-8 h-[87.5vh] rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">Create New Tender</h1>
        <form onSubmit={createTenderHandler}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold">
              Tender Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={tenderInfo.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold">
              Tender Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={tenderInfo.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cost" className="block text-gray-700 text-sm font-bold">
              Cost
            </label>
            <input
              type="number" 
              step="0.01" 
              id="cost"
              name="cost"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={tenderInfo.cost}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={tenderInfo.category}
              onChange={handleInputChange}
              required
            />
          </div>
            <div className="mb-4">
            <label htmlFor="document" className="block text-gray-700 text-sm font-bold">
              Upload Document
            </label>
            <input
              type="file"
              id="document"
              accept=".pdf, .doc, .docx"
              onChange={(e) => setDocument(e.target.files[0])}
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover-bg-blue-600 focus:outline-none"
          >
            Create Tender
          </button>
        </form>
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

export default Createtender;
