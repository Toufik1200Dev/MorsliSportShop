'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
    // No customizations, just returning the default controller behavior.
    // This ensures that any potential default transforms are correctly applied.
}));
