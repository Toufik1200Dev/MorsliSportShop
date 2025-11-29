import apiCall from './config.js';

// Get all orders (admin only)
export const getOrders = async (status = null) => {
  const endpoint = status ? `/orders?status=${status}` : '/orders';
  const orders = await apiCall(endpoint);
  
  // Ensure orders is always an array
  if (!Array.isArray(orders)) {
    console.warn('Orders is not an array:', orders);
    return [];
  }
  
  // Normalize MongoDB _id to id for compatibility and ensure it's a string
  return orders.map(order => ({
    ...order,
    id: String(order._id || order.id || ''),
  }));
};

// Get single order (admin only)
export const getOrder = async (orderId) => {
  return await apiCall(`/orders/${orderId}`);
};

// Create order
export const createOrder = async (orderData) => {
  // Validate required fields
  if (!orderData.clientName || !orderData.phone || !orderData.items || orderData.items.length === 0) {
    throw new Error('Les informations client et les articles sont requis');
  }

  const order = {
    clientName: String(orderData.clientName).trim(),
    email: String(orderData.email || '').trim(),
    phone: String(orderData.phone).trim(),
    address: String(orderData.address || '').trim(),
    city: String(orderData.city || '').trim(),
    wilaya: String(orderData.wilaya || '').trim(),
    items: Array.isArray(orderData.items) ? orderData.items : [],
    total: parseFloat(orderData.total) || 0,
    subtotal: parseFloat(orderData.subtotal) || 0,
    deliveryType: String(orderData.deliveryType || 'bureau').trim(),
    deliveryPrice: parseFloat(orderData.deliveryPrice) || 0,
  };

  return await apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, status) => {
  return await apiCall(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Delete order (admin only)
export const deleteOrder = async (orderId) => {
  await apiCall(`/orders/${orderId}`, {
    method: 'DELETE',
  });
  return true;
};

// Delete old orders (admin only)
export const deleteOldOrders = async () => {
  try {
    await apiCall('/orders/cleanup/old', {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    // Silent fail for cleanup
    return false;
  }
};

