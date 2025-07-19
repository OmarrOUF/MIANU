import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['framer-motion', 'react-icons/fa']
  },
  build: {
    // Improve asset handling
    assetsInlineLimit: 4096, // 4kb
    sourcemap: false,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('react')) {
            return 'react';
          }
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
        }
      }
    }
  },
  // Ensure proper base path for production
  base: './',
  // Add SEO-related headers
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})
