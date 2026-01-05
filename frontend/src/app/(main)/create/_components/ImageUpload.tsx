"use client"
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";


const ImageUpload = ({handleFileUpload } : {handleFileUpload : (files : File[]) => void}) => {
    

    return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
    </div>
    )
}

export default ImageUpload