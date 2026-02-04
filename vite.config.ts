import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: '127.0.0.1',  // ← Forzar 127.0.0.1 en lugar de localhost
    port: 5173,
  }
})
