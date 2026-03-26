import Image from "next/image";
import React from "react";
import s from "./product.module.css";

interface ImageListingProps {
  src: string;
  alt?: string;
}

export const ImageListing: React.FC<ImageListingProps> = ({ src, alt }) => {
  return (
    <div className={s.imageStage}>
      {/* Blurred background */}
      <div
        className={s.imageBg}
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* Gradient overlay */}
      <div className={s.imageOverlay} />

      {/* Main image */}
      <div className={s.imageMain}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={src}
            alt={alt ?? "Product image"}
            fill
            className="object-contain drop-shadow-2xl"
            priority
            sizes="(max-width: 820px) 100vw, 60vw"
          />
        </div>
      </div>
    </div>
  );
};