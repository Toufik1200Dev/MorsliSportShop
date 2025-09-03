'use strict';

/**
 * Upload controller extension
 * Handles bulk uploads with better error handling
 */

module.exports = {
  async upload(ctx) {
    try {
      const { files, data = {} } = ctx.request;
      
      if (!files) {
        return ctx.badRequest('No files provided');
      }

      // Handle single file
      if (!Array.isArray(files)) {
        const result = await strapi.plugin('upload').service('upload').upload([files], { data });
        return ctx.send(result[0]);
      }

      // Handle multiple files with progress tracking
      const results = [];
      const errors = [];
      const totalFiles = files.length;

      strapi.log.info(`Starting bulk upload of ${totalFiles} files`);

      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          strapi.log.info(`Uploading file ${i + 1}/${totalFiles}: ${file.name}`);
          
          const result = await strapi.plugin('upload').service('upload').upload([file], { data });
          results.push(result[0]);
          
          // Add small delay between uploads to prevent overwhelming Cloudinary
          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          strapi.log.error(`Error uploading file ${i + 1} (${files[i]?.name}):`, error);
          errors.push({
            index: i,
            filename: files[i]?.name || 'unknown',
            error: error.message
          });
        }
      }

      strapi.log.info(`Bulk upload completed: ${results.length} successful, ${errors.length} failed`);

      // Return results with error information
      ctx.send({
        data: results,
        meta: {
          total: totalFiles,
          successful: results.length,
          failed: errors.length,
          errors: errors
        }
      });

    } catch (error) {
      strapi.log.error('Upload controller error:', error);
      
      // Handle specific error types
      if (error.message.includes('Request Timeout')) {
        return ctx.requestTimeout('Upload request timed out. Please try again with smaller files.');
      }
      
      if (error.message.includes('File too large')) {
        return ctx.payloadTooLarge('File size exceeds the maximum allowed limit.');
      }
      
      return ctx.internalServerError('Upload failed. Please try again.');
    }
  }
};
