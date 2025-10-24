import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    laravel({
      input: [
        'resources/js/main.tsx',
        'resources/css/shadcn.css'
      ], // file kamu
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    hmr: {
      host: '127.0.0.1',
    },
  },
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
})
