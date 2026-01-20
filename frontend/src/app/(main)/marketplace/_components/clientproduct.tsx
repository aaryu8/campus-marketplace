"use client"

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const MapsandChatbot = () => {
    return (
        <div className="bg-yellow-400 pt-52 mt-3">
            <div>Here Google maps will be integrated</div>  
        </div>
    )
};



interface ButtonsComponentProps {
    buyerId : string,
    sellerId : string
}

export const ButtonsComponent = ({ buyerId , sellerId }: ButtonsComponentProps) => {
  const router = useRouter();

  const onclickHandler = async () => {
    try {
      // Call backend to create/get chat ID
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important if using cookies/session
        body: JSON.stringify({ sellerId })
      });

      if (!res.ok) throw new Error('Failed to create chat');

      const data = await res.json();
      const chatId = data.chatId;

      // Navigate programmatically to chat page
      router.push(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
      alert('Could not start chat.');
    }
  };

  return (
    <div className="mt-2 flex justify-between w-full gap-2">
      <button
        type="button"
        onClick={onclickHandler}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7] focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
        aria-label="Message user"
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
        <img src="/send.png" width={20} height={20} alt="Share" />
        <span>Share</span>
      </button>
    </div>
  );
};



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