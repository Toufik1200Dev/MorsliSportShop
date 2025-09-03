module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  // Add session configuration for better persistence
  session: {
    enabled: true,
    client: 'cookie',
    key: 'strapi.sid',
    prefix: 'strapi:sess:',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: env('NODE_ENV') === 'production',
      maxAge: 86400000, // 24 hours
      overwrite: true,
      signed: true,
      rolling: false,
      renew: false,
    },
    ttl: 86400000, // 24 hours
  },
  // Add rate limiting for admin panel
  rateLimit: {
    interval: 60000, // 1 minute
    max: 100, // requests per interval
  },
  // Add security headers
  security: {
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'https://api.cloudinary.com'],
      },
    },
  },
});