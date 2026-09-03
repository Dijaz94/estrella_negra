import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts'],
    alias: {
      '~~': resolve(__dirname, '.'),
      '~': resolve(__dirname, 'app'),
    },
  },
})
