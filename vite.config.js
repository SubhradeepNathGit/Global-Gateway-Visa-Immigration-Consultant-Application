import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor_mui';
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('gsap')) return 'vendor_gsap';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor_charts';
            if (id.includes('supabase')) return 'vendor_supabase';
            if (id.includes('swiper')) return 'vendor_swiper';
            if (id.includes('lottie')) return 'vendor_lottie';
            return 'vendor';
          }
        }
      }
    }
  }
})
