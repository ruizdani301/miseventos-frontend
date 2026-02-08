import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Permite que Docker exponga el servicio correctamente
    port: 5173,
    watch: {
      usePolling: true,
    },
  }
})

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '127.0.0.1', // Volvemos a localhost para pruebas locales
//     port: 5173,
//   }
// })