import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      '045ed84a-1df5-41aa-8625-d047165ab5f2-00-4yyssrg00tmu.sisko.replit.dev'
    ]
  }
})
