# Database Migration Guide - Free Permanent PostgreSQL

This guide helps you migrate from your temporary PostgreSQL database to a **permanent free solution**.

## 🎯 Recommended Options (All Free Forever)

### 1. **Neon Database** (Best Choice)
- **Storage**: 3GB free
- **Bandwidth**: 10GB/month
- **Features**: Serverless, auto-scaling
- **Signup**: [neon.tech](https://neon.tech)

### 2. **Supabase**
- **Storage**: 500MB free
- **Bandwidth**: 2GB/month
- **Features**: PostgreSQL + real-time
- **Signup**: [supabase.com](https://supabase.com)

### 3. **Railway**
- **Storage**: 1GB free
- **Credit**: $5/month
- **Features**: Easy deployment
- **Signup**: [railway.app](https://railway.app)

## 🚀 Quick Migration Steps

### Step 1: Set Up New Database

1. **Choose Neon** (recommended):
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub/Google
   - Create a new project
   - Copy your connection string

2. **Or choose Supabase**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings > Database
   - Copy your connection string

### Step 2: Export Current Database

```bash
# Install dependencies if needed
npm install pg

# Set your current database URL
export OLD_DATABASE_URL="your-current-database-url"

# Run the migration script
node scripts/migrate-database.js
```

### Step 3: Update Environment Variables

Create/update your `.env` file:

```env
# New Database Configuration
DATABASE_CLIENT=postgres
DATABASE_URL=your-new-database-connection-string
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Keep your other variables
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=strapi-uploads
PUBLIC_URL=https://your-app-url.com
```

### Step 4: Test Your Application

```bash
# Start your application
npm run develop

# Check if everything works
# Visit your admin panel and verify data is there
```

## 🔧 Manual Migration (Alternative)

If the script doesn't work, you can migrate manually:

### Export from Current Database:
```bash
# Export schema
pg_dump -h your-host -U your-username -d your-database --schema-only > schema.sql

# Export data
pg_dump -h your-host -U your-username -d your-database --data-only > data.sql
```

### Import to New Database:
```bash
# Import schema
psql -h new-host -U new-username -d new-database < schema.sql

# Import data
psql -h new-host -U new-username -d new-database < data.sql
```

## 🎉 Benefits of Migration

✅ **Permanent**: No expiration date  
✅ **Free**: No cost forever  
✅ **Reliable**: Professional hosting  
✅ **Scalable**: Can upgrade if needed  
✅ **Backup**: Automatic backups included  

## 🆘 Troubleshooting

### Connection Issues:
- Make sure SSL is enabled
- Check firewall settings
- Verify connection string format

### Data Issues:
- Check for foreign key constraints
- Verify data types match
- Test with small dataset first

### Strapi Issues:
- Clear cache: `rm -rf .cache`
- Rebuild: `npm run build`
- Check logs for specific errors

## 📞 Need Help?

If you encounter any issues:
1. Check the error logs
2. Verify your connection string
3. Test with a simple query first
4. Contact the database provider's support

---

**Remember**: Always backup your data before migrating!
