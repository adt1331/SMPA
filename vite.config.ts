import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `base` is '/' for Vercel / Netlify. For GitHub Pages project sites set
// BASE_PATH=/<repository-name>/ at build time.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet'],
          qrcode: ['qrcode'],
        },
      },
    },
  },
});
