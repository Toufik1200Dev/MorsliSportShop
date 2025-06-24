'use strict';

module.exports = async ({ strapi }) => {
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
}; 