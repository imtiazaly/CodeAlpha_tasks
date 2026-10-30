const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
// Industry best-practice: absolute path resolution for .env from subfolder
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Product = require("../../models/Product");

// 8 Diverse Categories with curated Unsplash CDN Images
const categoriesConfig = [
  {
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Wireless Headphones",
      "Mechanical Keyboard",
      "Ergonomic Mouse",
      "Bluetooth Speaker",
      "Active Noise Canceling Earbuds",
      "USB-C GaN Fast Charger",
      "Studio Microphone",
      "Smart LED Desk Lamp",
    ],
    priceRange: [29, 399],
  },
  {
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Retro Canvas Low-Tops",
      "All-White Leather Sneakers",
      "Trail Running Shoes",
      "Suede Chelsea Boots",
      "Lightweight Marathon Trainers",
      "Slip-on Minimalist Loafers",
    ],
    priceRange: [55, 210],
  },
  {
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Heavyweight Organic Tee",
      "French Terry Hoodie",
      "Selvedge Denim Jeans",
      "Relaxed Chino Trousers",
      "Merino Wool Crewneck",
      "Oversized Utility Overshirt",
      "Puffer Winter Vest",
    ],
    priceRange: [28, 160],
  },
  {
    category: "Watches",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Automatic Chronograph",
      "Minimalist Bauhaus Watch",
      "Sapphire Smartwatch",
      "Field Watch with Canvas Strap",
      "Diver 200m Steel Watch",
    ],
    priceRange: [120, 580],
  },
  {
    category: "Bags & Luggage",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Waxed Canvas Backpack",
      "Leather Bifold Wallet",
      "Crossbody Sling Pack",
      "Weekender Duffle Bag",
      "Slim Laptop Sleeve",
      "Commuter Roll-top Bag",
    ],
    priceRange: [25, 195],
  },
  {
    category: "Home & Decor",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Soy Scented Amber Candle",
      "Geometric Ceramic Vase",
      "Woven Cotton Throw Blanket",
      "Aromatherapy Ultrasonic Diffuser",
      "Minimalist Concrete Planter",
    ],
    priceRange: [18, 95],
  },
  {
    category: "Kitchen & Dining",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Ceramic Pour-Over Dripper",
      "Matte Stoneware Mug Set",
      "French Press Coffee Maker",
      "Double Wall Glass Tumbler",
      "Cast Iron Skillet 10-inch",
    ],
    priceRange: [22, 110],
  },
  {
    category: "Sports & Fitness",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    ],
    items: [
      "Vacuum Insulated Flask 1L",
      "Non-Slip Eco Yoga Mat",
      "Adjustable Steel Jump Rope",
      "Resistance Loop Bands Set",
      "Gym Training Shaker Bottle",
    ],
    priceRange: [15, 85],
  },
];

const prefixes = [
  "Urban",
  "Artisan",
  "Apex",
  "Nordic",
  "Stealth",
  "Signature",
  "Heritage",
  "Vanguard",
  "Essential",
  "Refined",
  "Pro",
  "Core",
];
const adjectives = [
  "Matte Black",
  "Midnight Navy",
  "Oatmeal Beige",
  "Charcoal Grey",
  "Olive Green",
  "Pure White",
  "Crimson Edition",
  "Space Grey",
  "Sandstone",
];

function generateProducts(targetCount = 224) {
  const products = [];

  while (products.length < targetCount) {
    for (const cat of categoriesConfig) {
      if (products.length >= targetCount) break;

      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const baseItem = cat.items[Math.floor(Math.random() * cat.items.length)];
      const image = cat.images[Math.floor(Math.random() * cat.images.length)];

      const minPrice = cat.priceRange[0];
      const maxPrice = cat.priceRange[1];
      const price = parseFloat(
        (minPrice + Math.random() * (maxPrice - minPrice)).toFixed(2),
      );

      // Realistic stock breakdown
      const randStock = Math.random();
      let stock;
      if (randStock < 0.08) {
        stock = 0; // Out of stock
      } else if (randStock < 0.2) {
        stock = Math.floor(Math.random() * 5) + 1; // Low stock
      } else {
        stock = Math.floor(Math.random() * 50) + 10; // Plentiful stock
      }

      const name = `${prefix} ${baseItem} - ${adj}`;
      const description = `Crafted for everyday elegance. High-grade ${cat.category.toLowerCase()} item offering unmatched durability, sleek minimalist finish, and exceptional performance.`;

      products.push({
        name,
        description,
        price,
        category: cat.category,
        stock,
        image,
      });
    }
  }

  return products;
}

async function runSeeder() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connection established.");

    console.log("Purging existing product records...");
    await Product.deleteMany({});

    const products = generateProducts(224);
    console.log(
      `Seeding ${products.length} products with Unsplash CDN images...`,
    );

    const inserted = await Product.insertMany(products);
    console.log(
      `✅ [SUCCESS]: ${inserted.length} products seeded successfully!`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ [ERROR]: Product seeding failed:", error);
    process.exit(1);
  }
}

runSeeder();
