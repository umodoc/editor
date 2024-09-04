import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import pkg from './package.json'
import copyright from './src/utils/copyright'

export default defineConfig({
  base: '/umo-editor/',
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
    AutoImport({
      dirs: ['./src/composables'],
      imports: ['vue', '@vueuse/core'],
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          esm: true,
        }),
      ],
      dts: './imports.d.ts',
    }),
    Components({
      directoryAsNamespace: true,
      dirs: ['./src/components'],
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          esm: true,
        }),
      ],
    }),
    createSvgIconsPlugin({
      iconDirs: [process.cwd() + '/src/assets/icons'],
      symbolId: 'umo-icon-[name]',
      customDomId: '__umo__svg__icons__dom__'
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          '@prefix': 'umo',
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    lib: {
      entry: process.cwd() + '/src/components/index.ts',
      name: pkg.name,
      fileName: 'umo-editor',
    },
    outDir: 'dist',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: [
        {
          banner: copyright,
          intro: `import './style.css'`,
          format: 'es',
        },
      ],
      external: [
        /@vueuse\/.*/,
        /@tiptap\/.*/,
        /nzh\/.*/,
        'vue',
        '@eslint/object-schema',
        '@imgly/background-removal',
        '@vue-monaco/editor',
        'dom-to-image-more',
        'es-drager',
        'file64',
        'file-saver',
        'hotkeys-js',
        'jsbarcode',
        'katex',
        'mermaid',
        'plyr',
        'pretty-bytes',
        'qrcode-svg',
        'svg64',
        'vue-i18n',
        'vue-esign',
      ],
    },
  },
})
