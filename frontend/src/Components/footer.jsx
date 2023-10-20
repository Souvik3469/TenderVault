import React from 'react'


function Footer() {
    return (
        <footer className="font-mont text-gray-50 bg-gray-900">
            <div className="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
                <p className="text-sm text-gray-50 sm:ml-6 sm:mt-0 mt-4">© 2023, TenderVault — All Rights Reserved.
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                    <a href='/' className="text-gray-50">
                        Home
                    </a>
                    <a href='/' className="ml-3 text-gray-50">
                        Blog
                    </a>
                    <a href='/' className="ml-3 text-gray-50">
                        Gallery
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