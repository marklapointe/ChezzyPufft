import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'touchicon.png', 'touchicon72.png', 'touchicon114.png', 'touchicon144.png'],
      manifest: {
        name: 'Emby',
        short_name: 'Emby',
        description: 'The open media solution.',
        theme_color: '#52B54B',
        icons: [
          {
            src: 'touchicon72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'touchicon114.png',
            sizes: '114x114',
            type: 'image/png'
          },
          {
            src: 'touchicon144.png',
            sizes: '144x144',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          player: ['hls.js', 'howler'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/socket': {
        target: 'http://localhost:8096',
        ws: true
      },
      '/emby': {
        target: 'http://localhost:8096',
        rewrite: (path) => path.replace(/^\/emby/, '')
      },
      '/api': {
        target: 'http://localhost:8096'
      }
    }
  }
});
