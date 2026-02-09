import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  base: '/businessanalyticspro/Dashboard/frontend/dist/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
