import React from 'react'
import icon1 from "../icons/icon1.png"


function Hero() {
    return (
     
        <div className='w-screen h-[calc(100vh-5rem)]'>
            <div className="bg-cover bg-[url('/public/hero2.png')] bg-center bg-no-repeat h-full w-full" >
                <div className="container mx-auto flex flex-col my-auto align-middle h-full" >
                    <div className='my-auto  mx-auto lg:mx-0 w-10/12 lg:w-2/5'>
                        <h1 className="text-5xl mb-4 font-mont font-bold "><span className='font-mont text-6xl text-blue-500 font-bold'>Your tenders</span> your way!</h1>
                        <p className="text-2xl mb-8">Navigate the complexities of tenders effortlessly with our management system!</p>
                    

                    </div>
                </div >
            </div >
        </div>
    );
}

export default Hero;