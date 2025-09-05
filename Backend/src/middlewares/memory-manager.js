module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to upload routes
    if (ctx.path.includes('/api/upload') || ctx.path.includes('/upload')) {
      // Check memory usage before processing
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      
      strapi.log.info(`Memory usage before upload: ${memUsageMB}MB`);
      
      // If memory usage is too high, reject the request
      if (memUsageMB > 400) { // 400MB threshold
        strapi.log.warn(`High memory usage detected: ${memUsageMB}MB. Rejecting upload request.`);
        ctx.status = 503;
        ctx.type = 'application/json';
        ctx.body = {
          error: {
            message: 'Server is under high load. Please try again in a few minutes.',
            status: 503,
            memoryUsage: memUsageMB
          }
        };
        return;
      }
      
      try {
        await next();
      } finally {
        // Force garbage collection after upload
        if (global.gc) {
          global.gc();
        }
        
        // Log memory usage after processing
        const memUsageAfter = process.memoryUsage();
        const memUsageAfterMB = Math.round(memUsageAfter.heapUsed / 1024 / 1024);
        strapi.log.info(`Memory usage after upload: ${memUsageAfterMB}MB`);
      }
    } else {
      await next();
    }
  };
};
