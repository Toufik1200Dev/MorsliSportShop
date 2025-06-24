'use strict';
const sheetsService = require('../services/google-sheets');

module.exports = {
  async submit(ctx) {
    const { orderDetails, cartItems } = ctx.request.body;

    if (!orderDetails || !cartItems || !Array.isArray(cartItems)) {
      return ctx.badRequest('Invalid order data submitted.');
    }

    try {
      const { fullName, phone, wilaya, baladiya, deliveryType, deliveryPrice } = orderDetails;
      // Get current date and time with hours, minutes, seconds
      const now = new Date();
      const orderDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const orderTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
      const orderDateTime = `${orderDate} ${orderTime}`; // YYYY-MM-DD HH:MM:SS

      // Format delivery type for sheet
      const livraison = deliveryType === 'domicile' ? 'a domicile' : 'bureau';

      for (const item of cartItems) {
        const totalPrice = (parseInt(item.Product_price) * item.quantity) + deliveryPrice;
        const rowData = [
          item.Product_name, // Produit
          fullName,         // nom et prenom
          item.quantity,    // quantité
          item.selectedSize || '', // la taille
          phone,            // numero de telephone
          wilaya,           // wilaya
          baladiya,         // baladiya
          orderDateTime,    // la date
          item.Product_category || 'N/A', // category
          livraison,        // livraison
          totalPrice        // total price (product total + delivery)
        ];
        console.log('Appending row to Google Sheets:', rowData);
        await sheetsService.appendRow(rowData);
      }

      return ctx.send({
        message: 'Order successfully submitted to Google Sheet.',
      });

    } catch (error) {
      console.error('Order submission error:', error);
      return ctx.internalServerError('Failed to process order.');
    }
  },

  // Default Strapi controller methods
  async find(ctx) {
    return ctx.badRequest('Method not allowed');
  },

  async findOne(ctx) {
    return ctx.badRequest('Method not allowed');
  },

  async create(ctx) {
    return this.submit(ctx);
  },

  async update(ctx) {
    return ctx.badRequest('Method not allowed');
  },

  async delete(ctx) {
    return ctx.badRequest('Method not allowed');
  }
}; 