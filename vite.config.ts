import Vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsConfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json'
import copyright from './src/utils/copyright'

// Plugin configurations
const vuePlugins = {
  VueMacros: VueMacros({
    plugins: {
      vue: Vue(),
    },
  }),
  AutoImport: AutoImport({
    dirs: ['./src/composables'],
    imports: ['vue', '@vueuse/core'],
    resolvers: [TDesignResolver({ library: 'vue-next', esm: true })],
    dts: './imports.d.ts',
  }),
  Components: Components({
    directoryAsNamespace: true,
    dirs: ['./src/components'],
    resolvers: [TDesignResolver({ library: 'vue-next', esm: true })],
  }),
  SvgIcons: createSvgIconsPlugin({
    iconDirs: [`${process.cwd()}/src/assets/icons`],
  }),
}

// Build configuration
const buildConfig = {
  lib: {
    entry: `${process.cwd()}/src/components/index.ts`,
    name: pkg.name,
    fileName: 'umo-editor',
  },
  outDir: 'dist',
  minify: 'esbuild' as const,
  cssMinify: true,
  rollupOptions: {
    output: [
      {
        banner: copyright,
        intro: `import './style.css'`,
        format: 'es' as const,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      /^@vueuse\/.*/,
      /^@tiptap\/.*/,
      /^nzh\/.*/,
    ],
  },
}

// Test configuration
const testConfig = {
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
}

const cssConfig = {
  preprocessorOptions: {
    less: {
      modifyVars: { '@prefix': 'umo' },
      javascriptEnabled: true,
    },
  },
}

export default defineConfig({
  base: '/umo-editor/',
  plugins: [
    tsConfigPaths(),
    ReactivityTransform(),
    ...Object.values(vuePlugins),
  ],
  css: cssConfig,
  build: buildConfig,
  test: testConfig,
  resolve: {
    alias: {
      '@': `${process.cwd()}/src`,
    },
  },
})
