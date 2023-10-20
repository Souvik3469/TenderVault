import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/hero'
import Featured from '../Components/featured'
import Discover from '../Components/discover'
import Form from '../Components/form'
import Blog from '../Components/blog'
import Footer from '../Components/footer'

const Landing = () => {
  return (
    // <div className=" bg-red-600">Landing</div>
     <>
      <div className='flex flex-col w-full'>
        <Navbar />
        <Hero />
        <Featured />
        <Discover />
        {/* <Form/> */}
        <Blog />
        <Footer />
      </div>
    </>
    
    
  )
}

export default Landing