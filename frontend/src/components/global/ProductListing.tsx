'use client';

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShoppingCart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

// Define product type
interface Product {
  img: string;
  title: string;
  price: string;
  rating: string;
}

const products: Product[] = [
  {
    img: "https://cdn.easyfrontend.com/pictures/products/chair1.png",
    title: "Full Body Massage Chair weightless Bluetooth",
    price: "1725.00",
    rating: "4.6",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/products/perfume1.png",
    title: "Original Brand 212 Perfume Vip Men Long Lasting",
    price: "1725.00",
    rating: "4.6",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/headphone.png",
    title: "Wireless Headset Bluetooth Earphones and Headphone",
    price: "125.00",
    rating: "4.1",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/products/bag2.png",
    title: "Teenage Girls and Boys Backpack Schoolbag High Quality Backpacks",
    price: "116.00",
    rating: "4.0",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/products/lamp1.png",
    title: "Touch Rechargeable Bud Table Lamps LED Creative",
    price: "725.00",
    rating: "4.8",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/chair.png",
    title: "Side Chair Back Chair Fabric Upholstered Seat Chairs",
    price: "185.00",
    rating: "4.1",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/products/shoe2.png",
    title: "Size 21-30 Children Basketball Shoes Girls Boys",
    price: "1525.00",
    rating: "4.2",
  },
  {
    img: "https://cdn.easyfrontend.com/pictures/products/sofa3.png",
    title:
      "Solid Chair Cover Office Computer Spandex Split Seat Cover Universal",
    price: "2225.00",
    rating: "4.9",
  },
];

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <div className="dark:bg-slate-800  bg-white border dark:border-none rounded-lg relative p-2 h-full">
      <a href="#!">
        <div className="absolute top-4 right-4 z-20 text-base p-4 rounded-full bg-slate-100 dark:bg-slate-900 flex justify-center items-center hover:text-blue-600">
          <FontAwesomeIcon icon={faHeart} />
        </div>
      </a>
      <div className="p-4 lg:p-6">
        <div className="min-h-[210px] flex justify-center items-center h-full px-6">
          <a href="#!">
            <img
              src={product.img}
              alt={product.title}
              className="max-h-[200px] max-w-full w-auto"
            />
          </a>
        </div>
      </div>
      <div className="p-4 lg:p-6 h-full pt-0 text-start">
        <a href="#!">
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

const ProductListing: React.FC = () => {
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
      </div>
      
    </section>
  );
};

export default ProductListing;