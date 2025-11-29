/**
 * Script to clean up dummy/test data from the database
 * Run this script before going to production: node scripts/cleanupDummyData.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const cleanupDummyData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Count before cleanup
    const productsBefore = await Product.countDocuments();
    const ordersBefore = await Order.countDocuments();
    const usersBefore = await User.countDocuments();

    console.log(`\n📊 Before cleanup:`);
    console.log(`   Products: ${productsBefore}`);
    console.log(`   Orders: ${ordersBefore}`);
    console.log(`   Users: ${usersBefore}`);

    // Delete test/dummy products (you can customize the criteria)
    // Example: products with "test" in name or description
    const testProducts = await Product.deleteMany({
      $or: [
        { Product_name: { $regex: /test/i } },
        { Product_name: { $regex: /dummy/i } },
        { Product_name: { $regex: /sample/i } },
        { Product_desctiption: { $regex: /test/i } },
      ],
    });

    // Delete test/dummy orders (you can customize the criteria)
    const testOrders = await Order.deleteMany({
      $or: [
        { clientName: { $regex: /test/i } },
        { clientName: { $regex: /dummy/i } },
        { email: { $regex: /test/i } },
        { email: { $regex: /dummy/i } },
      ],
    });

    // Delete non-admin test users (keep only admin)
    const testUsers = await User.deleteMany({
      $and: [
        { role: { $ne: 'admin' } },
        {
          $or: [
            { email: { $regex: /test/i } },
            { email: { $regex: /dummy/i } },
          ],
        },
      ],
    });

    console.log(`\n🧹 Cleanup completed:`);
    console.log(`   Deleted ${testProducts.deletedCount} test products`);
    console.log(`   Deleted ${testOrders.deletedCount} test orders`);
    console.log(`   Deleted ${testUsers.deletedCount} test users`);

    // Count after cleanup
    const productsAfter = await Product.countDocuments();
    const ordersAfter = await Order.countDocuments();
    const usersAfter = await User.countDocuments();

    console.log(`\n📊 After cleanup:`);
    console.log(`   Products: ${productsAfter}`);
    console.log(`   Orders: ${ordersAfter}`);
    console.log(`   Users: ${usersAfter}`);

    console.log('\n✅ Database cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
};

cleanupDummyData();

