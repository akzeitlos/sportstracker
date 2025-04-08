import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
  server: {
    host: '0.0.0.0',  // Binde Vite an alle IP-Adressen
    port: 3000        // Der Port bleibt 5173, falls du diesen nicht ändern möchtest
  },
  build: {
    minify: false,
    sourcemap: false
  }
})
