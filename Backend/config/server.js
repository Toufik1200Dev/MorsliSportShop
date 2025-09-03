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
      requestTimeout: 120000, // 2 minutes
      headersTimeout: 125000, // 2 minutes 5 seconds
      keepAliveTimeout: 5000,
      maxKeepAliveRequests: 100,
    },
  },
  // Add proxy settings for production
  proxy: env.bool('PROXY', false),
  url: env('PUBLIC_URL', `http://${env('HOST', '0.0.0.0')}:${env.int('PORT', 1337)}`),
});
