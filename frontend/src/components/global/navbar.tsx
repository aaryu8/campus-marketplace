'use client';

import Link from "next/link";
import { useState } from "react";
import { Input } from "../ui/input";
import { Mountains_of_Christmas } from "next/font/google"


const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
})


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b  border-gray-200" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
              <span className={`${moc.className}  text-3xl font-bold`} style={{ textShadow: "0.5px 0.5px 0 black" }}>DormDeal</span>
            </Link>
          </div>
          
          <div className="">
            <Input className="hover:border-orange-500 pr-20" placeholder="Search items"/>
          </div>
          

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/listings" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Browse Items
            </Link>
            <Link 
              href="/stay" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Accommodation
            </Link>
            <Link 
              href="/food" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Food
            </Link>
            <Link 
              href="/createListing" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              Sell Item
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/listings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Items
            </Link>
            <Link
              href="/stay"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accommodation
            </Link>
            <Link
              href="/food"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Food
            </Link>
            <Link
              href="/sell"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sell Item
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}




