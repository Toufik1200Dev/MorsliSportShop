module.exports = (config, { strapi }) => {
  const uploadCounts = new Map();
  const UPLOAD_LIMIT = 20; // Max 20 uploads per minute per IP
  const WINDOW_MS = 60000; // 1 minute window

  return async (ctx, next) => {
    // Only apply to upload routes
    if (ctx.path.includes('/api/upload') || ctx.path.includes('/upload')) {
      const clientIP = ctx.request.ip || ctx.request.connection.remoteAddress;
      const now = Date.now();
      
      // Clean old entries
      for (const [ip, data] of uploadCounts.entries()) {
        if (now - data.timestamp > WINDOW_MS) {
          uploadCounts.delete(ip);
        }
      }
      
      // Check current upload count for this IP
      const currentData = uploadCounts.get(clientIP) || { count: 0, timestamp: now };
      
      if (now - currentData.timestamp > WINDOW_MS) {
        // Reset window
        currentData.count = 0;
        currentData.timestamp = now;
      }
      
      // Check if limit exceeded
      if (currentData.count >= UPLOAD_LIMIT) {
        strapi.log.warn(`Upload rate limit exceeded for IP: ${clientIP}`);
        ctx.status = 429;
        ctx.body = {
          error: 'Too many upload requests',
          message: 'Please wait before uploading more files',
          retryAfter: Math.ceil((WINDOW_MS - (now - currentData.timestamp)) / 1000)
        };
        return;
      }
      
      // Increment counter
      currentData.count++;
      uploadCounts.set(clientIP, currentData);
      
      strapi.log.info(`Upload request from ${clientIP}: ${currentData.count}/${UPLOAD_LIMIT}`);
    }
    
    await next();
  };
};
