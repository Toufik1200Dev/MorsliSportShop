import apiCall from './config.js';

// Get all products
export const getProducts = async () => {
  try {
    const response = await apiCall('/products');
    
    // Handle different response formats
    let products = [];
    
    // If response is an array, use it directly
    if (Array.isArray(response)) {
      products = response;
    } 
    // If response has a data property that's an array (backend format: { success: true, data: [...] })
    else if (response && Array.isArray(response.data)) {
      products = response.data;
    }
    // If response is an object with products array
    else if (response && response.products && Array.isArray(response.products)) {
      products = response.products;
    }
    // If response is undefined, null, or empty, return empty array
    else if (!response) {
      return [];
    }
    // If it's something else unexpected, log and return empty
    else {
      console.warn('Unexpected products response format:', response);
      return [];
    }
    
    // Ensure products is an array before mapping
    if (!Array.isArray(products)) {
      console.warn('Products is not an array:', products);
      return [];
    }
    
    // Normalize MongoDB _id to id for compatibility
    return products.map(product => ({
      ...product,
      id: product._id || product.id,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array on error instead of throwing
    return [];
  }
};

// Get single product
export const getProduct = async (productId) => {
  const product = await apiCall(`/products/${productId}`);
  // Normalize MongoDB _id to id for compatibility
  return {
    ...product,
    id: product._id || product.id,
  };
};

// Create product (admin only)
export const createProduct = async (productData) => {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  
  // Add text fields
  formData.append('Product_name', productData.Product_name || '');
  formData.append('Product_desctiption', productData.Product_desctiption || '');
  formData.append('Product_price', productData.Product_price || 0);
  formData.append('Product_category', productData.Product_category || 'Gym');
  formData.append('stock', productData.stock || 0);
  
  // Add arrays as JSON strings
  if (productData.Product_sizes && Array.isArray(productData.Product_sizes)) {
    formData.append('Product_sizes', JSON.stringify(productData.Product_sizes));
  }
  if (productData.Product_color && Array.isArray(productData.Product_color)) {
    formData.append('Product_color', JSON.stringify(productData.Product_color));
  }
  
  // Add image files
  if (productData.images && productData.images.length > 0) {
    for (const image of productData.images) {
      if (image instanceof File) {
        formData.append('images', image);
      }
    }
  }

  // Use custom fetch for FormData (don't set Content-Type, browser will set it with boundary)
  const token = localStorage.getItem('authToken');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const url = `${API_BASE_URL}/products`;
  
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data.data !== undefined ? data.data : data;
};

// Update product (admin only)
export const updateProduct = async (productId, productData) => {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();
  
  // Add text fields
  formData.append('Product_name', productData.Product_name || '');
  formData.append('Product_desctiption', productData.Product_desctiption || '');
  formData.append('Product_price', productData.Product_price || 0);
  formData.append('Product_category', productData.Product_category || 'Gym');
  formData.append('stock', productData.stock || 0);
  
  // Add arrays as JSON strings
  if (productData.Product_sizes && Array.isArray(productData.Product_sizes)) {
    formData.append('Product_sizes', JSON.stringify(productData.Product_sizes));
  }
  if (productData.Product_color && Array.isArray(productData.Product_color)) {
    formData.append('Product_color', JSON.stringify(productData.Product_color));
  }
  
  // Handle existing images (URLs)
  if (productData.existingImages && Array.isArray(productData.existingImages)) {
    formData.append('existingImages', JSON.stringify(productData.existingImages));
  }
  
  // Add new image files
  if (productData.newImages && productData.newImages.length > 0) {
    for (const image of productData.newImages) {
      if (image instanceof File) {
        formData.append('images', image);
      }
    }
  }
  
  // Handle removed images
  if (productData.removedImages && Array.isArray(productData.removedImages)) {
    formData.append('removedImages', JSON.stringify(productData.removedImages));
  }

  // Use custom fetch for FormData (don't set Content-Type, browser will set it with boundary)
  const token = localStorage.getItem('authToken');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const url = `${API_BASE_URL}/products/${productId}`;
  
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data.data !== undefined ? data.data : data;
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
  await apiCall(`/products/${productId}`, {
    method: 'DELETE',
  });
  return true;
};

// Upload product image (now handled by Cloudinary on backend)
// This function is kept for backward compatibility but images are uploaded via FormData
export const uploadProductImage = async (file) => {
  // Return a temporary URL for preview purposes
  // Actual upload happens when creating/updating product via FormData
  return URL.createObjectURL(file);
};

// Delete product image (handled by backend when product is deleted/updated)
export const deleteProductImage = async (imageUrl) => {
  // Image deletion is handled by the backend when products are updated/deleted
  return;
};


