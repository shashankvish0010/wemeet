import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user/register': {
        target: "http://localhost:8080"
      },
      '/otp/verification': {
        target: "http://localhost:8080"
      },
      '/resend/otp': {
        target: "http://localhost:8080"
      },
      '/user/login': {
        target: "http://localhost:8080"
      },
      '/create/event': {
        target: "http://localhost:8080"
      },
      '/get/event': {
        target: "http://localhost:8080"
      },
      '/event': {
        target: "http://localhost:8080"
      },
      '/schedule/event': {
        target: "http://localhost:8080"
      },
      '/fetch/meetings': {
        target: "http://localhost:8080"
      },
      '/checkout/plan': {
        target: "http://localhost:8080"
      },
      '/get/meeting/cred/': {
        target: "http://localhost:8080"
      },
    }
  },
})
