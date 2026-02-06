import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into separate chunk
          'firebase-app': ['firebase/app'],
          'firebase-analytics': ['firebase/analytics'],
          'firebase-firestore': ['firebase/firestore'],
          // Split React vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    // Enable better minification
    minify: 'esbuild',
    // Reduce chunk size warning
    chunkSizeWarningLimit: 600,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
