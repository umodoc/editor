# Architecture — Umo Editor

## Призначення

Umo Editor — це Vue 3 plugin, що надає WYSIWYG document editor з підтримкою:
- Rich text editing (форматування, списки, таблиці, зображення, відео, аудіо, файли)
- Pagination mode (сторінковий макет як у Word) та web layout
- Markdown syntax, dark theme, multi-language (en-US)
- Export (PDF, HTML, image), print, preview mode
- Custom extensions, collaborative editing (Yjs)

## Стек технологій

| Шар | Технології |
|-----|------------|
| Framework | **Vue 3** (Composition API, `<script setup>`) |
| Editor engine | **Tiptap 3** → **ProseMirror** (`@tiptap/pm`) |
| Build tool | **Vite 7** (`@vitejs/plugin-vue`) |
| Styling | **LESS** з CSS variables (`--umo-*` prefix) |
| UI library (dev) | **TDesign Vue Next** (buttons, dropdowns, dialogs, sliders) |
| Icons | SVG sprite через `vite-plugin-svg-icons` |
| State persistence | `useStorage` з `@vueuse/core` (localStorage) |
| i18n | **vue-i18n** (composition mode) |
| Collaboration | **Yjs** + `y-prosemirror` + `@tiptap/extension-collaboration` |
| Code highlight | **lowlight** + `@tiptap/extension-code-block-lowlight` |
| Math | **KaTeX** + `@tiptap/extension-mathematics` |
| Linting | **oxlint**, **oxfmt**, **husky** + **lint-staged** |
| Auto-import | `unplugin-auto-import` (Vue, VueUse, composables), `unplugin-vue-components` (TDesign resolver) |
| Reactivity sugar | `@vue-macros/reactivity-transform` (`$ref`, `$computed`) |

## Як Umo Editor підключається до додатку

```
src/main.js                    # Dev entry point
  ├── createApp(App)
  ├── app.use(useUmoEditor)    # Реєстрація plugin
  └── app.mount('#app')

src/components/index.js        # Library entry point (для npm)
  ├── useUmoEditor.install()   # app.provide('defaultOptions') + app.component('UmoEditor')
  ├── export UmoEditor         # Головний компонент
  ├── export UmoMenuButton     # Допоміжний компонент для меню
  ├── export UmoDialog         # Модальне вікно
  └── export UmoTooltip        # Тултіп
```

`useUmoEditor` — це Vue plugin object з методом `install(app, options)`:
1. Зберігає `options` через `app.provide('defaultOptions', options)` (доступні всім нащадкам)
2. Реєструє глобальний компонент `UmoEditor`

## Потік даних та component tree

```
<UmoEditor>  (src/components/index.vue)
  │
  ├── Merges props + defaultOptions → reactive `options` ref
  ├── Creates refs: editor, page, savedAt, fullscreen, printing, etc.
  ├── Provides everything via provide/inject
  │
  ├── <header> → <Toolbar>  (src/components/toolbar/index.vue)
  │     ├── ribbon mode / classic mode
  │     └── menu groups: base, insert, table, tools, page, view, export
  │
  ├── <main> → <ContainerPage>  (src/components/container/page.vue)
  │     ├── <EditorContent>  (src/components/editor/index.vue)
  │     │     ├── new Editor({ extensions, content, ... })  ← Tiptap instance
  │     │     ├── <MenusBubble>  (context menus for selected nodes)
  │     │     └── <MenusBlock>   (drag handle / block menu)
  │     ├── <ContainerToc>       (table of contents sidebar)
  │     ├── <ContainerPrint>     (print overlay)
  │     └── <ContainerSearchReplace>
  │
  └── <footer> → <Statusbar>  (src/components/statusbar/index.vue)
        ├── TOC toggle, spellcheck, shortcuts, reset
        ├── Layout selector (page / web)
        ├── Word count
        ├── Zoom controls (slider, auto-width, reset)
        ├── Fullscreen, preview mode
        └── Language switcher
```

### Ключові provide/inject залежності

Головний компонент `index.vue` provides:
- `container` — CSS selector контейнера (`#umo-editor-{id}`)
- `options` — reactive merged options
- `editor` — Tiptap Editor instance ref
- `page` — reactive page state (layout, size, margin, zoom, watermark, preview)
- `savedAt`, `printing`, `fullscreen`, `searchReplace`, `blockMenu`, `imageViewer`
- `saveContent`, `setTheme`, `setSkin`, `setLocale`, `reset`

Всі дочірні компоненти отримують дані через `inject()`, без props drilling.

## Структура `src/`

```
src/
  ├── app.vue                   # Dev demo app (не входить у library build)
  ├── main.js                   # Dev entry point
  ├── i18n.js                   # vue-i18n instance creation
  │
  ├── components/               # Vue components (auto-imported)
  │   ├── index.js              # Library entry: useUmoEditor plugin + exports
  │   ├── index.vue             # UmoEditor — головний компонент (~1340 рядків)
  │   ├── editor/index.vue      # Tiptap Editor створення + EditorContent
  │   ├── toolbar/              # Toolbar wrapper (ribbon/classic modes)
  │   ├── container/            # Page layout, print, TOC, search-replace
  │   ├── menus/                # Toolbar menus, bubble menus, block menu
  │   ├── statusbar/            # Footer: zoom, word count, layout, shortcuts
  │   ├── picker/               # Color picker, emoji picker, etc.
  │   ├── modal.vue             # Dialog wrapper
  │   └── tooltip.vue           # Tooltip wrapper
  │
  ├── extensions/               # Custom Tiptap extensions (~30 extensions)
  │   ├── index.js              # getDefaultExtensions() — aggregates all
  │   └── {name}/               # Each extension: index.js + optional node-view.vue
  │
  ├── composables/              # Auto-imported composables
  │   ├── state.js              # useState() — localStorage persistence
  │   ├── i18n.js               # t(), l(), useI18n() wrappers
  │   ├── hotkeys.js            # useHotkeys(), removeAllHotkeys()
  │   ├── dialog.js             # useAlert(), useConfirm(), useMessage()
  │   ├── popup.js              # usePopup()
  │   ├── copy.js               # useCopy()
  │   └── select.js             # useSelect() — TDesign bug workaround
  │
  ├── options/                  # Configuration system
  │   ├── index.js              # Exports: defaultOptions, objectSchema, propsOptions
  │   ├── schema.js             # ObjectSchema validation rules
  │   └── config/
  │       ├── index.js          # Default option values
  │       └── dicts.js          # Dictionaries: fonts, colors, line heights, page sizes, etc.
  │
  ├── utils/                    # Utility functions
  │   ├── options.js            # getOptions() — merge props + defaults + globals
  │   ├── file.js               # File handling utilities
  │   ├── content-transform.js  # Content format conversion
  │   ├── shortcut.js           # Keyboard shortcut display helpers
  │   ├── short-id.js           # Short ID generator
  │   ├── load-resource.js      # Dynamic CSS/JS loading
  │   ├── copyright.js          # Build copyright banner
  │   ├── player.js             # Media player utilities
  │   ├── selection.js          # Editor selection helpers
  │   ├── time-ago.js           # Relative time formatting
  │   ├── diagram-editor.js     # Diagrams.net integration
  │   └── history-record.js     # Undo/redo history management
  │
  ├── locales/                  # Translation JSON files
  │   ├── en-US.json            # English (default)
  │   ├── ru-RU.json            # Russian
  │   ├── it-IT.json            # Italian
  │   └── bo.json               # Tibetan
  │
  └── assets/
      ├── styles/               # LESS stylesheets
      │   ├── index.less        # Main styles entry
      │   ├── editor.less       # Editor content styles
      │   └── drager.less       # Drag-related styles
      ├── icons/                # SVG icons (~100+)
      └── images/               # Static images
```

## Library build vs Dev mode

**Dev mode** (`npm run dev`):
- Entry: `index.html` → `src/main.js` → `src/app.vue`
- Повний додаток з демо-контентом, TDesign UI, HMR
- Port 9000, base `/umo-editor`

**Library build** (`npm run build`):
- Entry: `src/components/index.js`
- Output: `dist/umo-editor.js` + `dist/umo-editor.css`
- Externals: `vue`, `@vueuse/*`, `@tiptap/*`, `prosemirror-*`, всі `dependencies`
- ES module format, target ES2018
- CSS auto-import через `intro: "import './umo-editor.css'"`

## Exposed API (defineExpose)

Головний компонент `UmoEditor` відкриває багатий API через `defineExpose()`:

- **Options**: `getOptions()`, `setOptions()`
- **Content**: `getContent(format)`, `setContent()`, `insertContent()`, `getText()`, `getHTML()`, `getJSON()`, `getVanillaHTML()`
- **Page**: `setPage()`, `setWatermark()`, `getPage()`
- **Toolbar**: `setToolbar()`
- **Document**: `setDocument()`, `setReadOnly()`
- **Editor**: `getEditor()`, `useEditor()`, `focus()`, `blur()`
- **Locale**: `setLocale()`, `getLocale()`, `getI18n()`
- **Theme**: `setTheme()`, `setSkin()`
- **Export**: `getImage()`, `print()`, `saveContent()`
- **Typewriter**: `startTypewriter()`, `stopTypewriter()`, `getTypewriterState()`
- **Bookmarks**: `getAllBookmarks()`, `focusBookmark()`, `setBookmark()`, `deleteBookmark()`
- **Selection**: `getSelectionText()`, `getSelectionNode()`, `deleteSelectionNode()`
- **UI helpers**: `useAlert()`, `useConfirm()`, `useMessage()`
- **Misc**: `toggleFullscreen()`, `reset()`, `destroy()`, `getContentExcerpt()`

## Events (emits)

```
beforeCreate, created, changed, changed:selection, changed:transaction,
changed:menu, changed:toolbar, changed:pageSize,
changed:pageOrientation, changed:pageMargin, changed:pageBackground,
changed:pageShowToc, changed:pagePreview, changed:pageZoom,
changed:pageWatermark, changed:locale, changed:theme, changed:skin,
print, focus, blur, paste, drop, delete, saved, destroy
```
