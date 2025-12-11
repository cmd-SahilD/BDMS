const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local form ' + envPath);
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.log('.env.local not found at ' + envPath);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

// Mask URI for logging
const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log('Attempting to connect to:', maskedURI);

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // 5s timeout
        });
        console.log('Successfully connected to MongoDB!');
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Connection failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testConnection();
