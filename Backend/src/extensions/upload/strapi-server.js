'use strict';

/**
 * Upload service extension
 * Handles bulk uploads with better error handling and retry logic
 */

module.exports = (plugin) => {
  // Override the upload service
  plugin.services.upload = ({ strapi }) => ({
    ...plugin.services.upload({ strapi }),
    
    async upload(files, { data = {} } = {}) {
      const { fileInfo = {} } = data;
      
      // Handle single file upload
      if (!Array.isArray(files)) {
        return this.uploadSingleFile(files, fileInfo);
      }
      
      // Handle multiple files upload with better error handling
      const results = [];
      const errors = [];
      
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          const result = await this.uploadSingleFile(file, fileInfo);
          results.push(result);
        } catch (error) {
          strapi.log.error(`Error uploading file ${i + 1}:`, error);
          errors.push({
            index: i,
            error: error.message,
            filename: files[i]?.name || 'unknown'
          });
        }
      }
      
      // If all uploads failed, throw an error
      if (results.length === 0 && errors.length > 0) {
        const error = new Error('All file uploads failed');
        error.details = errors;
        throw error;
      }
      
      // If some uploads failed, log warnings but return successful ones
      if (errors.length > 0) {
        strapi.log.warn(`${errors.length} files failed to upload:`, errors);
      }
      
      return results;
    },
    
    async uploadSingleFile(file, fileInfo = {}) {
      try {
        // Add retry logic for Cloudinary uploads
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          try {
            const result = await plugin.services.upload({ strapi }).upload([file], { data: { fileInfo } });
            return result[0];
          } catch (error) {
            attempts++;
            
            if (error.message.includes('Request Timeout') && attempts < maxAttempts) {
              strapi.log.warn(`Upload attempt ${attempts} failed, retrying...`);
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
              continue;
            }
            
            throw error;
          }
        }
      } catch (error) {
        strapi.log.error('Single file upload failed:', error);
        throw error;
      }
    }
  });
  
  return plugin;
};
