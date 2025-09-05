module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
        timeout: 60000, // 60 seconds timeout
        secure: true,
        cdn_subdomain: true,
      },
      actionOptions: {
        upload: {
          timeout: 60000, // 60 seconds for uploads
          chunk_size: 6000000, // 6MB chunks
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        delete: {
          timeout: 30000, // 30 seconds for deletes
        },
      },
    },
  },
  // ...
});