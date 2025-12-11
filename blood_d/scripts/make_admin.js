const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument.');
    console.log('Usage: node scripts/make_admin.js <email>');
    process.exit(1);
}

async function makeAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Define a minimal User schema/model if not importing the app's model
        // (Often easier in scripts to just use a loose schema or assume collection 'users')
        const User = mongoose.model('User', new mongoose.Schema({ role: String, email: String }), 'users');

        const result = await User.updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount === 0) {
            console.log(`No user found with email: ${email}`);
        } else if (result.modifiedCount === 0) {
            console.log(`User ${email} is already an admin (or role didn't change).`);
        } else {
            console.log(`Successfully updated ${email} to be an ADMIN.`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

makeAdmin();
