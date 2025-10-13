# Render Keepalive Guide - Keep Your Strapi App Awake

## The Problem
Render's free tier puts apps to sleep after **15 minutes of inactivity**. When your app sleeps, it takes time to wake up (cold start), causing delays for your users.

## Solutions Implemented

### 1. Health Check Endpoints ✅
Your app now has these endpoints:
- `GET /api/health` - Detailed health check with server metrics
- `GET /api/ping` - Simple ping endpoint
- `GET /api/keepalive` - Keepalive endpoint for external services

### 2. External Keepalive Services (Choose One)

#### Option A: UptimeRobot (Recommended - Free)
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Click "Add New Monitor"
4. Choose "HTTP(s)" monitor type
5. Set these values:
   - **Friendly Name**: `Strapi Keepalive`
   - **URL**: `https://your-render-app-url.onrender.com/api/ping`
   - **Monitoring Interval**: `5 minutes`
   - **Timeout**: `30 seconds`
6. Click "Create Monitor"

#### Option B: Pingdom
1. Go to [Pingdom.com](https://www.pingdom.com)
2. Create free account
3. Add new check:
   - **URL**: `https://your-render-app-url.onrender.com/api/ping`
   - **Check Interval**: `5 minutes`

#### Option C: Freshping
1. Go to [Freshping.io](https://www.freshping.io)
2. Free tier allows up to 50 checks
3. Add new check:
   - **URL**: `https://your-render-app-url.onrender.com/api/ping`
   - **Interval**: `5 minutes`

### 3. Browser-Based Keepalive (Simple Solution)
Open this URL in a browser tab and keep it open:
```
https://your-render-app-url.onrender.com/api/ping
```

Use a browser extension like "Tab Auto Refresh" to refresh the tab every 10 minutes.

### 4. Cron Job Solution (Advanced)
If you have access to a server, set up a cron job:
```bash
# Run every 10 minutes
*/10 * * * * curl -s https://your-render-app-url.onrender.com/api/ping > /dev/null
```

## Testing Your Keepalive

### Test the endpoints:
```bash
# Test ping endpoint
curl https://your-render-app-url.onrender.com/api/ping

# Test health endpoint
curl https://your-render-app-url.onrender.com/api/health

# Test keepalive endpoint
curl https://your-render-app-url.onrender.com/api/keepalive
```

### Expected Response:
```json
{
  "status": "ok",
  "message": "Server is awake!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "used": "45 MB",
    "total": "128 MB"
  }
}
```

## Render Dashboard Settings

### Environment Variables to Add:
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

### Auto-Deploy Settings:
- Enable "Auto-Deploy" from main branch
- Set "Deploy Hook" for manual deployments

## Monitoring Your App

### Check if your app is awake:
1. Visit your app URL: `https://your-render-app-url.onrender.com/api/ping`
2. If it responds quickly (< 2 seconds), your app is awake
3. If it takes 30+ seconds, your app was sleeping and just woke up

### Render Dashboard:
- Go to your Render dashboard
- Check the "Logs" section to see activity
- Look for regular ping requests

## Troubleshooting

### If your app still sleeps:
1. **Check the URL**: Make sure you're using the correct Render URL
2. **Check the endpoint**: Verify `/api/ping` is accessible
3. **Check intervals**: Make sure your monitoring service is checking every 5-10 minutes
4. **Check logs**: Look at Render logs for any errors

### Common Issues:
- **404 Error**: The endpoint might not be deployed yet
- **Timeout**: Your app might be sleeping when the check runs
- **CORS Issues**: Some monitoring services might have CORS restrictions

## Upgrading to Paid Plan (Alternative)

If you need guaranteed uptime, consider upgrading to Render's **Starter Plan** ($7/month):
- Apps never sleep
- Better performance
- More resources
- Priority support

## Cost-Effective Solutions Ranking

1. **UptimeRobot** (Free) - Most reliable, 5-minute intervals
2. **Browser tab with auto-refresh** (Free) - Simple but requires keeping browser open
3. **Cron job** (Free if you have a server) - Most technical
4. **Render Starter Plan** ($7/month) - Guaranteed no sleep

## Additional Tips

### Optimize for faster cold starts:
1. **Reduce dependencies**: Remove unused packages
2. **Optimize database queries**: Use connection pooling
3. **Enable caching**: Use Redis or similar
4. **Compress responses**: Enable gzip compression

### Monitor performance:
```bash
# Check response time
curl -w "@curl-format.txt" -o /dev/null -s "https://your-app.onrender.com/api/ping"

# Create curl-format.txt:
#     time_namelookup:  %{time_namelookup}\n
#        time_connect:  %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#    time_pretransfer:  %{time_pretransfer}\n
#       time_redirect:  %{time_redirect}\n
#  time_starttransfer:  %{time_starttransfer}\n
#                     ----------\n
#          time_total:  %{time_total}\n
```

## Success Indicators

✅ Your app responds to `/api/ping` in under 2 seconds consistently  
✅ You see regular ping requests in your Render logs  
✅ Your frontend loads data quickly without timeouts  
✅ No more "service unavailable" errors from your frontend  

---

**Recommended Setup**: Use UptimeRobot with 5-minute intervals for the best free solution!
