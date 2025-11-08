"use client"

import { Mountains_of_Christmas } from "next/font/google"
import { Search } from 'lucide-react';
import Link from "next/link";
const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
  
})

import { Input } from "@/components/ui/input"

type Props = {}

const Navbar =  (props : Props) => {
    return (
    <>
      <header className="fixed left-0 right-0 top-0 flex items-center px-4 py-4 gap-4  shadow-md">
        <aside>
          <p
            className={`${moc.className} text-3xl font-bold`}
            style={{ textShadow: "0.5px 0.5px 0 black" }}
          >
            DormDeal
          </p>
        </aside>


        <form className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <Input
              placeholder="Search for items, textbooks, electronics, anything"
              className="pl-10"  // ← Space for icon
            />

            <button
              type="button"
              onClick={() => {
                console.log("Search icon clicked!");
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </form>


        <nav className="hidden md:flex items-center gap-4 px-4">
          <ul className="flex items-center gap-4 list-none">
            <li><Link href="#">Home</Link></li>
            <li><Link href="#">Products</Link></li>
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </nav>
      </header>
    </>
    )
}

export default Navbar;