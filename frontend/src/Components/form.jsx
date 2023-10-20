import React from 'react'

function Form() {
    return (
        <section className="bg-cover bg-[url('/public/form.png')] bg-center bg-no-repeat h-full w-full relative" >
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <p className="mx-auto text-lg font-bold text-violet-500">LET'S BUILD A COMMUNITY</p>
                    <h1 className="sm:text-3xl text-4xl	text-gray-900 font-normal mb-4">Join our next destination</h1>
                </div>
                <div className="lg:w-1/2 md:w-2/3 mx-auto bg-white rounded-xl">
                    <div className="flex flex-wrap p-7">
                        <h2 className='text-2xl font-normal'>Share your travels</h2>
                        <p className='text-lg'>Suggest a new travel destination that you want to see and we will feature it in our blog.</p>
                        <div className="py-2 w-full">
                            <input type="text" placeholder="Destination name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300  text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>

                        <div className="py-2 w-full">
                            <input type="text" placeholder="Country of Destination" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="py-2 w-full">
                            <input type="text" placeholder="Your name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="py-2 w-full">
                            <input type="text" placeholder="Shooting category" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <div className="py-2 w-full">
                            <input type="text" placeholder="Describe what kind of photos you want to focus on" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                        </div>
                        <button className='rounded px-20 py-3 text-white bg-violet-500 hover:bg-violet-600'>Submit</button>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Form