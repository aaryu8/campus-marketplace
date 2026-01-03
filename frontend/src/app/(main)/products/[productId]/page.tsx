"use client"
import { useState } from "react";
import { ImageListing } from "../_components/ImageListing"
import { Bookmark } from 'lucide-react';
import { use } from "react"
import { featuredProducts , Product } from "@/components/constants";
import { useParams } from "next/navigation";

const ProductBuying = ({params} : {params : string}) => {
    const [expanded, setExpanded] = useState(false);
    const {productId} = useParams()
    const currentProduct = featuredProducts.find((element) => {
        return element.id == productId
    })
  
    


    return (
        <div className="min-h-screen   bg-gray-900">
            {/* Main flex container - full viewport height */}
            <div className="flex flex-row w-full h-screen">
                
                {/* LEFT: Image Gallery (75% width) */}
                <div className="w-3/4 h-full bg-black">
                    {currentProduct?.image  && (
                        <ImageListing src={`${currentProduct?.image}`}/>
                    )}

                </div>
                
                {/* RIGHT: Product Details (25% width) */}
                <div className="w-1/4 h-full bg-white overflow-y-auto">
                    <div className=" pl-2 pr-2  pt-3">
                        <h1 className="text-2xl font-bold">Product Title</h1>
                        <p className="text-xl">$100</p>
                        <p className="text-gray-500 text-[16px] font-normal">Listed a week ago in Newardk , CA</p>
                        {/* Your product details here */}
                        <div className="mt-2 flex justify-between w-full gap-2">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7] focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
                            >
                                <img src="/messenger.png" width={20} height={20} alt="Messenger" />
                                <span>Message</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7] focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
                            >
                                <Bookmark />
                                <span>Save</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7] focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
                            >
                                <img src="/send.png" width={20} height={20}/>
                                <span>Share</span>
                            </button>
                        </div>
                        <div className="h-0.5"></div>
                        <hr/>
                        <div className="mt-2">
                            <p className="text-[21px] font-semibold">Seller's Description</p>
                            <p className="text-[18px]">
                                This is the first part of the Text. {expanded && "This is the second part of the text"}
                            </p>
                            <button
                                className="text-[18px] font-semibold"
                                onClick={() => {
                                    setExpanded(!expanded);
                                }}
                            >
                                {expanded ? "... See Less" : "... See More"}
                            </button>
                        </div>
                        <div className="bg-yellow-400 pt-52 mt-3">
                           <div>Here Google maps will be integrated</div>  
                        </div>
                        

                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ProductBuying
