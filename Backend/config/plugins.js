module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
        secure: true,
        cdn_subdomain: true,
      },
      actionOptions: {
        upload: {
          timeout: 120000, // 120 seconds for uploads
          chunk_size: 2000000, // 2MB chunks (smaller for better memory management)
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
          eager: 'w_400,h_300,c_fill',
          eager_async: true,
          // Add memory optimization
          transformation: [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' }
          ],
        },
        delete: {
          timeout: 60000, // 60 seconds for deletes
        },
      },
      // Add size limits and validation
      sizeLimit: 10 * 1024 * 1024, // 10MB per file
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
    },
  },
  // ...
});