import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest-setup.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
    forks: {
      maxForks: 1,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'monaco-editor': path.resolve(__dirname, '../node_modules/monaco-editor/esm/vs/editor/editor.api'),
    },
  },
})
