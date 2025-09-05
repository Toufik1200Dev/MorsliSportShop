module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to upload routes
    if (ctx.path.includes('/api/upload') || ctx.path.includes('/upload')) {
      // Set a longer timeout for upload requests
      const originalTimeout = ctx.req.timeout;
      ctx.req.timeout = 120000; // 2 minutes
      
      // Add retry logic for Cloudinary timeouts
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await next();
          break; // Success, exit retry loop
        } catch (error) {
          if (error.message && error.message.includes('Request Timeout') && retryCount < maxRetries - 1) {
            retryCount++;
            strapi.log.warn(`Cloudinary upload timeout, retry ${retryCount}/${maxRetries}`);
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
            continue;
          }
          throw error; // Re-throw if not a timeout or max retries reached
        }
      }
    } else {
      await next();
    }
  };
};
