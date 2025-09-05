module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Add timeout and keep-alive settings
  http: {
    serverOptions: {
      requestTimeout: 300000, // 5 minutes for bulk uploads
      headersTimeout: 290000, // 4 minutes 50 seconds
      keepAliveTimeout: 5000,
      maxKeepAliveRequests: 50, // Reduced to prevent memory issues
    },
  },
  // Add proxy settings for production
  proxy: env.bool('PROXY', false),
  url: env('PUBLIC_URL', `http://${env('HOST', '0.0.0.0')}:${env.int('PORT', 1337)}`),
});
