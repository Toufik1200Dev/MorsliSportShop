# Neon Database Setup - Complete Guide

## ✅ Your Neon Database is Ready!

**Connection String:**
```
postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-muddy-mud-adlz7y69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🔧 Environment Variables Setup

Create a `.env` file in your `Backend` folder with these variables:

```env
# Database Configuration - Neon PostgreSQL (Free Forever)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-muddy-mud-adlz7y69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# App Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Strapi Security Keys (Generate new ones for production)
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Cloudinary Configuration (Update with your credentials)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=strapi-uploads

# Public URL (Update with your actual domain)
PUBLIC_URL=https://your-app-url.com

# Security
PROXY=false
DATABASE_DEBUG=false
```

## 🚀 Next Steps

### 1. Create Your .env File
```bash
# In your Backend folder
touch .env
# Then copy the content above into it
```

### 2. Generate Security Keys
```bash
# Generate secure keys for production
node -e "console.log('APP_KEYS=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Test Your Application
```bash
# Start your Strapi application
npm run develop

# Check if it connects to Neon database
# Visit http://localhost:1337/admin
```

## 🎉 Benefits of Neon Database

✅ **Free Forever** - No expiration date  
✅ **3GB Storage** - Plenty for your e-commerce site  
✅ **10GB Bandwidth** - Monthly transfer limit  
✅ **Automatic Backups** - Your data is safe  
✅ **Serverless** - Scales automatically  
✅ **Professional Hosting** - Reliable and fast  

## 🔄 Migration from Old Database

If you have data in your old database, you can migrate it:

1. **Export from old database:**
   ```bash
   pg_dump -h old-host -U old-username -d old-database > backup.sql
   ```

2. **Import to Neon:**
   ```bash
   psql "postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-muddy-mud-adlz7y69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" < backup.sql
   ```

## 🆘 Troubleshooting

### Connection Issues:
- Make sure your `.env` file is in the `Backend` folder
- Check that `DATABASE_SSL=true` is set
- Verify the connection string is correct

### Strapi Issues:
- Clear cache: `rm -rf .cache`
- Rebuild: `npm run build`
- Check logs for specific errors

## 📊 Database Management

- **Dashboard**: Visit [neon.tech](https://neon.tech) to manage your database
- **Monitoring**: Check usage and performance
- **Backups**: Automatic daily backups included
- **Scaling**: Upgrade anytime if needed

---

**Your database is now permanent and free! 🎉**
