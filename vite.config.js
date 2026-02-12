import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    dedupe: ['react', 'react-dom']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor_mui';
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('gsap')) return 'vendor_gsap';
            if (id.includes('recharts') || id.includes('chart.js')) return 'vendor_charts';
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
