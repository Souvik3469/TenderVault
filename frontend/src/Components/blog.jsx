import React from 'react'
import img1 from "../img/img1.png"
import img2 from "../img/img2.png"
import img3 from "../img/img3.png"
import img4 from "../img/img4.png"
import icon2 from "../icons/icon2.png"


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
                            <h2 className='text-2xl'>Zermatt, Switzerland</h2>
                            <p className='text-base w-11/12'>Marvel on the beauty of the iconic Matterhorn. Find the best places to stay that has the best views of this peak...</p>
                        </div>
                        <div >
                            <img alt='icon' src={icon2} />
                        </div>
                    </div>


                </div>
                <div className="flex flex-col flex-wrap lg:w-1/2 lg:pl-2.5 lg:text-left text-center">
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img2} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">Tuscany, Italy</h2>
                            <p className='text-base'>The amazing Tuscany is home to famous Renaissance art and architecture and a vast scenic landscape. <span className='text-violet-500'>view full blog...</span></p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img3} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">Kyoto, Japan</h2>
                            <p className=" text-base">Kyoto is well known for its temples, gardens, Shinto shrines and wooden houses. It’s time to visit tokyo. <span className='text-violet-500'>view full blog...</span></p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 p-2.5 flex mb-4 lg:items-start items-center">
                        <div className="w-1/3 h-full inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
                            <img alt="feature" className="object-cover object-center h-full w-full" src={img4} />
                        </div>
                        <div className="pl-5 w-2/3 h-auto">
                            <h2 className="text-2xl mb-3">Lofoten Islands, Norway</h2>
                            <p className="text-base">Featuring razor-sharp peaks housing the arctic landscape. This astonishing island is perfect for your next postcard. <span className='text-violet-500'>view full blog...</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </section >


    )
}


export default Blog