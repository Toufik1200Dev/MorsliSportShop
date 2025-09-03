module.exports = {
  rest: {
    defaultLimit: 25,       // Allow more products by default
    maxLimit: 100,         // Allow up to 100 products per request
    withCount: true,       // Enable count queries for pagination
  },
};
