'use strict';

/**
 * health controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::health.health', ({ strapi }) => ({
  async find(ctx) {
    try {
      // Simple health check that returns server status
      const healthData = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
      };

      ctx.body = {
        data: healthData,
        meta: {
          message: 'Server is healthy and running',
        },
      };
    } catch (error) {
      ctx.body = {
        data: null,
        error: {
          message: 'Health check failed',
          details: error.message,
        },
      };
      ctx.status = 500;
    }
  },
}));
