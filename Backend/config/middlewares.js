module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'global::error-handler',
    config: {},
  },
  {
    name: 'global::keepalive',
    config: {},
  },
  {
    name: 'global::upload-rate-limit',
    config: {},
  },
  {
    name: 'global::cloudinary-timeout',
    config: {},
  },
  {
    name: 'global::memory-manager',
    config: {},
  },
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            'https://res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://morsli-sport.web.app', // your Firebase Hosting frontend (new)
        'https://morsli-sport-shop.web.app', // your Firebase Hosting frontend (old)
        'http://localhost:5173',             // for local development
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      key: 'strapi.sid',
      secret: process.env.APP_KEYS,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 86400000, // 24 hours
        sameSite: 'lax',
      },
      resave: false,
      saveUninitialized: false,
    },
  },
  'strapi::favicon',
  'strapi::public',
];
