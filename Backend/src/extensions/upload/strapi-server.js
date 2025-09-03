'use strict';

/**
 * Upload service extension
 * Adds retry logic for Cloudinary uploads
 */

module.exports = (plugin) => {
  // Store the original upload service
  const originalUpload = plugin.services.upload;
  
  // Override the upload service with retry logic
  plugin.services.upload = ({ strapi }) => {
    const service = originalUpload({ strapi });
    
    return {
      ...service,
      
      async upload(files, options = {}) {
        try {
          return await service.upload(files, options);
        } catch (error) {
          // Add retry logic for timeout errors
          if (error.message && error.message.includes('Request Timeout')) {
            strapi.log.warn('Upload timeout, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await service.upload(files, options);
          }
          throw error;
        }
      }
    };
  };
  
  return plugin;
};
