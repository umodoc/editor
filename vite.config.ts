import Vue from '@vitejs/plugin-vue'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
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
  target: 'es2018',
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
    onwarn(warning: any, warn: (warning: any) => void) {
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
      // 添加 Less 插件来排除特定类名
      plugins: [
        {
          install(less: any, pluginManager: any) {
            pluginManager.addPostProcessor({
              process(css: string) {
                return css.replace(/\.flex-center(\s|\{|,)[^}]*\}/g, '')
              },
            })
          },
        },
      ],
    },
  },
}

export default defineConfig({
  base: '/umo-editor',
  plugins: [
    tsConfigPaths(),
    dts({
      outDir: 'types',
      include: [
        'src/components/{index,modal,tooltip}.{ts,vue}',
        'src/components/menus/button.vue',
      ],
      bundledPackages: [
        'vue',
        '@vue/runtime-core',
        '@vue/compiler-sfc',
        '@tiptap/vue-3',
        '@tiptap/core',
      ],
      exclude: ['src/extensions/**/*'],
      logLevel: 'silent',
      pathsToAliases: true,
      compilerOptions: {
        skipDiagnostics: false,
        logDiagnostics: true,
      },
      beforeWriteFile: (filePath, content) => {
        const correctedContent = content.replace(
          /from ['"]\.\.\/types['"]/g,
          "from '../../../types'",
        )
        return {
          filePath,
          content: correctedContent,
        }
      },
    }),
    ReactivityTransform(),
    ...Object.values(vuePlugins),
  ],
  css: cssConfig,
  build: buildConfig,
  esbuild: {
    drop: ['debugger'],
  },
  resolve: {
    alias: {
      '@': `${process.cwd()}/src`,
    },
  },
})
