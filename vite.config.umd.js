import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { compression } from 'vite-plugin-compression2'
import pkg from './package.json'
import copyright from './src/utils/copyright'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
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
    }),
    compression({
      include: /umo-editor.js$/,
    }),
  ],
  resolve: {
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
      entry: process.cwd() + '/src/components/index.js',
      name: pkg.name,
      fileName: 'umo-editor.umd',
    },
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: [
        {
          exports: 'named',
          name: 'UmoEditor',
          format: 'umd',
          entryFileNames: 'umo-editor.js',
          globals: {
            vue: 'Vue',
            mermaid: 'mermaid',
            katex: 'katex',
            jsbarcode: 'JsBarcode',
            plyr: 'Plyr',
            'qrcode-svg': 'QRCode',
            '@imgly/background-removal': 'imglyRemoveBackground',
          },
        },
      ],
      external: [
        'vue',
        'mermaid',
        'katex',
        'plyr',
        'qrcode-svg',
        'jsbarcode',
        '@imgly/background-removal',
      ],
    },
    terserOptions: {
      output: {
        comments: false,
        preamble: `${copyright}`,
      },
    },
  },
})
