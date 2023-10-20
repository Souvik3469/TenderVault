import React from 'react'
import electric from "../img/electric.jpg"
import solar from "../img/solar.jpg"
import hotel from "../img/hotel.jpg"
import road from "../img/road.jpg"

function Discover() {
    return (
        <section className="text-gray-600 body-font" >
            <div className="container px-5 py-24 mx-auto">
                <h2 className='text-2xl font-bold text-blue-700 flex justify-center'>EXPLORE!</h2>
                <h1 className='flex justify-center text-4xl	text-gray-900 font-normal mb-12'>The world of tenders with us</h1>
                <div className="flex flex-wrap -m-4">
                    <div className="xl:w-1/4 md:w-1/2 sm:w-5/6 mx-auto lg:mx-0 p-4">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={electric} alt="content" />
                        <h3 className="flex justify-center text-2xl"> LightJets Enterprise: Electrical Equipment Procurement</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">Expore</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={solar} alt="content" />
                        <h3 className="flex justify-center text-2xl">Trident Enterprise: Solar Power Farm Development</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">Expore</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={hotel} alt="content" />
                        <h3 className="flex justify-center items-center text-2xl">Tenzor: Luxury Hotel Renovation Project</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">Expore</h2>
                    </div>
                    <div className="xl:w-1/4 md:w-1/2 p-4 sm:w-5/6 mx-auto lg:mx-0 ">
                        <img className="h-[300px] rounded w-full object-cover object-center mb-6" src={road} alt="content" />
                        <h3 className="flex justify-center text-2xl">Brightcom Group: Major Highway Construction Contract</h3>
                        <h2 className="flex justify-center text-base text-violet-500 mb-4">Expore</h2>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Discover