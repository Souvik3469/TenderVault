import React from 'react';

const Leftdownbar = () => {
  // Mock data for registered companies
   const companies = ['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'];

  return (
    <div className="  bg-white border-4 border-sky-500 shadow p-4  ">
      <h2 className="text-xl font-semibold mb-4">Registered Companies</h2>
      <ul className="space-y-2">
        {companies.map((company, index) => (
          <li key={index}>
            <a href="#" className="text-blue-500 hover:underline">
              {company}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Leftdownbar;
