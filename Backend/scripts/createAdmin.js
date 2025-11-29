import mongoose from 'mongoose';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'morslisport97@gmail.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: morslisport97@gmail.com');
      console.log('   Updating to admin role...');
      existingAdmin.role = 'admin';
      existingAdmin.password = 'MorsliSport99@T'; // Will be hashed by pre-save hook
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('Creating admin user...');
      const admin = await User.create({
        email: 'morslisport97@gmail.com',
        password: 'MorsliSport99@T',
        role: 'admin',
        name: 'Admin User'
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();

