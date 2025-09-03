'use strict';

/**
 * Upload error handler middleware
 * Handles upload-related errors and provides better error responses
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      // Handle Cloudinary timeout errors
      if (error.message && error.message.includes('Request Timeout')) {
        strapi.log.error('Cloudinary upload timeout:', error);
        
        ctx.status = 408; // Request Timeout
        ctx.body = {
          error: {
            status: 408,
            name: 'RequestTimeout',
            message: 'Upload request timed out. Please try again with smaller files or fewer files at once.',
            details: {
              suggestion: 'Try uploading files one at a time or reduce file sizes'
            }
          }
        };
        return;
      }

      // Handle JSON parsing errors
      if (error.message && error.message.includes('Unexpected end of JSON input')) {
        strapi.log.error('JSON parsing error:', error);
        
        ctx.status = 400; // Bad Request
        ctx.body = {
          error: {
            status: 400,
            name: 'JSONParseError',
            message: 'Invalid JSON data received. Please check your request format.',
            details: {
              suggestion: 'Ensure your request contains valid JSON data'
            }
          }
        };
        return;
      }

      // Handle file size errors
      if (error.message && error.message.includes('File too large')) {
        strapi.log.error('File size error:', error);
        
        ctx.status = 413; // Payload Too Large
        ctx.body = {
          error: {
            status: 413,
            name: 'FileTooLarge',
            message: 'File size exceeds the maximum allowed limit.',
            details: {
              suggestion: 'Please reduce file size or upload files individually'
            }
          }
        };
        return;
      }

      // Handle Cloudinary errors
      if (error.message && error.message.includes('cloudinary')) {
        strapi.log.error('Cloudinary error:', error);
        
        ctx.status = 502; // Bad Gateway
        ctx.body = {
          error: {
            status: 502,
            name: 'CloudinaryError',
            message: 'Upload service temporarily unavailable. Please try again later.',
            details: {
              suggestion: 'Wait a moment and try uploading again'
            }
          }
        };
        return;
      }

      // Re-throw other errors
      throw error;
    }
  };
};
