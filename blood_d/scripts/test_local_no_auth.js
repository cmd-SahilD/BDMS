const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/blood_d_test_connection';

console.log('Attempting to connect to local (no-auth):', MONGODB_URI);

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Successfully connected to local MongoDB!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Local connection failed:', error.message);
    }
}

testConnection();
