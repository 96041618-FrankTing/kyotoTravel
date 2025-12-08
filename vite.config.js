import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 在建置後複製 service worker 和靜態資源
    {
      name: 'copy-files',
      closeBundle() {
        const files = [
          'service-worker.js',
          'manifest.json',
          'icon-72.png',
          'icon-96.png',
          'icon-128.png',
          'icon-144.png',
          'icon-152.png',
          'icon-192.png',
          'icon-384.png',
          'icon-512.png',
          'icon.svg',
          'offline.html'
        ]
        files.forEach(file => {
          try {
            copyFileSync(
              resolve(__dirname, file),
              resolve(__dirname, 'dist', file)
            )
            console.log(`✓ Copied ${file}`)
          } catch (err) {
            console.error(`✗ Failed to copy ${file}:`, err.message)
          }
        })
      }
    }
  ],
  base: process.env.NODE_ENV === 'production' ? './' : '/kyotoTravel/',
  server: {
    host: true,
    port: 3000
  }
})