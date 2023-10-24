import React, { useState } from 'react';
import { createTender } from "../api/tender";
import toast from 'react-hot-toast';
import Navbar from './Navbar';

const Createtender = () => {
  // Define state variables for form fields
  const [tenderInfo, setTenderInfo] = useState({
    title: '',
    description: '',
    cost: 0.0, // Initialize cost as a float (0.0)
    category: '',
  });

  // Function to handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // If the input name is 'cost', convert the value to a float
    const floatValue = name === 'cost' ? parseFloat(value) : value;
    setTenderInfo((prevTenderInfo) => ({
      ...prevTenderInfo,
      [name]: floatValue,
    }));
  };

  // Function to handle form submission
  const createTenderHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await createTender(tenderInfo);

      if (response.success) {
        toast.success('Tender created successfully');

        setTenderInfo({
          title: '',
          description: '',
          cost: 0.0, // Reset cost to float (0.0)
          category: '',
        });
      } else {
        toast.error('Failed to create tender');
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      toast.error('Error creating tender: ' + error.message);
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
              type="number" // Use type "number" for float input
              step="0.01" // Define the step to allow decimal values
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
</div>
  );
};

export default Createtender;
