import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    exclude: [...configDefaults.exclude, '**.spec.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})