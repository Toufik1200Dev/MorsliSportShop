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
          chunk_size: 6000000, // 6MB chunks
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
          eager: 'w_400,h_300,c_fill',
          eager_async: true,
        },
        delete: {
          timeout: 60000, // 60 seconds for deletes
        },
      },
    },
  },
  // ...
});