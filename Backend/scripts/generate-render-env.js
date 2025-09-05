// Script to generate Render environment variables for Neon database
console.log('🚀 Render to Neon Database Migration');
console.log('=====================================\n');

console.log('📋 Environment Variables for Render Dashboard:');
console.log('==============================================\n');

console.log('❌ REMOVE these old variables:');
console.log('DATABASE_HOST');
console.log('DATABASE_PORT');
console.log('DATABASE_NAME');
console.log('DATABASE_USERNAME');
console.log('DATABASE_PASSWORD\n');

console.log('✅ ADD/UPDATE these variables:');
console.log('================================\n');

console.log('DATABASE_CLIENT=postgres');
console.log('DATABASE_URL=postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-misty-cell-adec1wqm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
console.log('DATABASE_SSL=true');
console.log('DATABASE_SSL_REJECT_UNAUTHORIZED=false');
console.log('DATABASE_CONNECTION_TIMEOUT=60000');
console.log('DATABASE_POOL_MIN=2');
console.log('DATABASE_POOL_MAX=10\n');

console.log('🔧 Keep these existing variables:');
console.log('==================================\n');

console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('NODE_ENV=production');
console.log('APP_KEYS=your-existing-app-keys');
console.log('API_TOKEN_SALT=your-existing-api-token-salt');
console.log('ADMIN_JWT_SECRET=your-existing-admin-jwt-secret');
console.log('TRANSFER_TOKEN_SALT=your-existing-transfer-token-salt');
console.log('CLOUDINARY_NAME=your-cloudinary-name');
console.log('CLOUDINARY_KEY=your-cloudinary-key');
console.log('CLOUDINARY_SECRET=your-cloudinary-secret');
console.log('CLOUDINARY_FOLDER=strapi-uploads');
console.log('PUBLIC_URL=https://your-render-app-url.onrender.com');
console.log('PROXY=false');
console.log('DATABASE_DEBUG=false\n');

console.log('📝 Steps to Update Render:');
console.log('==========================\n');

console.log('1. Go to Render Dashboard → Your App → Environment');
console.log('2. Remove old database variables (HOST, PORT, NAME, USERNAME, PASSWORD)');
console.log('3. Add new DATABASE_URL variable');
console.log('4. Update DATABASE_SSL to true');
console.log('5. Add DATABASE_SSL_REJECT_UNAUTHORIZED=false');
console.log('6. Save changes');
console.log('7. Trigger new deployment\n');

console.log('🎉 After deployment, your database will be permanent and free!');
console.log('==============================================================\n');

console.log('📊 Benefits:');
console.log('- 3GB storage (vs 1GB on Render)');
console.log('- 10GB bandwidth/month');
console.log('- No expiration date');
console.log('- Serverless scaling');
console.log('- Professional hosting');
