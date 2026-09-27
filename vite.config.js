import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

// Static GitHub Pages build — no Base44 plugin required
export default defineConfig({
  plugins: [react()],
  // Project site: https://yeepingy88-source.github.io/rabbit/
  base: '/rabbit/',
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
