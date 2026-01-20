
import Navbar from "@/components/global/navbar";

import ProductListing from "@/components/global/ProductListing";
import axios from "axios";
import { Mountains_of_Christmas } from "next/font/google"
import React from "react";
const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
})




interface HomepageProps {
  userName : string | null;
  userEmail : string | null;
}


const Homepage = async ({userName , userEmail} : HomepageProps) => {

   const response = await axios({
        method : "GET",
        url : "http://localhost:4000/api/marketplace/",
    })

    return (
 <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar/>
      </header>
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100vh + 200px)' }}>
          {/* Main Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-orange-500 to-green-500"></div>
          
          {/* White Fade Overlay at Bottom - positioned to start after buttons with space */}
          <div className="absolute inset-x-0 bottom-0 h-64 sm:h-72 md:h-80 lg:h-20 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
          
          <div className="relative w-full max-w-7xl mx-auto py-12 sm:py-16 md:py-20 pb-32 sm:pb-40 md:pb-48 z-10">
            <div className="text-center">
              <h1 className=" font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-lg text-white px-2">
                Welcome to{' '}
                <span className={`${moc.className} bg-gradient-to-r  from-yellow-300 via-orange-400 to-green-300 bg-clip-text text-transparent`}>
                  DormDeal
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white max-w-2xl mx-auto font-medium px-4">
                 Buy, sell, and trade with your fellow students to elevate your academic experience and find everything you need in one place.{' '}
                <span className="font-bold text-yellow-300">Campus Stay LIVE!</span>
              </p>
              
              {/* Call to Action Buttons */}
              <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto" aria-label="Primary navigation">
                <a 
                  href="/marketplace" 
                  className="w-full sm:w-auto"  
                  aria-label="Browse available items for sale"
                >
                  <button className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 font-semibold shadow-2xl transition-all duration-300 hover:scale-105">
                    Browse Items
                  </button>
                </a>
                <a 
                  href="/sign-in" 
                  className="w-full sm:w-auto"
                  aria-label="Find accommodation options"
                >
                  { !userName &&  <button className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-2 border-white/70 text-white hover:bg-white/10 active:bg-white/20 font-semibold transition-all duration-300 hover:scale-105">
                      Sign-up OR Sign-in
                    </button>
                  }
                </a>
              </nav>
            </div>
          </div>
        </section>




        <section>
          <ProductListing products={response.data}/> 
                  {/**<ProductListing initialProducts={featuredProducts} />  */}
        </section>



        <section>
          
            <div className="text-center" style={{opacity : 1 , transform :  "none"}}>
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium mb-4">
                <span className="flex items-center justify-center text-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2">
                    </span>Our Story </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                About   <span className="text-[#ec6a29]">DormDeal</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6" style={{opacity:1, transform : "none"}}></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Founded by a student, for students, DormDeal is the premier platform for buying, selling, and exchanging items within your campus community. We're on a mission to make student life more affordable and sustainable through our trusted marketplace.
              </p>
            </div>

            <div className="flex flex-row mx-auto max-w-7xl py-16">
              <div className="max-w-full px-20">
                
                  



                 <div className="text-center" style={{opacity : 1 , transform :  "none"}}>
                    <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 w-full text-indigo-800 font-medium mb-4">
                      <span className="flex items-center justify-center text-sm">
                        <span className="w-2 h-2 rounded-full  bg-indigo-600 mr-2">
                          </span>What Drives Us </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl mb-4">
                      Our   <span className="text-[#ec6a29]">Mission</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-left">
                      Founded by a student, for students, DormDeal is the premier platform for buying, selling, and exchanging items within your campus community. We're on a mission to make student life more affordable and sustainable through our trusted marketplace.
                    </p>
                    <br></br>
                    <p className="text-gray-600 max-w-2xl mx-auto text-left">
                      We're committed to creating a sustainable ecosystem within campus communities, reducing waste, and helping students save money while finding exactly what they need for their academic journey.
                    </p>
                  </div>
                

              </div>
              <div>
                <img src="/mission.avif" alt="" className="w-full h-auto rounded-tl-lg"/>
              </div>

            </div>

            


        </section>

        {/* You can add more sections here */}
        {/* Example: Features Section */}
        {/* <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            ...
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base">&copy; 2025 DormDeal Campus Marketplace . All rights reserved.</p>
        </div>
      </footer>
    </div>
    )
}

export default Homepage