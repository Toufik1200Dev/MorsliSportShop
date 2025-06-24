module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/order-submission',
      handler: 'order-submission.submit',
      config: {
        auth: false,
      },
    },
  ],
}; 