import { ImageListing } from "../_components/ImageListing"
import { Bookmark } from 'lucide-react';
import { use } from "react"
import { Product } from "@/components/constants";
import { MapsandChatbot , ButtonsComponent , DescriptionComponent } from "../_components/clientproduct";
import axios from "axios";

type Props = {
    params : {
        productId : string
    }
}


const ProductBuying = async ({params} : Props) => {
    
    const {productId} = params;

    try {
        console.log("reached here in frontend")
        const response = await axios({
            method : "GET",
            url : "http://localhost:4000/marketplace/productInfo",
            withCredentials : true,
            data : {
                productId
            }
        })


        if(!response.data.taskStatus){
            alert('Cannot fetch product Information at the moment');
        }


        console.log(response.data.data);
        
        const {owner ,title , price , description , rating , condition , image  } = response.data.data.productInfo;

    
        return (
        <div className="min-h-screen   bg-gray-900">
            {/* Main flex container - full viewport height */}
            <div className="flex flex-row w-full h-screen">
                
                {/* LEFT: Image Gallery (75% width) */}
                <div className="w-3/4 h-full bg-black">
                    {image && (
                        <ImageListing src={image[0]}/>
                    )}

                </div>
                
                {/* RIGHT: Product Details (25% width) */}
                <div className="w-1/4 h-full bg-white overflow-y-auto">
                    <div className=" pl-2 pr-2  pt-3">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-xl">${price}</p>
                        <p className="text-gray-500 text-[16px] font-normal">Listed a week ago in Newardk , CA</p>
                        {/* Your product details here */}
                        
                        <ButtonsComponent />

                        <div className="h-0.5"></div>
                        <hr/>
                        
                        <DescriptionComponent description={description}/>
                        
                        <MapsandChatbot />

                    </div>
                </div>
                
            </div>
        </div>
    )
    } catch (error){
        console.log(error)

        return (
            <div></div>
        )
    }
    


    
}

export default ProductBuying
