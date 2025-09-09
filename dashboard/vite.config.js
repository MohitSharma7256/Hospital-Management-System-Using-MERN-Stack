import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0', // Allow external connections
    open: true,
    cors: true, // Enable CORS
    hmr: {
      port: 5174, // Use same port for HMR WebSocket
      host: 'localhost'
    }
  }
})
