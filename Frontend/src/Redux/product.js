/**
 * @typedef {{ VITE_BASE_URL?: string }} ImportMetaEnv
 * @typedef {{ env: ImportMetaEnv }} ImportMeta
 */

// @ts-ignore
const API_URL = "https://morsli-sport-shop.onrender.com";
console.log('RTK Query base URL:', API_URL);

// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  // @ts-ignore
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/` }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products?populate=*`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery } = productApi