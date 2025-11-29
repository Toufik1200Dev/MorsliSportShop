// Backend API-based product service using RTK Query
import { createApi } from '@reduxjs/toolkit/query/react';
import { getProducts as fetchProducts } from '../api/products';

// Define a service using backend API
export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ['Products'],
  baseQuery: async (args) => {
    try {
      const data = await fetchProducts();
      return { data };
    } catch (error) {
      return { error: { status: 'CUSTOM_ERROR', error: error.message } };
    }
  },
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: async (page = 1, pageSize = 100) => {
        try {
          const products = await fetchProducts();
          
          // Ensure products is always an array
          if (!Array.isArray(products)) {
            console.warn('Products is not an array:', products);
            return { data: [] };
          }
          
          // Transform API products to match expected format - only include necessary fields
          const transformedProducts = products.map(product => ({
            id: product._id || product.id,
            attributes: {
              Product_name: product.Product_name,
              Product_price: product.Product_price,
              // Only include first image URL to reduce data size
              Product_img: product.Product_img?.slice(0, 1).map((url) => ({
                url: typeof url === 'string' ? url : url?.url || url,
                formats: {
                  medium: { url: typeof url === 'string' ? url : url?.url || url },
                  small: { url: typeof url === 'string' ? url : url?.url || url },
                  thumbnail: { url: typeof url === 'string' ? url : url?.url || url }
                }
              })) || [],
              Product_category: product.Product_category,
              // Remove sizes and colors from initial load to reduce data
              Product_sizes: [],
              Product_color: [],
            }
          }));
          return { data: transformedProducts };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Products'],
      // Disable automatic refetching to save bandwidth
      refetchOnFocus: false,
      refetchOnReconnect: false,
      // Keep data in cache longer to reduce API calls
      keepUnusedDataFor: 600, // 10 minutes - reduces bandwidth significantly
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetProductsQuery } = productApi;