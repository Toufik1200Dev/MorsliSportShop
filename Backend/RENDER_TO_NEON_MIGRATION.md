# Render to Neon Database Migration Guide

## 🎯 Complete Switch from Render PostgreSQL to Neon

This guide will help you switch your Render deployment from Render's PostgreSQL to Neon database.

## 📋 Step-by-Step Migration

### Step 1: Update Render Environment Variables

Go to your **Render Dashboard** → **Your App** → **Environment** and update these variables:

#### ❌ Remove Old Database Variables:
```
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
```

#### ✅ Add New Neon Database Variables:
```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-misty-cell-adec1wqm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_CONNECTION_TIMEOUT=60000
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

### Step 2: Keep Your Existing Variables

Make sure these are still set in Render:

```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=your-existing-app-keys
API_TOKEN_SALT=your-existing-api-token-salt
ADMIN_JWT_SECRET=your-existing-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-existing-transfer-token-salt
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=strapi-uploads
PUBLIC_URL=https://your-render-app-url.onrender.com
PROXY=false
DATABASE_DEBUG=false
```

### Step 3: Data Migration (If You Have Existing Data)

If you have data in your current Render PostgreSQL database, migrate it:

#### Option A: Using pg_dump (Recommended)
```bash
# Export from Render PostgreSQL
pg_dump "postgresql://old-render-connection-string" > backup.sql

# Import to Neon
psql "postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-misty-cell-adec1wqm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" < backup.sql
```

#### Option B: Using the Migration Script
```bash
# Set environment variables
export OLD_DATABASE_URL="your-old-render-database-url"
export NEW_DATABASE_URL="postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-misty-cell-adec1wqm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Run migration
node scripts/migrate-database.js
```

### Step 4: Deploy to Render

1. **Save Environment Variables** in Render dashboard
2. **Trigger a new deployment** (or push to your connected Git repository)
3. **Monitor the deployment logs** for any errors

### Step 5: Verify the Switch

1. **Check your app URL** - it should load normally
2. **Test admin panel** - login should work
3. **Verify data** - check if your content is there
4. **Test API endpoints** - make sure they respond correctly

## 🔧 Configuration Changes Made

### Database Configuration
- **Old**: Individual host, port, username, password variables
- **New**: Single `DATABASE_URL` connection string
- **SSL**: Properly configured for Neon's requirements

### Connection Pooling
- **Min connections**: 2
- **Max connections**: 10
- **Timeout**: 60 seconds

## 🎉 Benefits of the Switch

### Neon vs Render PostgreSQL:
- **Storage**: 3GB (Neon) vs 1GB (Render)
- **Bandwidth**: 10GB/month (Neon) vs Limited (Render)
- **Persistence**: Permanent (Neon) vs Temporary (Render)
- **Features**: Serverless scaling (Neon) vs Fixed (Render)

## 🆘 Troubleshooting

### If Deployment Fails:
1. **Check logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Test connection** locally first
4. **Check SSL settings**

### If Data is Missing:
1. **Verify migration** completed successfully
2. **Check database permissions**
3. **Test connection** to Neon database
4. **Re-run migration** if needed

### If App Won't Start:
1. **Check DATABASE_URL** format
2. **Verify SSL settings**
3. **Check connection timeout**
4. **Review error logs**

## 📊 Monitoring

### Neon Dashboard:
- Visit [neon.tech](https://neon.tech) to monitor:
  - Database usage
  - Connection count
  - Query performance
  - Storage usage

### Render Dashboard:
- Monitor app health
- Check deployment status
- Review application logs

## 🔄 Rollback Plan

If something goes wrong:

1. **Revert environment variables** to old Render PostgreSQL
2. **Redeploy** your application
3. **Fix issues** and try again

## ✅ Final Checklist

- [ ] Updated Render environment variables
- [ ] Migrated data (if needed)
- [ ] Deployed to Render
- [ ] Tested application functionality
- [ ] Verified admin panel works
- [ ] Checked API endpoints
- [ ] Monitored database usage

---

**Your database is now permanent and free! 🎉**
