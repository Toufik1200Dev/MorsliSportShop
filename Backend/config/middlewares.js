module.exports = [
  'strapi::logger',
  'strapi::errors',
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
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '10mb',
      formidable: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFields: 1000,
        maxFieldsSize: 20 * 1024 * 1024, // 20MB
      },
    },
  },
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
