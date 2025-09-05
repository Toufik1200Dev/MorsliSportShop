module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      strapi.log.error('Global error handler:', error);
      
      // Ensure we always return JSON for API requests
      if (ctx.path.startsWith('/api/') || ctx.path.includes('/upload')) {
        ctx.status = error.status || 500;
        ctx.type = 'application/json';
        ctx.body = {
          error: {
            message: error.message || 'Internal Server Error',
            status: ctx.status,
            timestamp: new Date().toISOString(),
            path: ctx.path
          }
        };
      } else {
        // For non-API requests, let Strapi handle the error
        throw error;
      }
    }
  };
};
