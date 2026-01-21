"use client"

import axios from "axios";
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
    sellerId : string,
    productId : string
}


export const ButtonsComponent = ({ buyerId, sellerId, productId }: ButtonsComponentProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onclickHandler = async () => {
        try {
            setLoading(true);

            if(buyerId === sellerId) return;

            // Call backend to create/get chat ID
            const res = await axios({
                method: "post",
                url: "http://localhost:4000/api/chat/createId", // ✅ Fixed URL
                withCredentials: true,
                data: {
                    buyerId,
                    sellerId,
                    productId // ✅ Include productId
                }
            });

            if (!res.data.status) {
                console.error('Failed to create chat');
                alert('Could not start chat.');
                return;
            }

            const chatId = res.data.data; // ✅ Fixed: directly access data property

            // Navigate to chat page
            router.push(`/chat/${chatId}`);

        } catch (err) {
            console.error(err);
            alert('Could not start chat.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2 flex justify-between w-full gap-2">
            <button
                type="button"
                onClick={onclickHandler}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Message user"
            >
                <img src="/messenger.png" width={20} height={20} alt="Messenger" />
                <span>{loading ? 'Loading...' : 'Message'}</span>
            </button>

            <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7]"
            >
                <Bookmark />
                <span>Save</span>
            </button>

            <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#050505] bg-[#d8dadf] rounded-md border border-transparent hover:bg-[#cbcfd7]"
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