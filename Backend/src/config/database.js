import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`); // Hide password in logs
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n💡 Troubleshooting tips:`);
    console.error(`   1. Check if MongoDB Atlas cluster is running (not paused)`);
    console.error(`   2. Verify your IP is whitelisted in MongoDB Atlas (Network Access)`);
    console.error(`   3. Check network connectivity`);
    console.error(`   4. Verify connection string is correct in .env file`);
    console.error(`\n⚠️  Server will continue but database features won't work until MongoDB is connected.`);
    console.error(`   You can check MongoDB Atlas dashboard: https://cloud.mongodb.com\n`);
    // Re-throw error so caller can handle it, but don't exit process
    throw error;
  }
};

export default connectDB;

