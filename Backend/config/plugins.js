module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        secure: true,
        timeout: 60000, // 60 seconds timeout
        chunk_size: 6000000, // 6MB chunks
      },
      actionOptions: {
        upload: {
          folder: env('CLOUDINARY_FOLDER', 'strapi-uploads'),
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        delete: {},
      },
    },
  },
  // ...
});