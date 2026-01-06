'use client';

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {  Items , Product } from "../constants";
// Define product type



// interface ProductListingProps {
//   initialProducts : Product[]
//   showSeeMore? : boolean
//   loadMore? : boolean
// }


// interface ProductItemProps {
//   product: Product;
// }
interface ProductItemProps {
  product : Product
}

const ProductItem = ({product} : ProductItemProps) => {
  return (
    <div className="dark:bg-slate-800  bg-white border dark:border-none rounded-lg relative p-2 h-full">
        <a href="">
        <div className="absolute top-4 right-4 z-20 text-base p-4 rounded-full bg-slate-100 dark:bg-slate-900 flex justify-center items-center hover:text-blue-600">
          <FontAwesomeIcon icon={faHeart} />
        </div>
      </a>
      {/**image */}
      <div className="p-4 lg:p-6">
        <div className="min-h-[210px] flex justify-center items-center h-full px-6">
          <a href={`/marketplace/${product.id}`}>
            <img
              src={product.image[0]}
              alt={product.image[0]}
              className="max-h-[200px] max-w-full w-auto"
            />
          </a>
        </div>
      </div>
      <div className="p-4 lg:p-6 h-full pt-0 text-start">
        <a href={`/marketplace/${product.id}`}>
          <h5 className="text-black dark:text-white text-base leading-5 font-medium">
            {product.title}
          </h5>
        </a>
        <h5 className="text-blue-600 text-base font-medium leading-none my-2">
          ${product.price}
        </h5>
        <div className="flex justify-between items-center">
          <h5 className="font-medium">
            <span className="text-yellow-500 mr-1">
              <FontAwesomeIcon icon={faStar} />
            </span>
            {product.rating}
          </h5>
          <a href="#!">
            <h5 className="font-medium hover:text-blue-600">
              <FontAwesomeIcon icon={faShoppingCart} />
            </h5>
          </a>
        </div>
      </div>
    </div>
  );
};



const ProductListing = ({products } : Items) => {

  const [seeMore , showSeeMore] = useState(true);
  const router = useRouter();

  function onclick(seeMore : boolean){
    showSeeMore(!seeMore);
  }

   if(!products){
        alert("NO ITEMS TO SHOW CURRENTLY");
        router.push('/'); 
    }

  return (
    <section className="ezy__epgrid1 light py-14 md:py-24 dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-6 text-center mt-12">
          {products.map((product, i) => (
            <div
              className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 px-2 my-2"
              key={i}
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>
        {seeMore && <SeeMoreButton seeMore={seeMore} onclick={onclick}/>}
        {/* {showSeeMore && <SeeMoreButton /> in dono ko bahar nahi leke jaa sakte kya }
        {loadMore && <LoadMoreButton />}
         */}
      </div>
      
    </section>
  );
};

interface SeeMoretype {
  seeMore : boolean;
  onclick : (seeMore : boolean) => void;
}

function SeeMoreButton({seeMore , onclick} : SeeMoretype){
  const router = useRouter();
  return (
     <div className="text-center mt-12">
        <button 
        onClick={() => {
          onclick(seeMore);
          router.push("/marketplace");
        }}
        className="text-white font-bold py-3  px-11 mb-16  bg-blue-600 hover:bg-opacity-90 rounded-3xl">
          See More
        </button>
      </div>
  )
}

function LoadMoreButton(){
  const router = useRouter();
  
  function onLoadMore(){

  }

  return (
     <div className="text-center mt-12">
        <button
          onClick={onLoadMore}
          className="text-white font-bold py-3  px-11 mb-16  bg-blue-600 hover:bg-opacity-90 rounded-3xl">
          Load More
        </button>
      </div>
  )
}


export default ProductListing;