// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: (id) => {
        // Externalize problematic packages during build
        if (id.includes('xdg-open')) return true;
        return false;
      }
    },
    outDir: 'dist',
  },
  server: {
    open: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
});

