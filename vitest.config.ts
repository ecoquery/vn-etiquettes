import { defineConfig, mergeConfig } from 'vitest/config'
import electronViteConfig from './electron.vite.config'

export default mergeConfig(
  electronViteConfig,
  defineConfig({
    // plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom'
    }
  })
)
