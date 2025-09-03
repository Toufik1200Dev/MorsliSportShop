'use strict';

module.exports = async ({ strapi }) => {
  // Add error handling for server startup
  try {
    // Set up public permissions for products
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissions = {
        ...publicRole.permissions,
        'api::product.product': {
          controllers: {
            product: {
              find: { enabled: true, policy: '' },
              findOne: { enabled: true, policy: '' },
            },
          },
        },
      };

      await strapi
        .query('plugin::users-permissions.role')
        .update({
          where: { id: publicRole.id },
          data: { permissions },
        });
    }

    // Add process error handlers for better crash recovery
    process.on('uncaughtException', (error) => {
      strapi.log.error('Uncaught Exception:', error);
      // Don't exit immediately, let the process handle it gracefully
    });

    process.on('unhandledRejection', (reason, promise) => {
      strapi.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit immediately, let the process handle it gracefully
    });

    // Add memory monitoring
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };
      
      if (memUsageMB.heapUsed > 400) { // Alert if heap usage > 400MB
        strapi.log.warn('High memory usage detected:', memUsageMB);
      }
    }, 30000); // Check every 30 seconds

    strapi.log.info('Bootstrap completed successfully');
  } catch (error) {
    strapi.log.error('Bootstrap error:', error);
    throw error;
  }
}; 