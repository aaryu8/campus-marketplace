import { prisma } from '../src/db.js';
import crypto from "crypto";
import { scrypt } from "crypto";

export function hashPassword(password : string , salt : string): Promise<string>{
    return new Promise((resolve, reject) => {
        scrypt(password.normalize() , salt , 64 , (error , hash)=> {
            if (error )   reject(error)
            resolve(hash.toString("hex").normalize());
        })
    })
}

async function main() {
    const salt = crypto.randomBytes(16).toString("hex");
  const passwords = await Promise.all([
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
    hashPassword("password123", salt),
  ]);

  const users = await Promise.all([
    prisma.user.create({ data: { name: "Aryan Kaushik", email: "aryan@iitd.ac.in", salt: salt, password: passwords[0]!, college: "IITD", branch: "CSE", year: 2 }}),
    prisma.user.create({ data: { name: "Priya Mehta", email: "priya@dtu.ac.in", salt: salt, password: passwords[1]!, college: "DTU", branch: "EEE", year: 3 }}),
    prisma.user.create({ data: { name: "Pranav Pathak", email: "rohan@nsut.ac.in", salt: salt, password: passwords[2]!, college: "NSUT", branch: "IT", year: 1 }}),
    prisma.user.create({ data: { name: "Sneha Gupta", email: "sneha@mait.ac.in", salt: salt, password: passwords[3]!, college: "MAIT", branch: "ECE", year: 4 }}),
    prisma.user.create({ data: { name: "Karan Singh", email: "karan@iiitd.ac.in", salt: salt, password: passwords[4]!, college: "IIITD", branch: "CE", year: 2 }}),
    prisma.user.create({ data: { name: "Ananya Patel", email: "ananya@msit.ac.in", salt: salt, password: passwords[5]!, college: "MSIT", branch: "IT", year: 3 }}),
    prisma.user.create({ data: { name: "Anubhav Tagore", email: "dev@bvcoe.ac.in", salt: salt, password: passwords[6]!, college: "BVCOE", branch: "ME", year: 2 }}),
    prisma.user.create({ data: { name: "Riya Jogi", email: "riya@nsut.ac.in", salt: salt, password: passwords[7]!, college: "NSUT", branch: "ECE", year: 4 }}),
  ]);

  const listings = [
    // ── BOOKS ──
    { title: "HC Verma Concepts of Physics Part 1 & 2", price: 280, description: "Both parts, solutions bookmarked with sticky notes. Perfect for JEE/CBSE. Minor wear on cover only.", category: "books", condition: "fair", image: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"], status: "active", owner: 0 },
    { title: "MTG Fingertips Biology NEET", price: 320, description: "2023 edition, all diagrams intact. Highlighted in two colors — very helpful for quick revision.", category: "books", condition: "good", image: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"], status: "active", owner: 1 },
    { title: "GATE CSE Made Easy Notes Full Set", price: 950, description: "Complete set for GATE CSE — DS, Algo, OS, CN, DBMS, TOC. Handwritten + printed mix. Very clean.", category: "books", condition: "like_new", image: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600"], status: "active", owner: 2 },
    { title: "Irodov Problems in General Physics", price: 180, description: "Classic book, some pencil markings. Great resource for olympiad and advanced JEE prep.", category: "books", condition: "fair", image: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"], status: "active", owner: 3 },
    { title: "Operating Systems — Galvin 10th Edition", price: 420, description: "Pristine condition. Bought for semester but used online material instead. Like new.", category: "books", condition: "like_new", image: ["https://images.unsplash.com/photo-1589998059171-988d887df646?w=600"], status: "active", owner: 4 },
    { title: "SL Loney Trigonometry + Coordinate Geometry", price: 220, description: "Both books in one lot. Key theorems underlined in pencil. Great for JEE maths.", category: "books", condition: "good", image: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600"], status: "active", owner: 5 },
    { title: "NPTEL Printed Notes — Machine Learning", price: 500, description: "Printed and spiral bound NPTEL ML notes. Covers regression, SVM, neural nets. 180 pages.", category: "books", condition: "good", image: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"], status: "active", owner: 6 },
    { title: "Allen DLP Modules — JEE Mains+Advanced", price: 700, description: "Full set — Physics, Chemistry, Maths. 2022 batch. Minor highlights. Selling before hostel checkout.", category: "books", condition: "good", image: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"], status: "active", owner: 7 },
    { title: "Computer Networks — Tanenbaum 5th Ed", price: 380, description: "Good condition. Used for one semester. Some corner folds but all pages intact.", category: "books", condition: "good", image: ["https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600"], status: "active", owner: 0 },
    { title: "Design Patterns — Gang of Four", price: 650, description: "Hardcover, excellent condition. Essential for software engineering interviews.", category: "books", condition: "like_new", image: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"], status: "active", owner: 1 },

    // ── ELECTRONICS ──
    { title: "Dell Inspiron 15 i5 11th Gen 8GB RAM", price: 28000, description: "2021 model, works perfectly. Battery backup 4-5 hrs. Minor scratches on lid. Charger included.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"], status: "active", owner: 2 },
    { title: "Boat Rockerz 450 Wireless Headphones", price: 850, description: "Great sound quality. 15hr battery. One ear cushion slightly worn. Works perfectly.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"], status: "active", owner: 3 },
    { title: "Xiaomi 65W Fast Charger + Cable", price: 350, description: "Original Xiaomi charger, barely used. Works with any USB-C device.", category: "electronics", condition: "like_new", image: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600"], status: "active", owner: 4 },
    { title: "Raspberry Pi 4 Model B 4GB", price: 4200, description: "Used for one project, fully working. Comes with case, heatsink and SD card.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"], status: "active", owner: 5 },
    { title: "Logitech MX Keys Mini Keyboard", price: 3500, description: "Excellent typing experience. Barely used — switched to laptop keyboard. All keys work.", category: "electronics", condition: "like_new", image: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"], status: "active", owner: 6 },
    { title: "Usha Table Fan 400mm", price: 600, description: "Works perfectly, 3 speed settings. Used for 2 semesters. Selling before going home.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"], status: "active", owner: 7 },
    { title: "Canon PIXMA Ink Cartridges PG-745", price: 280, description: "2 black cartridges, unopened box. Compatible with PIXMA MG2577S. Selling unused stock.", category: "electronics", condition: "new", image: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600"], status: "active", owner: 0 },
    { title: "SanDisk 128GB USB 3.0 Pen Drive", price: 550, description: "Fast read speeds, used for backups. No data on it. Works on all devices.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1618472609777-b038f1f04b8d?w=600"], status: "active", owner: 1 },
    { title: "JBL Go 3 Bluetooth Speaker", price: 1200, description: "Loud and clear sound. Waterproof. Battery lasts 5 hrs. Selling as I got a bigger one.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"], status: "active", owner: 2 },
    { title: "Arduino Uno R3 + Starter Kit", price: 900, description: "Starter kit with components — LEDs, resistors, sensors. Board works fine.", category: "electronics", condition: "good", image: ["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600"], status: "active", owner: 3 },

    // ── FURNITURE ──
    { title: "Wooden Study Table with Shelf", price: 1800, description: "Solid wood, 4x2 ft. Has a top shelf for books. Minor scratches. Very sturdy.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600"], status: "active", owner: 4 },
    { title: "Foldable Iron Chair", price: 400, description: "Lightweight and foldable. Good for desk use. Slight rust on legs but fully functional.", category: "furniture", condition: "fair", image: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600"], status: "active", owner: 5 },
    { title: "Wooden Bookshelf 3-Tier", price: 1200, description: "Fits well in small rooms. Holds 40-50 books easily. Good condition.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1588279102819-3e4c7c92b4c4?w=600"], status: "active", owner: 6 },
    { title: "IKEA LACK Side Table", price: 700, description: "White surface, no scratches. Perfect beside bed for laptop or water bottle.", category: "furniture", condition: "like_new", image: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"], status: "active", owner: 7 },
    { title: "Foam Mattress 6x3 ft Single", price: 1500, description: "4-inch foam, comfortable. Used for 1 year. Clean, no stains. Selling on hostel checkout.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600"], status: "active", owner: 0 },
    { title: "Study Chair with Cushion", price: 1100, description: "Padded seat, adjustable backrest. Used for 2 years but still very comfortable.", category: "furniture", condition: "fair", image: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"], status: "active", owner: 1 },
    { title: "Plastic Drawer Unit 3-Tier", price: 550, description: "Good for storing clothes or stationery. Wheels intact. All drawers slide smoothly.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"], status: "active", owner: 2 },
    { title: "Wall Mounted Floating Shelf", price: 350, description: "White wooden shelf, 2 ft wide. Screws and wall plugs included.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600"], status: "active", owner: 3 },
    { title: "Folding Laptop Table for Bed", price: 650, description: "Adjustable height, portable. Great for studying in bed. Like new condition.", category: "furniture", condition: "like_new", image: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600"], status: "active", owner: 4 },
    { title: "Steel Almirah Double Door", price: 3500, description: "Godrej-style steel cupboard. Lock and key included. Needs two people to move.", category: "furniture", condition: "good", image: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600"], status: "active", owner: 5 },

    // ── CLOTHES ──
    { title: "Levi's 511 Slim Jeans W32 L32", price: 700, description: "Dark blue, worn 3-4 times. No fading. Great condition.", category: "clothes", condition: "like_new", image: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"], status: "active", owner: 6 },
    { title: "Campus Shoes Size 9", price: 500, description: "Running shoes, used for 4 months. Soles in good condition.", category: "clothes", condition: "good", image: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], status: "active", owner: 7 },
    { title: "North Face Fleece Jacket M", price: 1200, description: "Warm and barely used. Perfect for Delhi winters on campus.", category: "clothes", condition: "like_new", image: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"], status: "active", owner: 0 },
    { title: "Formal Shirt Bundle x3 (L)", price: 600, description: "3 shirts — white, light blue, and grey. Worn for interviews. Clean and ironed.", category: "clothes", condition: "good", image: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4fc4?w=600"], status: "active", owner: 1 },
    { title: "Puma Track Pants M", price: 450, description: "Black with white stripes. Elastic waist. Used for gym. Good condition.", category: "clothes", condition: "good", image: ["https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600"], status: "active", owner: 2 },
    { title: "H&M Oversized Hoodie XL", price: 550, description: "Grey melange, super cozy. No pilling. Fits like a dream for lazy hostel days.", category: "clothes", condition: "like_new", image: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600"], status: "active", owner: 3 },
    { title: "Woodland Boots Size 8", price: 1800, description: "Brown leather. Worn 5-6 times. Soles perfect. Selling because wrong size.", category: "clothes", condition: "like_new", image: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600"], status: "active", owner: 4 },
    { title: "Sports Shorts x2 — Adidas/Nike", price: 300, description: "Two pairs, size M. Both in good condition. Perfect for gym or morning run.", category: "clothes", condition: "good", image: ["https://images.unsplash.com/photo-1565084888279-aca607bb8427?w=600"], status: "active", owner: 5 },
    { title: "Denim Jacket Size S", price: 800, description: "Light wash, slightly distressed look. Worn for photos mostly. Great condition.", category: "clothes", condition: "like_new", image: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600"], status: "active", owner: 6 },
    { title: "College Fest T-Shirts Bundle x5", price: 250, description: "Random college event tees. Various sizes M-L. Good for gym or sleeping.", category: "clothes", condition: "fair", image: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], status: "active", owner: 7 },

    // ── FOOD ──
    { title: "Maggi Noodles x12 Pack", price: 180, description: "Masala flavour, full box. MFD Jan 2025. Bought in bulk, selling extra.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600"], status: "active", owner: 0 },
    { title: "Protein Powder — ON Whey 1kg", price: 2200, description: "Double Rich Chocolate, 70% remaining. Opened 2 months ago. Stored properly.", category: "food", condition: "good", image: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600"], status: "active", owner: 1 },
    { title: "Sunfeast Dark Fantasy Choco Fills x3", price: 120, description: "Three packs, sealed. Best before June 2025. Great midnight snack.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600"], status: "active", owner: 2 },
    { title: "Peanut Butter Creamy 1kg — MyFitness", price: 550, description: "Half remaining, stored in cool place. No added sugar version.", category: "food", condition: "good", image: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"], status: "active", owner: 3 },
    { title: "Tea Bags Twinings English Breakfast x50", price: 300, description: "Sealed box. Great for late night study sessions.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600"], status: "active", owner: 4 },
    { title: "Instant Oats Quaker 1kg", price: 200, description: "Sealed bag. Quick breakfast option. Bought two, selling one.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"], status: "active", owner: 5 },
    { title: "Roasted Almonds 500g", price: 280, description: "Lightly salted, sealed pack. Good before gym or as study snack.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=600"], status: "active", owner: 6 },
    { title: "Nescafe Classic 200g Jar", price: 380, description: "Opened, 80% remaining. Stored in airtight condition. Great coffee.", category: "food", condition: "good", image: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600"], status: "active", owner: 7 },
    { title: "Bournvita 500g + Horlicks 500g Combo", price: 350, description: "Both sealed. Bought for hostel but switching to black coffee.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600"], status: "active", owner: 0 },
    { title: "Mixed Dry Fruits 250g Pack", price: 220, description: "Cashews, raisins and almonds. Sealed pouch. Good for exam season snacking.", category: "food", condition: "new", image: ["https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600"], status: "active", owner: 1 },

    // ── SPORTS ──
    { title: "Yonex Muscle Power 2 Badminton Racket", price: 650, description: "Good for intermediate players. String tension maintained. Grip slightly worn.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600"], status: "active", owner: 2 },
    { title: "Cosco Cricket Bat Full Size", price: 900, description: "Kashmir willow, used for one season. Good knocking done. Handle grip intact.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600"], status: "active", owner: 3 },
    { title: "Nivia Football Size 5", price: 500, description: "Standard size, good air retention. Used on turf. Minor scuffs.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600"], status: "active", owner: 4 },
    { title: "Resistance Bands Set of 5", price: 350, description: "Different resistance levels. Good for home workout or warm-up. All intact.", category: "sports", condition: "like_new", image: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600"], status: "active", owner: 5 },
    { title: "Skipping Rope — Adjustable Steel Wire", price: 200, description: "Ball bearing handles, smooth rotation. Used twice. Works great.", category: "sports", condition: "like_new", image: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"], status: "active", owner: 6 },
    { title: "SG Cricket Gloves + Pads Set", price: 1200, description: "Junior/medium size. Used for 2 seasons. Pads in good condition.", category: "sports", condition: "fair", image: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600"], status: "active", owner: 7 },
    { title: "Table Tennis Bat + 3 Balls", price: 400, description: "Stag brand, penhold grip. Rubber slightly worn but playable.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1611251135345-18c56206b863?w=600"], status: "active", owner: 0 },
    { title: "Gym Gloves + Wrist Wraps", price: 300, description: "Combo set. Good padding. Used for 3 months. Washed and clean.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600"], status: "active", owner: 1 },
    { title: "Volleyball Cosco Official Size", price: 600, description: "Used for hostel tournaments. Good air retention. Minor surface marks.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600"], status: "active", owner: 2 },
    { title: "Yoga Mat 6mm Non-Slip", price: 450, description: "Purple color, good grip. Used for 6 months. No tears. Clean.", category: "sports", condition: "good", image: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"], status: "active", owner: 3 },

    // ── TRANSPORT ──
    { title: "Hero Sprint 26T Mountain Cycle", price: 3200, description: "21-speed gears, front suspension. Used for 1 year. Tyres recently changed.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600"], status: "active", owner: 4 },
    { title: "Atlas Cycle — Single Speed", price: 1800, description: "Simple and reliable. Good for campus commute. Brakes work fine.", category: "transport", condition: "fair", image: ["https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600"], status: "active", owner: 5 },
    { title: "Helmet ISI Certified — Steelbird", price: 550, description: "Full face, black colour. Size L. Used for 6 months. No damage.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600"], status: "active", owner: 6 },
    { title: "Firefox Bikes Road Runner 700C", price: 5500, description: "Road bike with drop handlebars. Fast and smooth. Serviced recently.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600"], status: "active", owner: 7 },
    { title: "Cycle Lock + Chain Kryptonite", price: 400, description: "Heavy duty combination lock with chain. Very secure.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1558981359-336cb7b4e041?w=600"], status: "active", owner: 0 },
    { title: "Hercules Roadeo A50 MTB", price: 2800, description: "18-speed, front disc brake. Minor rust on chain — easily fixable.", category: "transport", condition: "fair", image: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600"], status: "active", owner: 1 },
    { title: "Skateboard Complete Setup", price: 1500, description: "7-ply maple deck, ABEC-7 bearings. Good for beginners. Wheels in good shape.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600"], status: "active", owner: 2 },
    { title: "Cycle Repair Tool Kit", price: 350, description: "Multi-tool, tyre levers, patches, pump adapter. Complete kit.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1558618047-f4e60d4d8e45?w=600"], status: "active", owner: 3 },
    { title: "Schwinn Cruiser Beach Bike", price: 4200, description: "Single speed, wide tyres, very comfortable for flat campus roads.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600"], status: "active", owner: 4 },
    { title: "Cycle Rear Carrier + Bungee Cords", price: 300, description: "Steel carrier, fits most cycles. Good for carrying bags to campus.", category: "transport", condition: "good", image: ["https://images.unsplash.com/photo-1558981359-336cb7b4e041?w=600"], status: "active", owner: 5 },

    // ── HOSTEL ──
    { title: "Bajaj Majesty 1000W Room Heater", price: 800, description: "Works perfectly. Used for 2 winters. Auto cut-off feature works.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"], status: "active", owner: 6 },
    { title: "Philips Electric Kettle 1.5L", price: 500, description: "Fast boiling, automatic shutoff. Used for 1.5 years. No limescale.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600"], status: "active", owner: 7 },
    { title: "Extension Board 4-Socket with Switch", price: 250, description: "Havells brand, 3-metre wire. All sockets work. Safe for hostel use.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"], status: "active", owner: 0 },
    { title: "Bucket + Mug Set", price: 150, description: "Large 20L bucket with matching mug. Good quality plastic. Clean.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"], status: "active", owner: 1 },
    { title: "Mosquito Racket + Repellent Combo", price: 280, description: "Electric racket with USB charging + 2 liquid repellent refills.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"], status: "active", owner: 2 },
    { title: "Study Lamp LED Adjustable", price: 400, description: "3 brightness levels, eye-care mode. USB powered. Perfect for night study.", category: "hostel", condition: "like_new", image: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"], status: "active", owner: 3 },
    { title: "Clothes Drying Stand Foldable", price: 350, description: "Steel frame, holds 10-12 clothes. Folds flat for storage.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600"], status: "active", owner: 4 },
    { title: "Pressure Cooker 2L Hawkins", price: 700, description: "2-litre, perfect for single person cooking. Whistle and gasket intact.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"], status: "active", owner: 5 },
    { title: "Room Freshener + Diffuser Set", price: 300, description: "Reed diffuser with extra sticks. Lavender scent. Barely used.", category: "hostel", condition: "like_new", image: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600"], status: "active", owner: 6 },
    { title: "Mini Fridge 40L — Godrej", price: 4500, description: "Compact single door. Works perfectly. Ideal for hostel room. Selling on final year exit.", category: "hostel", condition: "good", image: ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600"], status: "active", owner: 7 },
  ];

  for (const l of listings) {
    await prisma.product.create({
      data: {
        title: l.title,
        price: l.price,
        description: l.description,
        category: l.category as any,
        condition: l.condition as any,
        image: l.image,
        status: l.status as any,
        ownerId: users[l.owner]!.id,
        views: Math.floor(Math.random() * 200) + 10,
      }
    });
  }

  console.log(`✅ Seeded ${users.length} users and ${listings.length} listings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());