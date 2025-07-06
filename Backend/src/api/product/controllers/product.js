'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
    // No customizations, just returning the default controller behavior.
    // This ensures that any potential default transforms are correctly applied.
    async findOne(ctx) {
        const { id } = ctx.params;
        
        const entity = await strapi.entityService.findOne('api::product.product', id, {
            populate: ['Product_img'],
        });
        
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        
        return this.transformResponse(sanitizedEntity);
    },
}));
