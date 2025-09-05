# Neon GitHub Integration Guide

## 🔗 Connecting Your Repository to Neon

This guide shows you how to connect your GitHub repository to Neon for seamless database management.

## 📋 Step 1: GitHub Repository Setup

### 1.1 Repository Structure
Your current repository structure:
```
e-commerce/
├── Backend/
│   ├── config/
│   │   ├── database.js
│   │   └── middlewares.js
│   ├── scripts/
│   │   ├── migrate-database.js
│   │   └── test-neon-config.js
│   └── package.json
└── Frontend/
    └── ...
```

### 1.2 Repository Selection
In Neon dashboard, you can connect:
- **Repository**: `fullMERN-ecommerce` or `e-commerce`
- **Branch**: `main` (or your primary branch)
- **Path**: `Backend/` (where your Strapi app is located)

## 🔧 Step 2: Neon Dashboard Configuration

### 2.1 Access Integration Settings
1. Go to [neon.tech](https://neon.tech)
2. Sign in to your account
3. Select your project: **neondb**
4. Go to **Settings** → **Integrations**

### 2.2 Connect GitHub
1. Click **"Connect GitHub"**
2. Authorize Neon to access your repositories
3. Select your repository: `e-commerce` or `fullMERN-ecommerce`
4. Choose the branch: `main`

### 2.3 Configure Repository Settings
1. **Database Path**: `Backend/`
2. **Environment File**: `.env` (if you create one)
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`

## 🛠️ Step 3: Environment Variables Management

### 3.1 Neon Environment Variables
In Neon dashboard, go to **Settings** → **Environment Variables** and add:

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://neondb_owner:npg_1vLK2jlJEfFD@ep-muddy-mud-adlz7y69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# App Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Strapi Security Keys (Generate new ones)
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
CLOUDINARY_FOLDER=strapi-uploads

# Public URL
PUBLIC_URL=https://your-render-app-url.onrender.com

# Security
PROXY=false
DATABASE_DEBUG=false
```

### 3.2 Generate Security Keys
Run these commands to generate secure keys:

```bash
# In your Backend directory
node -e "console.log('APP_KEYS=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 Step 4: Deployment Configuration

### 4.1 Neon Deployment (Optional)
If you want to deploy directly from Neon:

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Node Version**: `18.x` or `20.x`
4. **Port**: `1337`

### 4.2 Render Deployment (Recommended)
Keep using Render for your main deployment:

1. **Repository**: Connect your GitHub repo to Render
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Use the ones from Neon

## 📊 Step 5: Database Schema Management

### 5.1 Schema Versioning
1. Go to **Dashboard** → **SQL Editor**
2. Create migration files in your repository
3. Track schema changes with Git
4. Deploy schema updates automatically

### 5.2 Database Migrations
Your migration script is ready:
```bash
# Run migrations
node scripts/migrate-database.js
```

### 5.3 Schema Backup
1. Go to **Settings** → **Backups**
2. **Automatic backups** are enabled
3. **Manual backup** before major changes
4. **Point-in-time recovery** available

## 🔐 Step 6: Security Configuration

### 6.1 Repository Access
1. **Public Repository**: Anyone can see your code
2. **Private Repository**: Only you can access
3. **Database Access**: Controlled by Neon credentials

### 6.2 Environment Variables Security
- **Never commit** `.env` files to Git
- **Use Neon dashboard** for environment variables
- **Rotate keys** regularly
- **Monitor access** logs

## 📈 Step 7: Monitoring and Analytics

### 7.1 Repository Integration
1. **Commit History**: Track database changes
2. **Deployment Logs**: Monitor deployments
3. **Error Tracking**: Debug issues
4. **Performance Metrics**: Optimize queries

### 7.2 Database Monitoring
1. **Connection Count**: Real-time monitoring
2. **Query Performance**: Slow query detection
3. **Storage Usage**: Track database growth
4. **Bandwidth Usage**: Monitor data transfer

## 🆘 Step 8: Troubleshooting

### 8.1 Repository Connection Issues
- **Check GitHub permissions**
- **Verify repository access**
- **Test connection** in Neon dashboard
- **Review error logs**

### 8.2 Deployment Issues
- **Check build logs**
- **Verify environment variables**
- **Test locally** first
- **Review deployment configuration**

### 8.3 Database Connection Issues
- **Test connection string**
- **Check SSL settings**
- **Verify credentials**
- **Monitor connection logs**

## ✅ Step 9: Final Checklist

- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Security keys generated
- [ ] Database connection tested
- [ ] Deployment configuration ready
- [ ] Monitoring enabled
- [ ] Backup settings verified
- [ ] Documentation updated

## 🎉 Benefits of GitHub Integration

### Repository Integration:
- **✅ Version Control** - Track all database changes
- **✅ Automated Deployments** - Deploy from Git commits
- **✅ Collaboration** - Team members can contribute
- **✅ Rollback** - Easy to revert changes
- **✅ Documentation** - Keep everything in sync

### Database Management:
- **✅ Schema Versioning** - Track database evolution
- **✅ Migration Scripts** - Automated database updates
- **✅ Environment Sync** - Consistent configurations
- **✅ Security** - Centralized access control

---

## 🚀 Next Steps

1. **Connect your repository** to Neon
2. **Configure environment variables**
3. **Deploy to Render** with new database
4. **Monitor performance** and usage
5. **Enjoy your permanent free database!**

Your database is now fully integrated with your repository and ready for production! 🎉
