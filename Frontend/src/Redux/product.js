/**
 * @typedef {{ VITE_BASE_URL?: string }} ImportMetaEnv
 * @typedef {{ env: ImportMetaEnv }} ImportMeta
 */

// @ts-ignore
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";

// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://morsli-sport-shop.onrender.com/api/",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (page = 1) => ({
        url: "products",
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": 8,
          "populate": "*"
        }
      }),
      transformResponse: (response) => response.data || [],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery } = productApi