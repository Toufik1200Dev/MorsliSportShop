# Deployment Guide for Render

## Environment Variables to Set in Render

Make sure to set these environment variables in your Render dashboard:

### Database Configuration (REQUIRED - MongoDB)
```
DATABASE_CLIENT=mongo
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
DATABASE_USERNAME=your-mongodb-username
DATABASE_PASSWORD=your-mongodb-password
DATABASE_SSL=true
DATABASE_AUTH_SOURCE=admin
```

**⚠️ IMPORTANT:** You MUST set up a MongoDB database. We recommend MongoDB Atlas (free tier available). SQLite will not work in production!

**Free MongoDB Options:**
- **MongoDB Atlas** (Recommended) - 512MB free tier
- **Railway** - 1GB free tier
- **MongoDB Cloud** - Free tier available

### App Configuration
```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
```

### Cloudinary Configuration
```
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=strapi-uploads
```

### Public URL
```
PUBLIC_URL=https://your-render-app-url.onrender.com
```

### Security
```
PROXY=false
DATABASE_DEBUG=false
```

## Build Command
```
npm install
npm run build
```

## Start Command
```
npm start
```

## Key Improvements Made

1. **Cloudinary Timeout Fix**: Added 60-second timeout and retry logic
2. **Session Persistence**: Configured proper session management to prevent admin re-signup
3. **Bulk Upload Handling**: Added better error handling for multiple file uploads
4. **Memory Optimization**: Increased memory limits and added monitoring
5. **Request Size Limits**: Set appropriate limits for file uploads
6. **Error Recovery**: Added custom error handlers and retry mechanisms

## Troubleshooting

### If you still get timeout errors:
- Reduce the number of files uploaded at once
- Check your Cloudinary plan limits
- Verify your network connection to Cloudinary

### If admin panel still requires re-signup:
- Check that APP_KEYS is properly set
- Verify session configuration in admin.js
- Ensure database is persistent

### If JSON parsing errors persist:
- Check file sizes (should be under 10MB each)
- Verify request format
- Check network stability
