const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const JSON_DB_PATH = path.join(__dirname, '..', 'db.json');
let useMongo = false;

// Default Menu Items for Seeding
const defaultMenuItems = [
  {
    name: "Tandoori Paneer Tikka",
    description: "Cottage cheese cubes marinated in spiced yogurt, skewered with bell peppers and onions, grilled in a traditional tandoor.",
    price: 349,
    category: "Appetizers",
    tags: ["vegetarian", "chef-special"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Crispy Samosa Chaat",
    description: "Deconstructed potato samosas topped with spicy chickpeas, sweet yogurt, tamarind and mint chutneys, and fine sev.",
    price: 189,
    category: "Appetizers",
    tags: ["vegetarian", "popular"],
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Kimaya's Signature Butter Chicken",
    description: "Tender tandoori chicken simmered in a rich, velvety tomato and cashew gravy, finished with fresh cream and dried fenugreek leaves.",
    price: 499,
    category: "Mains",
    tags: ["popular", "chef-special"],
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Slow-Cooked Awadhi Mutton Biryani",
    description: "Fragrant basmati rice layered with succulent pieces of mutton, saffron, and aromatic spices, cooked under 'dum' steam.",
    price: 549,
    category: "Mains",
    tags: ["hot", "popular"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils simmered overnight with tomatoes, butter, and cream for a rich, smoky flavor.",
    price: 329,
    category: "Mains",
    tags: ["vegetarian"],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Garlic & Butter Naan",
    description: "Traditional leavened flatbread baked in a clay oven, brushed with fresh garlic and melted butter.",
    price: 95,
    category: "Mains",
    tags: ["vegetarian"],
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Traditional Gulab Jamun",
    description: "Soft, golden-fried milk solid dumplings soaked in a warm, cardamom-infused sugar syrup.",
    price: 149,
    category: "Desserts",
    tags: ["vegetarian", "popular"],
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Shahi Kulfi Falooda",
    description: "Traditional dense Indian ice cream flavored with saffron and pistachio, served over corn-starch vermicelli and rose syrup.",
    price: 199,
    category: "Desserts",
    tags: ["vegetarian", "chef-special"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Traditional Masala Kulhad Chai",
    description: "A warming, aromatic tea brewed strong with milk, fresh ginger, cardamom, and a blend of North Indian spices.",
    price: 89,
    category: "Beverages",
    tags: ["hot"],
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Classic Sweet Lassi",
    description: "A thick, refreshing traditional Punjabi yogurt drink blended with sugar, cardamoms, and topped with a dollop of malai.",
    price: 129,
    category: "Beverages",
    tags: ["popular"],
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600",
    available: true
  }
];

// Helper to read JSON DB
function readJsonDb() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const initialDb = { menu: defaultMenuItems, reservations: [] };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON database, resetting file:", err);
    const initialDb = { menu: defaultMenuItems, reservations: [] };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
}

// Helper to write JSON DB
function writeJsonDb(data) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

// Connect to MongoDB
async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kimayas_kitchen';
  try {
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Timeout after 3 seconds
    });
    useMongo = true;
    console.log('MongoDB successfully connected!');
    await seedDefaultData();
  } catch (err) {
    console.warn('\n======================================================');
    console.warn('WARNING: Failed to connect to MongoDB!');
    console.warn('Reason:', err.message);
    console.warn('FALLING BACK: Running with local JSON database (db.json)');
    console.warn('======================================================\n');
    useMongo = false;
    // Initialize JSON DB
    readJsonDb();
  }
}

// Seed data
async function seedDefaultData() {
  if (useMongo) {
    const MenuItem = require('../models/MenuItem');
    try {
      const count = await MenuItem.countDocuments();
      if (count === 0) {
        console.log('Seeding default menu items into MongoDB...');
        await MenuItem.insertMany(defaultMenuItems);
        console.log('Seeding completed successfully!');
      }
    } catch (err) {
      console.error('Error seeding MongoDB menu items:', err);
    }
  } else {
    // Seed JSON db if empty
    const db = readJsonDb();
    if (!db.menu || db.menu.length === 0) {
      db.menu = defaultMenuItems;
      writeJsonDb(db);
      console.log('Seeded default menu items into JSON database.');
    }
  }
}

// Get Menu Items
async function getMenuItems() {
  if (useMongo) {
    const MenuItem = require('../models/MenuItem');
    return await MenuItem.find({});
  } else {
    const db = readJsonDb();
    return db.menu;
  }
}

// Add/Update/Delete Menu Items (For ease of customization)
async function addMenuItem(item) {
  if (useMongo) {
    const MenuItem = require('../models/MenuItem');
    const newItem = new MenuItem(item);
    return await newItem.save();
  } else {
    const db = readJsonDb();
    const newItem = {
      _id: 'json_' + Date.now() + Math.random().toString(36).substr(2, 9),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.menu.push(newItem);
    writeJsonDb(db);
    return newItem;
  }
}

// Get Reservations
async function getReservations() {
  if (useMongo) {
    const Reservation = require('../models/Reservation');
    return await Reservation.find({}).sort({ date: 1, time: 1 });
  } else {
    const db = readJsonDb();
    return db.reservations;
  }
}

// Add Reservation
async function addReservation(resData) {
  if (useMongo) {
    const Reservation = require('../models/Reservation');
    const newReservation = new Reservation(resData);
    return await newReservation.save();
  } else {
    const db = readJsonDb();
    const newReservation = {
      _id: 'json_' + Date.now() + Math.random().toString(36).substr(2, 9),
      ...resData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.reservations.push(newReservation);
    writeJsonDb(db);
    return newReservation;
  }
}

module.exports = {
  connectDB,
  useMongo: () => useMongo,
  getMenuItems,
  addMenuItem,
  getReservations,
  addReservation,
  seedDefaultData
};
