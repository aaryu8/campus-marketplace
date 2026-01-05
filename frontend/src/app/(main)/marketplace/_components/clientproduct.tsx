"use client"

import { Bookmark } from "lucide-react";
import { useState } from "react";

export const MapsandChatbot = () => {
    return (
        <div className="bg-yellow-400 pt-52 mt-3">
            <div>Here Google maps will be integrated</div>  
        </div>
    )
};



export const ButtonsComponent = () => {
    return (
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
    )
}



export const DescriptionComponent = ({ description } : { description : string} ) => {
    
    const [expanded, setExpanded] = useState(false);

    function cuttingdescription(text : string , maxwords : number ){
        const words = text.trim().split(/\s+/);

        if(words.length <= maxwords){
            return text;
        }

        const Truncatedtext = words.splice(0, maxwords).join(" ");
        return Truncatedtext;
    }
    
    return (
        <div className="mt-2">
            <p className="text-[21px] font-semibold">Seller's Description</p>
            <p className="text-[18px]">
                    {expanded ?  description : cuttingdescription(description, 3)}
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
    ) 
}