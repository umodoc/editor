# Build & Dev — Umo Editor

## npm Scripts

| Команда | Опис |
|---------|------|
| `npm run dev` | Dev server: Vite HMR, port 9000, `--open --force` |
| `npm run build` | Library build: `dist/umo-editor.js` + `dist/umo-editor.css` |
| `npm run lint` | Linting: `oxlint --fix src` |
| `npm run format` | Formatting: `oxfmt --write .` |
| `npm run analyzer` | Bundle analysis: `vite-bundle-visualizer` |
| `npm run prepare` | Pre-install hook: `npm run build` |
| `npm run prepublishOnly` | Pre-publish hook: `npm run build` |

## Vite Configuration (`vite.config.js`)

### Plugins

| Plugin | Опис |
|--------|------|
| `VueMacros` | Vue Macros wrapper з вбудованим `@vitejs/plugin-vue` |
| `ReactivityTransform` | `$ref`, `$computed` — reactivity sugar |
| `AutoImport` | Auto-import: `vue`, `@vueuse/core`, composables з `./src/composables`, TDesign resolver |
| `Components` | Auto-import Vue компонентів з `./src/components` з `directoryAsNamespace: true`, TDesign resolver |
| `SvgIcons` | SVG sprite: іконки з `src/assets/icons/`, prefix `umo-icon-`, DOM ID `umo-icons` |

### Auto-import деталі

**Functions** (unplugin-auto-import):
- `vue` exports: `ref`, `computed`, `watch`, `onMounted`, `provide`, `inject`, `nextTick` тощо
- `@vueuse/core` exports: `useStorage`, `useClipboard`, `useDebounceFn`, `useFullscreen`, `useTimestamp`, `isDefined` тощо
- Всі exports з `src/composables/*.js`
- TDesign Vue Next компоненти

**Components** (unplugin-vue-components):
- Всі `.vue` файли з `src/components/` (directory as namespace)
- TDesign Vue Next компоненти
- Generated types: `types/imports.d.ts`, `types/components.d.ts`

### CSS (LESS)

```js
css: {
  preprocessorOptions: {
    less: {
      modifyVars: { '@prefix': 'umo' },
      javascriptEnabled: true,
      // Post-processor видаляє .flex-center класи
    },
  },
}
```

TDesign class prefix переписаний на `umo-` (через `modifyVars` та `TConfigProvider`).

### Resolve

```js
resolve: {
  alias: { '@': `${process.cwd()}/src` }
}
```

`@/` маппиться на `src/` для всіх imports.

### Esbuild

```js
esbuild: {
  drop: ['debugger']  // Видаляє debugger statements
}
```

## Library Build

Entry point: `src/components/index.js`

```js
build: {
  target: 'es2018',
  lib: {
    entry: 'src/components/index.js',
    name: '@umoteam/editor',
    fileName: 'umo-editor',
  },
  outDir: 'dist',
  copyPublicDir: false,
  minify: 'esbuild',
  cssMinify: true,
}
```

### Output format

```js
rollupOptions: {
  output: [{
    banner: copyright,                    // Copyright header
    intro: "import './umo-editor.css'",   // CSS auto-import
    format: 'es',                         // ES modules
  }],
}
```

### External dependencies

Всі runtime dependencies externalized (не включені у bundle):
- `vue`
- `@vueuse/*`
- `@tiptap/*`
- `prosemirror-*`
- `nzh/*`
- Всі ключі з `package.json` dependencies

Це означає, що consuming project повинен встановити ці залежності.

## Dev Mode

Entry: `index.html` → `src/main.js` → `src/app.vue`

```js
base: '/umo-editor'    // Base URL path
// Port 9000 (через --port flag у npm script)
```

`src/app.vue` — демо додаток з:
- Шаблонами документів (китайською)
- Тестовим контентом з localStorage
- Callback `onSave` (зберігає в localStorage)
- Callback `onFileUpload` (повертає Object URL)
- Конфігурацією користувачів для @mentions

## SVG Icons

Іконки розміщені у `src/assets/icons/*.svg`.

Plugin `vite-plugin-svg-icons` створює SVG sprite з:
- Symbol ID pattern: `umo-icon-{filename}`
- Контейнер DOM ID: `umo-icons`
- Реєстрація: `import 'virtual:svg-icons-register'` у `src/components/index.js`

Використання в компонентах (через icon component, auto-imported):
```vue
<icon name="bold" />
```

## Linting & Formatting

| Інструмент | Конфігурація | Опис |
|-----------|-------------|------|
| **oxlint** | `oxlint --fix src` | Швидкий лінтер (Rust-based) |
| **oxfmt** | `oxfmt --write .` | Formatter (Rust-based) |
| **husky** | `.husky/` | Git hooks |
| **lint-staged** | `package.json` `lint-staged` field | Pre-commit: `oxfmt --write src` + `oxlint --fix src` для `*.{js,vue,less}` |

## Node.js version

```json
"engines": { "node": ">=18.0.0" }
```

## Copyright

`src/utils/copyright.js` генерує banner для build output:
```
/*!
 * Umo Editor v{version}
 * ...
 */
```
