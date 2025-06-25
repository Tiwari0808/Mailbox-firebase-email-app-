import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No Tailwind config here - we'll handle it differently
export default defineConfig({
  plugins: [react()]
})