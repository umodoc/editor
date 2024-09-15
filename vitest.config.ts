import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

const testConfig = defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: {
      include: ['src'],
      exclude: ['**/*.spec.*', '**/*.d.ts', 'src/types.ts', 'testing/*'],
    },
    onConsoleLog(log: string) {
      if (
        log.includes(
          'Error: Not implemented: HTMLFormElement.prototype.requestSubmit',
        ) ||
        log.includes('(node:25503) [DEP0040]')
      ) {
        return false
      }
    },
  },
})

export default mergeConfig(viteConfig, testConfig)
