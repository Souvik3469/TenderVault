import React, { useState } from 'react';

const Createtender = () => {
  // Define state variables for form fields
  const [tenderName, setTenderName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [document, setDocument] = useState(null);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform actions with form data (e.g., send to a server)

    // Reset form fields
    setTenderName('');
    setDescription('');
    setCost('');
    setCategory('');
    setDocument(null);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">Create New Tender</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tenderName" className="block text-gray-700 text-sm font-bold">
              Tender Name
            </label>
            <input
              type="text"
              id="tenderName"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={tenderName}
              onChange={(e) => setTenderName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold">
              Tender Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cost" className="block text-gray-700 text-sm font-bold">
              Cost
            </label>
            <input
              type="text"
              id="cost"
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
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
              className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Create Tender
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createtender;
