import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      '@shared': resolve(__dirname, 'shared')
    }
  },
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'client/src/index.html')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
