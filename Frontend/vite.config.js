import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    // Maximum optimization for production
    minify: 'esbuild', // Fast and efficient
    target: 'es2020', // More modern target for better compatibility
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps to reduce size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep all React-related code together to prevent loading order issues
          if (id.includes('node_modules')) {
            // All React code in one chunk to ensure proper loading order
            if (id.includes('react') || id.includes('use-sync-external-store')) {
              return 'vendor-react';
            }
            // MUI and Emotion together
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-mui';
            }
            // Redux (but not react-redux, it's in vendor-react)
            if (id.includes('@reduxjs/toolkit') || (id.includes('redux') && !id.includes('react-redux'))) {
              return 'vendor-redux';
            }
            return 'vendor-other';
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline small assets (< 4KB)
    reportCompressedSize: false, // Faster builds
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'prop-types',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
    exclude: [],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      // Handle CommonJS modules
      mainFields: ['module', 'main'],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'prop-types'],
    alias: {
      // Ensure prop-types is resolved correctly
      'prop-types': 'prop-types',
      // Ensure React is always resolved to the same instance
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
})
