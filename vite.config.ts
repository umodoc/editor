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
    dts: './types/imports.d.ts',
  }),
  Components: Components({
    directoryAsNamespace: true,
    dirs: ['./src/components'],
    resolvers: [TDesignResolver({ library: 'vue-next', esm: true })],
    dts: './types/components.d.ts',
  }),
  SvgIcons: createSvgIconsPlugin({
    iconDirs: [`${process.cwd()}/src/assets/icons`],
    symbolId: 'umo-icon-[name]',
    customDomId: 'umo-icons',
  }),
}

// Build configuration for standalone application
const buildConfig = {
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: true,
  assetsInlineLimit: 4096,
  minify: 'esbuild' as const, // 明确指定类型
  cssMinify: true,
  rollupOptions: {
    output: {
      manualChunks(id: string) {
        // 添加类型声明
        if (id.includes('node_modules')) {
          return 'vendor'
        }
        return undefined
      },
    },
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
  base: '/',
  plugins: [
    tsConfigPaths(),
    ReactivityTransform(),
    ...Object.values(vuePlugins),
  ],
  css: cssConfig,
  build: buildConfig,
  resolve: {
    alias: {
      '@': `${process.cwd()}/src`,
    },
  },
})
