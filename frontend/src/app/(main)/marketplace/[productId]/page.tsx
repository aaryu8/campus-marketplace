import { ImageListing } from "../_components/ImageListing"
import { Bookmark } from 'lucide-react';
import { use } from "react"
import { Product } from "@/components/constants";
import { MapsandChatbot , ButtonsComponent , DescriptionComponent } from "../_components/clientproduct";
import axios from "axios";
import { cookies } from "next/headers";

type Props = {
    params : {
        productId : string
    }
}


const ProductBuying = async ({params} : Props) => {
    
    const {productId} = params;
      // you're making a req from server , they don't have cookies browser has them so syou explicitly get it and sent it
    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get('session_id');
    let isAuthenticated = true;

    try {
        
        const response = await axios({
            method : "GET",
            url : `http://localhost:4000/api/marketplace/${productId}`,
            headers : {
                Cookie : `session_id=${sessionCookie?.value}`
            }
        })

        let buyerId;

        try {
            const buyerInfo = await axios({
                method : "GET",
                url : "http://localhost:4000/api/auth/me",
                headers : {
                    Cookie : `session_id=${sessionCookie?.value}`
                }
            })
            
            buyerId = buyerInfo.data.user.id;

        } catch (error){
            console.log("NOT LOGGED IN FOR PRODUCT ID");
            isAuthenticated = false;
        } 

// fix prodcutID , 
// fixed it         
//    Inside [ProductId]
// [0] {
// [0]   productInfo: {
// [0]     title: 'lanscape painting',
// [0]     price: 400,
// [0]     description: 'a beautiful wall painting , contact no : XXXXXXXXX',
// [0]     rating: 0,
// [0]     category: 'general',
// [0]     condition: null,
// [0]     image: [
// [0]       'https://oncagxvtwnskgijucota.supabase.co/storage/v1/object/public/DormDeal-item-listing/products/1767590921372_vvu67p.jpg'
// [0]     ],
// [0]     createdAt: '2026-01-05T05:28:44.501Z',
// [0]     owner: { name: 'aaditya', email: 'aaditya@gmail.com' }
// [0]   }
// [0] }

        if(!response.data.taskStatus){
            alert('Cannot fetch product Information at the moment');
        }


        
        const {owner ,title , price , description , rating , condition , image  } = response.data.data.productInfo;
        const sellerId = response.data.data.productInfo.owner.id;
    
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
                        {isAuthenticated ? (
                            <ButtonsComponent
                                buyerId={buyerId}
                                sellerId={sellerId}
                                productId={productId} // ✅ Pass productId
                            />
                        ) : (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
                                <p className="text-sm text-gray-600">
                                    Please login to message the seller
                                </p>
                            </div>
                        )}                        

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
            <div>Can't fetch anything at the moment</div>
        )
    }
    


    
}

export default ProductBuying
