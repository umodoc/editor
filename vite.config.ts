import Vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import type { RollupWarning } from 'rollup'
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

// Build configuration
const buildConfig = {
  lib: {
    entry: `${process.cwd()}/src/components/index.ts`,
    name: pkg.name,
    fileName: 'umo-editor',
  },
  outDir: 'dist',
  copyPublicDir: false,
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
      'vue',
      ...Object.keys(pkg.dependencies ?? {}),
      /^@vueuse\/.*/,
      /^@tiptap\/.*/,
      /^nzh\/.*/,
    ],
    onwarn(warning: RollupWarning, warn: (warning: RollupWarning) => void) {
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
      warn(warning)
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
  base: '/umo-editor',
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
