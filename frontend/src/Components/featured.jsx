import React from 'react'
import featured from "../img/featured1.jpg"
import icon2 from "../icons/icon2.png"

function Featured() {
    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container py-24 flex items-center mx-auto">
                <div className="flex flex-wrap">
                    <img alt="feature" className="lg:w-1/2 w-5/6 lg:mx-0 mx-auto lg:h-96 h-64 object-cover object-center rounded" src={featured} />
                    <div className="lg:w-1/2 w-5/6 lg:mx-0 mx-auto px-0 lg:px-8 py-8">
                        <h2 className="text-5xl font-bold text-blue-700 mb-5">Welcome to TenderVault</h2>
                        <h1 className="text-4xl	text-gray-900 font-normal mb-4"> the ultimate solution for simplified tender management</h1>
                        <p className="leading-relaxed text-lg">Create and manage tenders with ease, streamline your procurement process, and gain valuable insights with our user-friendly platform. Enjoy multilanguage support, mobile accessibility, customizable workflows, seamless integration, and cost-efficiency. Our app is your trusted partner, designed for quick adoption and success in the world of tenders. </p>
                        {/* <div className="flex mt-6 mb-4">
                            <img alt='icon' className='pr-2' src={icon2} />
                            <button className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Watch Now</button>

                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Featured