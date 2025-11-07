import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),{
      name: 'copy-redirects',
      buildEnd() {
        copyFileSync('public/_redirects', 'dist/_redirects')
      }}, tailwindcss()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'redux';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
