import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ส่งคำขอ /api จาก React ไปยัง ASP.NET Core ในเครื่อง
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7142',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
