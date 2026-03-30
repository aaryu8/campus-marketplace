
// types/product.ts
export interface Product { 
  id: string;
  title: string;
  price: number;
  description: string;
  rating: number;
  category: string;
  condition?: string;   // optional, like in Prisma
  image: string[];      // array of image URLs or paths
  createdAt: string; 
  views : number;   // DateTime in Prisma is usually returned as ISO string in JSON
  ownerId: string;
  
  // Optional: include owner info if you plan to fetch relational data
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Items {
  products: Product[];
  initialCategory?: string;  // add this
}
