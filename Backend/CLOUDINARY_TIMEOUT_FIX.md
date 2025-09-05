# Cloudinary Timeout Fix

## 🔧 Environment Variables to Add in Render

Add these environment variables to your Render dashboard to fix Cloudinary timeout issues:

```env
# Cloudinary Timeout Configuration
CLOUDINARY_UPLOAD_TIMEOUT=120000
CLOUDINARY_DELETE_TIMEOUT=60000
CLOUDINARY_CHUNK_SIZE=6000000
CLOUDINARY_MAX_RETRIES=3
```

## 🚀 What This Fix Does

### 1. **Increased Timeouts**
- **Upload timeout**: 120 seconds (was 60s)
- **Delete timeout**: 60 seconds (was 30s)
- **Chunk size**: 6MB for better handling of large files

### 2. **Retry Logic**
- **Automatic retries**: Up to 3 attempts on timeout
- **Exponential backoff**: 2s, 4s, 6s delays between retries
- **Smart error handling**: Only retries on timeout errors

### 3. **Optimized Upload Settings**
- **Auto quality**: Cloudinary optimizes images automatically
- **Auto format**: Chooses best format (WebP, AVIF, etc.)
- **Eager transformations**: Pre-generates thumbnails
- **Async processing**: Non-blocking image processing

## 📋 Steps to Apply

1. **Add environment variables** in Render dashboard
2. **Deploy the updated code** (already pushed)
3. **Test file uploads** - should work without timeouts

## 🎯 Expected Results

- ✅ **No more timeout errors**
- ✅ **Faster uploads** with chunked processing
- ✅ **Better error handling** with retries
- ✅ **Optimized images** automatically

## 🆘 If Still Having Issues

1. **Check file sizes** - keep under 10MB per file
2. **Monitor network** - ensure stable connection
3. **Check Cloudinary plan** - verify upload limits
4. **Review logs** - look for specific error patterns

---

**Your Cloudinary uploads should now work reliably! 🎉**
