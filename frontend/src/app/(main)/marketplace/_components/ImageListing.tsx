import Image from "next/image";
import React from "react";

interface ImageListingProps {
    src: string;
    alt?: string;
}

export const ImageListing: React.FC<ImageListingProps> = ({
  src, 
}) => {

  return (
    <div className="relative  max-full h-full overflow-hidden bg-black">
      
      {/* Blurred background layer */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={src}
          fill
          className="object-cover blur-lg scale-110"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Main image - NO top padding, only side padding */}
      <div className="relative w-full h-full flex items-start justify-center pt-0 pb-12 px-30">
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={src}
            fill
            className="object-contain"
            priority
          />
          
        
        </div>
      </div>

    </div>
  );
};
