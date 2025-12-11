const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
// fallback to .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

async function testConnection() {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log("MONGODB_URI defined?", !!MONGODB_URI);

    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is missing");
        return;
    }

    try {
        console.log("Attempting to connect...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}

testConnection();
