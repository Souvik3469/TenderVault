import React from 'react'

import { Link } from 'react-router-dom';
function Footer() {
    return (
        <footer className="font-mont text-gray-50 bg-gray-900">
            <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
                <p className="text-sm text-gray-50 sm:ml-6 sm:mt-0 mt-4">© 2023, TenderVault — All Rights Reserved.
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                   <Link to="/home">
                        Home
                   </Link>
                    <a href='/' className="ml-3 text-gray-50">
                        About Us
                    </a>
                    <a href='/' className="ml-3 text-gray-50">
                        Explore
                    </a>
                    <a href='/' className="ml-3 text-gray-50">
                        Stories
                    </a>
                      <a href='/' className="ml-3 text-gray-50">
                        Contact Us
                    </a>
                </span>
            </div>
        </footer>
    )
}


export default Footer