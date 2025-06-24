// @ts-ignore
console.log('RTK Query base URL:', "http://localhost:1337");

// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  // @ts-ignore
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:1337/api/` }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `products?populate=*`,
    }),
    getCategories: builder.query({
      query: () => `categories`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProductsQuery, useGetCategoriesQuery } = productApi