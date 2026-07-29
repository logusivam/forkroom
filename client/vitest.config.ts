import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest-setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'monaco-editor': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/editor/editor.api'),
    },
  },
})
