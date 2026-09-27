import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

// Static GitHub Pages build — relative base so it works on any repo subpath or root
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
