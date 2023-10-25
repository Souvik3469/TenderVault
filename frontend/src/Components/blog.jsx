import React from 'react'
import img1 from "../img/water.jpg"
import img2 from "../img/cloud.png"
import img3 from "../img/hotel.jpg"
import img4 from "../img/solar.jpg"



function Blog() {
    return (
        <section className="text-gray-600 mt-20 lg:mb-20 mb-0 body-font" >
            <h2 className="flex justify-center text-lg font-bold text-blue-700">CATCH UP TO OUR </h2>
            <h1 className="flex justify-center text-4xl text-gray-900 font-normal mb-2 lg:mb-7">Recent Success stories</h1>
            <div className="container px-5 py-12 lg:py-24 mx-auto flex flex-wrap">


                <div className="rounded-lg h-auto bg-gray-100 lg:w-1/2 w-full mb-4 lg:mb-0">
                    <img alt="feature" className="object-cover object-center h-8/12 w-full" src={img1} />
                    <div className='flex items-center justify-center px-6 py-3.5'>
                        <div className='flex flex-col my-auto'>
                            <h2 className='text-2xl'>Zysco: Water Treatment Plant Construction</h2>
                            <p className='text-base w-11/12'>"TenderVault has been the backbone of our tender management. Its comprehensive suite of tools has empowered us to bid smarter, not harder, and win critical projects that have contributed to our substantial growth and reputation in the industry."</p>
                        </div>
                      
                    </div>


                </div>
                <div className="flex flex-col flex-wrap lg:w-1/2 lg:pl-2.5 lg:text-left text-center">
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img2} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">PyNet: Cloud Computing Infrastructure Deployment</h2>
                            <p className='text-base'>"TenderVault has revolutionized our tender management process. We've experienced unparalleled efficiency and transparency, resulting in significant cost savings and improved contract success rates."</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img3} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">Tenzor: Luxury Hotel Renovation Project</h2>
                            <p className=" text-base">"We owe a substantial part of our success in securing competitive tenders to TenderVault. Its user-friendly interface, robust features, and meticulous tracking capabilities have given us a significant advantage in the market."</p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img4} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">Trident Enterprise: Solar Power Farm Development</h2>
                            <p className="text-base">"TenderVault has been a game-changer for our team. It streamlined our bidding process, providing real-time insights, and enabling us to secure more contracts than ever before. It's truly a cornerstone of our success."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section >


    )
}


export default Blog