
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
  createdAt: string;    // DateTime in Prisma is usually returned as ISO string in JSON
  ownerId: string;
  
  // Optional: include owner info if you plan to fetch relational data
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Items {
  products : Product[];
}


// export const featuredProducts: Product[] = [
//     {
//       id : "1",
//       image: "https://scontent.fixc1-3.fna.fbcdn.net/v/t39.84726-6/608126508_1927869151485863_998637006018600277_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=W4jFkPjLpUQQ7kNvwFneZyv&_nc_oc=AdlcghhVZ-JQNcYzn-tB-Hwp4K5_XLrpFHkrXN6XPxVWNHU3lvpHf6Go3_4_aWe-e_2OrtN27u4g0Im2qBIByrZp&_nc_zt=14&_nc_ht=scontent.fixc1-3.fna&_nc_gid=fRTh7AyaLi4CQHdt6p6-GA&oh=00_Afr55txyEJVBKdi35o_nsTznyNHkHw03QPbf2GSHFNo84g&oe=695D625E",
//       title: "Full Body Massage Chair weightless Bluetooth",
//       price: "1725.00",
//       rating: "4.6",
//     },
//     {
//         id : "2",
//       image: "https://scontent.fixc1-10.fna.fbcdn.net/v/t39.84726-6/608711994_897880066097017_6932690339942192135_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=1&ccb=1-7&_nc_sid=92e707&_nc_ohc=SyP7M76-L-sQ7kNvwGKjUgS&_nc_oc=AdkAfzkKp-f1gES0tSxv63OkVK_AU0phXNRzXKOaYd_ujtI2QwIj_7IOXNH49tkyp7E1JTmA3OKUFp3HB8BQJ_Z2&_nc_zt=14&_nc_ht=scontent.fixc1-10.fna&_nc_gid=CqbmyR-wRdw4w14k4e3RkA&oh=00_AfrjqFBJV81sJOlNdR7FcTbD12d6CgeZVQdsXZQAUUuybA&oe=695D476F",
//       title: "Original Brand 212 Perfume Vip Men Long Lasting",
//       price: "1725.00",
//       rating: "4.6",
//     },
//     {
//         id : "3",
//       image: "https://scontent.fixc1-10.fna.fbcdn.net/v/t39.84726-6/606457651_728197393281822_7671964572729173910_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=1&ccb=1-7&_nc_sid=92e707&_nc_ohc=ExugkBPQcmkQ7kNvwFckLL0&_nc_oc=Adm1wAPL99EyRqr-ATC65k7fzZTKA_ylvPcXD3GUONLH46uCUwWw-gDaAaweMJCz7GxVZdY3BzAHNxueMGMyPj2q&_nc_zt=14&_nc_ht=scontent.fixc1-10.fna&_nc_gid=nvwIPwbgR9hhjh7SMV7sHw&oh=00_AfpjsGen-IuEnjDPhQSKBtL7PVJfXeXlhcIYyn5wsbgRRA&oe=695D5D71",
//       title: "Wireless Headset Bluetooth Earphones and Headphone",
//       price: "125.00",
//       rating: "4.1",
//     },
//     {
//         id : "4",
//       image: "https://scontent.fixc1-4.fna.fbcdn.net/v/t39.84726-6/606899944_902365079135903_1376250255196469113_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=X9sDc0qkikYQ7kNvwGPzgVW&_nc_oc=AdkZV3ty7kl4h_qu55Yf4eGs-7y7PNIkvxor6IK_e1rmeuOwyxHyZ3VfedF7QBSWsZoU-YhkAGWnZCFM5t7Fhd9Z&_nc_zt=14&_nc_ht=scontent.fixc1-4.fna&_nc_gid=YkeJW-F8_zkvBz8zjMoDOA&oh=00_Afrti4rBr5MZgCzgAq-rV8MN8nrnZT4d1SHA49Vpv4MIOQ&oe=695D7492",
//       title: "Teenage Girls and Boys Backpack Schoolbag High Quality Backpacks",
//       price: "116.00",
//       rating: "4.0",
//     },
//     {
//         id : "5",
//       image: "https://scontent.fixc1-7.fna.fbcdn.net/v/t39.84726-6/607966594_1410216263823906_7895352303200163808_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=UZwHboXGKwoQ7kNvwG-sLWK&_nc_oc=Admq2hQZs8X170xwv5W_5DV3upmFdRZ1xPWHPxksO9QnHC2agpKH1oaesipS8XV3r-RZPNGnNGjXcCBBoaav4jnn&_nc_zt=14&_nc_ht=scontent.fixc1-7.fna&_nc_gid=ZZQfIiLptB5tM--6iXPeKA&oh=00_AfrVqlSdMFFkPlp2mzRyTarJ4XDIdO3bodDz3qtK9edu8g&oe=695D5E99",
//       title: "Touch Rechargeable Bud Table Lamps LED Creative",
//       price: "725.00",
//       rating: "4.8",
//     },
//     {
//         id : "6",
//       image: "https://scontent.fixc1-8.fna.fbcdn.net/v/t39.30808-6/608459774_10214871688743293_3170983525021409690_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=454cf4&_nc_ohc=_FsHZXj1bK0Q7kNvwH8oeCy&_nc_oc=AdnckK5XOGYxHrp0M-ZPI-IGkHFFZo_SC5wRnm9_l8Hh3uV0SNNfYDXdYJbyXfHI8GDusErtAfPvhep1nROXJU75&_nc_zt=23&_nc_ht=scontent.fixc1-8.fna&_nc_gid=tghM3F3jTG4m4QRTzXZeCA&oh=00_AfpsKEDjAu29k40nGo6oZNeQ30xLAk082xnH3HJ5Yw0lgA&oe=695D5483",
//       title: "Side Chair Back Chair Fabric Upholstered Seat Chairs",
//       price: "185.00",
//       rating: "4.1",
//     },
//     {
//     id : "7",
//       image: "https://scontent.fixc1-8.fna.fbcdn.net/v/t39.30808-6/608459774_10214871688743293_3170983525021409690_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=454cf4&_nc_ohc=_FsHZXj1bK0Q7kNvwH8oeCy&_nc_oc=AdnckK5XOGYxHrp0M-ZPI-IGkHFFZo_SC5wRnm9_l8Hh3uV0SNNfYDXdYJbyXfHI8GDusErtAfPvhep1nROXJU75&_nc_zt=23&_nc_ht=scontent.fixc1-8.fna&_nc_gid=tghM3F3jTG4m4QRTzXZeCA&oh=00_AfpsKEDjAu29k40nGo6oZNeQ30xLAk082xnH3HJ5Yw0lgA&oe=695D5483",
//       title: "Size 21-30 Children Basketball Shoes Girls Boys",
//       price: "1525.00",
//       rating: "4.2",
//     },
//     {
//         id : "8",
//       image: "https://scontent.fixc1-7.fna.fbcdn.net/v/t39.84726-6/608432892_1796048337718821_6197942046051219135_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=3vSkxVzWDlIQ7kNvwFsjwah&_nc_oc=Adm9u4ZPJg2Lr-ia0iAmpqBl81cE0SIWSqLZX8ywhiQRe7m12GLSil9N0rUa9knORJv3LyzqH8vxuS8-vorjgeQc&_nc_zt=14&_nc_ht=scontent.fixc1-7.fna&_nc_gid=TapGsnu_jRlccIBk8zoeTw&oh=00_Afp0z03O5vvr1OwQ3edGliEUAHhlx-5Y7Xxc8wQtYjoT4A&oe=695D7A6F",
//       title:
//         "Solid Chair Cover Office Computer Spandex Split Seat Cover Universal",
//       price: "2225.00",
//       rating: "4.9",
//     },
//     {
//       id : "9",
//       image: "https://scontent.fixc1-3.fna.fbcdn.net/v/t39.84726-6/608126508_1927869151485863_998637006018600277_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=102&ccb=1-7&_nc_sid=92e707&_nc_ohc=W4jFkPjLpUQQ7kNvwFneZyv&_nc_oc=AdlcghhVZ-JQNcYzn-tB-Hwp4K5_XLrpFHkrXN6XPxVWNHU3lvpHf6Go3_4_aWe-e_2OrtN27u4g0Im2qBIByrZp&_nc_zt=14&_nc_ht=scontent.fixc1-3.fna&_nc_gid=fRTh7AyaLi4CQHdt6p6-GA&oh=00_Afr55txyEJVBKdi35o_nsTznyNHkHw03QPbf2GSHFNo84g&oe=695D625E",
//       title: "Full Body Massage Chair weightless Bluetooth",
//       price: "1725.00",
//       rating: "4.6",
//     },
//     {
//         id : "10",
//       image: "https://scontent.fixc1-10.fna.fbcdn.net/v/t39.84726-6/608711994_897880066097017_6932690339942192135_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=1&ccb=1-7&_nc_sid=92e707&_nc_ohc=SyP7M76-L-sQ7kNvwGKjUgS&_nc_oc=AdkAfzkKp-f1gES0tSxv63OkVK_AU0phXNRzXKOaYd_ujtI2QwIj_7IOXNH49tkyp7E1JTmA3OKUFp3HB8BQJ_Z2&_nc_zt=14&_nc_ht=scontent.fixc1-10.fna&_nc_gid=CqbmyR-wRdw4w14k4e3RkA&oh=00_AfrjqFBJV81sJOlNdR7FcTbD12d6CgeZVQdsXZQAUUuybA&oe=695D476F",
//       title: "Original Brand 212 Perfume Vip Men Long Lasting",
//       price: "1725.00",
//       rating: "4.6",
//     },
//     {
//         id : "11",
//       image: "https://scontent.fixc1-10.fna.fbcdn.net/v/t39.84726-6/606457651_728197393281822_7671964572729173910_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=1&ccb=1-7&_nc_sid=92e707&_nc_ohc=ExugkBPQcmkQ7kNvwFckLL0&_nc_oc=Adm1wAPL99EyRqr-ATC65k7fzZTKA_ylvPcXD3GUONLH46uCUwWw-gDaAaweMJCz7GxVZdY3BzAHNxueMGMyPj2q&_nc_zt=14&_nc_ht=scontent.fixc1-10.fna&_nc_gid=nvwIPwbgR9hhjh7SMV7sHw&oh=00_AfpjsGen-IuEnjDPhQSKBtL7PVJfXeXlhcIYyn5wsbgRRA&oe=695D5D71",
//       title: "Wireless Headset Bluetooth Earphones and Headphone",
//       price: "125.00",
//       rating: "4.1",
//     },
//     {
//         id : "12",
//       image: "https://scontent.fixc1-4.fna.fbcdn.net/v/t39.84726-6/606899944_902365079135903_1376250255196469113_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=92e707&_nc_ohc=X9sDc0qkikYQ7kNvwGPzgVW&_nc_oc=AdkZV3ty7kl4h_qu55Yf4eGs-7y7PNIkvxor6IK_e1rmeuOwyxHyZ3VfedF7QBSWsZoU-YhkAGWnZCFM5t7Fhd9Z&_nc_zt=14&_nc_ht=scontent.fixc1-4.fna&_nc_gid=YkeJW-F8_zkvBz8zjMoDOA&oh=00_Afrti4rBr5MZgCzgAq-rV8MN8nrnZT4d1SHA49Vpv4MIOQ&oe=695D7492",
//       title: "Teenage Girls and Boys Backpack Schoolbag High Quality Backpacks",
//       price: "116.00",
//       rating: "4.0",
//     },
//     {
//         id : "13",
//       image: "https://scontent.fixc1-7.fna.fbcdn.net/v/t39.84726-6/607966594_1410216263823906_7895352303200163808_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=UZwHboXGKwoQ7kNvwG-sLWK&_nc_oc=Admq2hQZs8X170xwv5W_5DV3upmFdRZ1xPWHPxksO9QnHC2agpKH1oaesipS8XV3r-RZPNGnNGjXcCBBoaav4jnn&_nc_zt=14&_nc_ht=scontent.fixc1-7.fna&_nc_gid=ZZQfIiLptB5tM--6iXPeKA&oh=00_AfrVqlSdMFFkPlp2mzRyTarJ4XDIdO3bodDz3qtK9edu8g&oe=695D5E99",
//       title: "Touch Rechargeable Bud Table Lamps LED Creative",
//       price: "725.00",
//       rating: "4.8",
//     },
//     {
//         id : "14",
//       image: "https://scontent.fixc1-8.fna.fbcdn.net/v/t39.30808-6/608459774_10214871688743293_3170983525021409690_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=454cf4&_nc_ohc=_FsHZXj1bK0Q7kNvwH8oeCy&_nc_oc=AdnckK5XOGYxHrp0M-ZPI-IGkHFFZo_SC5wRnm9_l8Hh3uV0SNNfYDXdYJbyXfHI8GDusErtAfPvhep1nROXJU75&_nc_zt=23&_nc_ht=scontent.fixc1-8.fna&_nc_gid=tghM3F3jTG4m4QRTzXZeCA&oh=00_AfpsKEDjAu29k40nGo6oZNeQ30xLAk082xnH3HJ5Yw0lgA&oe=695D5483",
//       title: "Side Chair Back Chair Fabric Upholstered Seat Chairs",
//       price: "185.00",
//       rating: "4.1",
//     },
//     {
//     id : "15",
//       image: "https://scontent.fixc1-8.fna.fbcdn.net/v/t39.30808-6/608459774_10214871688743293_3170983525021409690_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=454cf4&_nc_ohc=_FsHZXj1bK0Q7kNvwH8oeCy&_nc_oc=AdnckK5XOGYxHrp0M-ZPI-IGkHFFZo_SC5wRnm9_l8Hh3uV0SNNfYDXdYJbyXfHI8GDusErtAfPvhep1nROXJU75&_nc_zt=23&_nc_ht=scontent.fixc1-8.fna&_nc_gid=tghM3F3jTG4m4QRTzXZeCA&oh=00_AfpsKEDjAu29k40nGo6oZNeQ30xLAk082xnH3HJ5Yw0lgA&oe=695D5483",
//       title: "Size 21-30 Children Basketball Shoes Girls Boys",
//       price: "1525.00",
//       rating: "4.2",
//     },
//     {
//         id : "16",
//       image: "https://scontent.fixc1-7.fna.fbcdn.net/v/t39.84726-6/608432892_1796048337718821_6197942046051219135_n.jpg?stp=dst-jpg_p720x720_tt6&_nc_cat=103&ccb=1-7&_nc_sid=92e707&_nc_ohc=3vSkxVzWDlIQ7kNvwFsjwah&_nc_oc=Adm9u4ZPJg2Lr-ia0iAmpqBl81cE0SIWSqLZX8ywhiQRe7m12GLSil9N0rUa9knORJv3LyzqH8vxuS8-vorjgeQc&_nc_zt=14&_nc_ht=scontent.fixc1-7.fna&_nc_gid=TapGsnu_jRlccIBk8zoeTw&oh=00_Afp0z03O5vvr1OwQ3edGliEUAHhlx-5Y7Xxc8wQtYjoT4A&oe=695D7A6F",
//       title:
//         "Solid Chair Cover Office Computer Spandex Split Seat Cover Universal",
//       price: "2225.00",
//       rating: "4.9",
//     },
    
//   ];

