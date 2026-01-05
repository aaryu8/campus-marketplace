"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import ImageUpload from "./ImageUpload"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface itemDataType {
    title : string;
    price : string;
    description : string;
}   

const CreateListingComponent = () => {
    const router = useRouter();
    const [itemData , setitemData] = useState<itemDataType>({
        title : "",
        price : "",
        description : ""
    });

    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);  // ✅ Added loading state

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    const uploadProductImages = async (files: File[]) => {
        try {
            const uploadedUrls: string[] = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { data, error } = await supabase
                    .storage
                    .from('DormDeal-item-listing')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error('Upload error:', error);
                    throw error;
                }

                const { data: { publicUrl } } = supabase
                    .storage
                    .from('DormDeal-item-listing')
                    .getPublicUrl(data.path);

                uploadedUrls.push(publicUrl);
            }

            return uploadedUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleUpload = async (files : File[]) => {
        if(files.length === 0){
            alert("Please upload at least one image");
            return [];  // ✅ Return empty array
        }

        try {
            const url = await uploadProductImages(files);
            return url;
        } catch(error){
            console.log("Error while uploading", error);
            alert("Failed to upload images. Please try again.");
            return [];  // ✅ Return empty array on error
        }   
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);  // ✅ Start loading

        try {
            const imageUrl = await handleUpload(files);
            
            if (!imageUrl || imageUrl.length === 0) {
                alert("Failed to upload images");
                return;
            }

            console.log(imageUrl);
           
            const response = await axios({
                method : "post",
                url : "http://localhost:4000/createListing",
                withCredentials : true,
                data : {
                    title : itemData.title,
                    price : itemData.price,
                    description : itemData.description,
                    image : imageUrl
                }
            })

            setitemData({ title: "", price: "", description: ""});
            setFiles([]);

            if(!response.data.taskStatus){
                alert("Failed to upload your item");
                setitemData({ title: "", price: "", description: ""});
                setFiles([]);
                return;
            }

            router.push("/");   

        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Failed to create listing. Please try again.");
        } finally {
            setLoading(false);  // ✅ Stop loading
        }
    }

    return (
        <div className="m-10">
            <h1 className="text-[25px] font-bold m-10 ">Sell Your Item</h1>
            <div className="flex flex-container h-screen w-full">
                <div className="flex-1 p-5">
                    <ImageUpload handleFileUpload={handleFileUpload} />
                </div>  
                <div className="flex-1 pl-10 pt-5">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <h1 className="text-gray-400 font-semibold">Title</h1>
                            <div className="w-3/4 pt-2 pb-3">
                                <Textarea 
                                    value={itemData.title}  // ✅ Controlled input
                                    onChange={(e : ChangeEvent<HTMLTextAreaElement>) => {
                                        setitemData({
                                            ...itemData,
                                            title : e.target.value
                                        })
                                    }}
                                    disabled={loading}  // ✅ Disable while loading
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-gray-400 font-semibold">Enter the price for your item</h1>
                            <div className="w-3/4 pt-2 pb-3">
                                <Textarea 
                                    value={itemData.price}  // ✅ Controlled input
                                    onChange={(e : ChangeEvent<HTMLTextAreaElement>) => {
                                        setitemData({
                                            ...itemData,
                                            price : e.target.value
                                        })
                                    }}
                                    disabled={loading}  // ✅ Disable while loading
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-gray-400 font-semibold">Description of your item</h1>
                            <div className="w-3/4 pt-2 pb-5">
                                <Textarea 
                                    value={itemData.description}  // ✅ Controlled input
                                    onChange={(e : ChangeEvent<HTMLTextAreaElement>) => {
                                        setitemData({
                                            ...itemData,
                                            description : e.target.value
                                        })
                                    }}
                                    disabled={loading}  // ✅ Disable while loading
                                />
                            </div>
                        </div>
                        <div className="flex flex-row-reverse mr-44">
                            <Button type="submit" disabled={loading} className="h-12">
                                {loading ? "Uploading..." : "List Item"}  {/* ✅ Loading text */}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateListingComponent