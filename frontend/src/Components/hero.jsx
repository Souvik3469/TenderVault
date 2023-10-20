import React from 'react'
import icon1 from "../icons/icon1.png"


function Hero() {
    return (
        //"Your tenders, your way. Tell us your desired procurement location, and we'll lead you to success." Tell us your destination, and we'll pave the way."
        <div className='w-screen h-[calc(100vh-5rem)]'>
            <div className="bg-cover bg-[url('/public/hero2.png')] bg-center bg-no-repeat h-full w-full" >
                <div className="container mx-auto flex flex-col my-auto align-middle h-full" >
                    <div className='my-auto  mx-auto lg:mx-0 w-10/12 lg:w-2/5'>
                        <h1 className="text-5xl mb-4 font-mont font-bold "><span className='font-mont text-6xl text-blue-500 font-bold'>Your tenders</span> your way!</h1>
                        <p className="text-2xl mb-8">Navigate the complexities of tenders effortlessly with our management system!</p>
                        {/* <div className='flex items-center'>
                            <button className='rounded px-10 py-3 text-white bg-violet-500 hover:bg-violet-600'>Share your story</button>
                            <img alt='icon' className='pl-4 pr-2' src={icon1} />
                            <p> Watch highlights</p>
                        </div> */}

                    </div>
                </div >
            </div >
        </div>
    );
}

export default Hero;