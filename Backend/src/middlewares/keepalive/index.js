'use strict';

/**
 * Keepalive middleware to prevent Render from sleeping
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Add a simple ping endpoint that doesn't require authentication
    if (ctx.path === '/api/ping' && ctx.method === 'GET') {
      ctx.body = {
        status: 'ok',
        message: 'Server is awake!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        },
      };
      ctx.status = 200;
      return;
    }

    // Add a keepalive endpoint for external services
    if (ctx.path === '/api/keepalive' && ctx.method === 'GET') {
      ctx.body = {
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV,
      };
      ctx.status = 200;
      return;
    }

    await next();
  };
};
