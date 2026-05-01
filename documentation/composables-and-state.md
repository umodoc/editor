# Composables & State — Umo Editor

## Загальні принципи

- Composables знаходяться в `src/composables/` і **auto-imported** через `unplugin-auto-import` (dirs: `['./src/composables']`)
- Не потрібно робити `import { useState } from '@/composables/state'` — функції доступні глобально
- Також auto-imported: всі exports з `vue` та `@vueuse/core`
- TDesign компоненти auto-imported через resolver

## Composables

### `state.js` — useState()

```js
useState(key: string, editorOptions: Ref): Ref
```

Persisted state через `useStorage()` з VueUse (localStorage). Key format: `umo-editor:{editorKey}:{key}`.

Підтримувані ключі:

| Key | Default | Призначення |
|-----|---------|-------------|
| `'document'` | `editorOptions.document` | Стан документа (content, readOnly, enableSpellcheck тощо) |
| `'recent'` | `{ fonts: [], colors: [], downloadedFonts: [] }` | Нещодавно використані шрифти та кольори |
| `'toolbar'` | `{ mode: 'classic'/'ribbon', show: true }` | Режим та видимість toolbar |
| `'theme'` | `'light'` | Тема (light/dark) |
| `'skin'` | `'default'` | Скін (default/modern) |
| `'layout'` | `'page'` | Layout (page/web) |

`editorKey` дозволяє мати кілька незалежних екземплярів редактора на одній сторінці.

### `i18n.js` — t(), l(), useI18n()

```js
t(key: string, params?: object): string   // Стандартний i18n переклад
l(data: string | Record<string, string>): string   // Locale-aware label resolve
useI18n(): VueI18nGlobal   // Повний доступ до vue-i18n global instance
```

`t()` — обгортка над `i18n.global.t`. Використовується для UI текстів.

`l()` — розв'язує локалізовані label-и з конфігурації. Якщо `data` — string, повертає as-is. Якщо object `{ en_US, zh_CN }`, повертає значення для поточної locale. Використовується для dicts (fonts, page sizes тощо).

### `hotkeys.js` — useHotkeys(), removeAllHotkeys()

```js
useHotkeys(keys: string, onTrigger: () => void): void
removeAllHotkeys(): void
```

Обгортка над бібліотекою `hotkeys-js`. Автоматично `preventDefault()`. Filter встановлений на `() => true` (працює навіть у input/textarea).

Гарячі клавіші прив'язуються при `editor.focus` і знімаються при `editor.blur` (окрім Esc та Undo/Redo).

### `dialog.js` — useAlert(), useConfirm(), useMessage()

```js
useAlert(params: object): DialogInstance
useConfirm(params: object): DialogInstance
useMessage(type: string, params: object | string): MessageInstance
```

Обгортки над TDesign `DialogPlugin` та `MessagePlugin`. Автоматично додають `placement: 'center'` та `cancelBtn` з перекладом.

Параметри відповідають TDesign API: `attach`, `header`, `body`, `confirmBtn`, `onConfirm` тощо.

### `popup.js` — usePopup()

```js
usePopup(): { popupVisible: Ref<boolean>, togglePopup: (visible?: boolean) => void }
```

Простий reactive toggle для popup/dropdown видимості.

### `copy.js` — useCopy()

```js
useCopy(source: string, successMessage: string, container: string): boolean
```

Копіювання в буфер обміну через `useClipboard()` з VueUse. Показує success/error message через `useMessage()`.

### `select.js` — useSelect()

```js
useSelect(): { selectVisible: Ref<boolean> }
```

Workaround для TDesign `<t-select>` bug — delayed rendering через `onMounted()`.

## State management pattern

Umo Editor не використовує Pinia або Vuex. Замість цього:

1. **Головний компонент** (`index.vue`) створює reactive refs для всього стану
2. Передає їх через **provide/inject** нащадкам
3. Persistent state зберігається в **localStorage** через `useState()` (VueUse `useStorage()`)
4. Merged options створюються один раз через `getOpitons()` і зберігаються як reactive ref

### Provide/inject ланцюг

```
UmoEditor (index.vue)
  provide('container', container)     // CSS selector: '#umo-editor-{id}'
  provide('options', options)         // Reactive merged options
  provide('editor', editor)          // Tiptap Editor instance ref
  provide('page', page)              // Page state (layout, size, zoom, watermark, preview)
  provide('savedAt', savedAt)        // Timestamp останнього збереження
  provide('blockMenu', blockMenu)    // Block menu visibility
  provide('imageViewer', imageViewer) // Image viewer state
  provide('searchReplace', searchReplace) // Search/replace visibility
  provide('printing', printing)      // Print mode flag
  provide('fullscreen', fullscreen)  // Fullscreen flag
  provide('exportFile', exportFile)  // Export state
  provide('uploadFileMap', uploadFileMap) // Map завантажених файлів
  provide('destroyed', destroyed)    // Destroyed flag
  provide('historyRecords', historyRecords) // Undo/redo history
  provide('typeWriterIsRunning', typeWriterIsRunning)
  provide('saveContent', saveContent) // Save function
  provide('setTheme', setTheme)
  provide('setSkin', setSkin)
  provide('setLocale', setLocale)
  provide('reset', reset)
  provide('getVanillaHTML', getVanillaHTML)
  provide('undoHistory', undoHistory)
  provide('redoHistory', redoHistory)
```

### Як отримати дані в дочірньому компоненті

```js
const editor = inject('editor')
const options = inject('options')
const page = inject('page')
const container = inject('container')
```

## Utils (`src/utils/`)

| Файл | Exports | Опис |
|------|---------|------|
| `options.js` | `getOpitons(props, globalOptions)` | Merge props + global options + defaults через ObjectSchema |
| `file.js` | File handling utilities | Отримання розмірів зображень, файлові операції |
| `content-transform.js` | `contentTransform(content)` | Перетворення контенту (HTML/JSON) перед вставкою |
| `shortcut.js` | `getShortcut(keys)` | Форматування гарячих клавіш для відображення (Ctrl→Cmd на Mac) |
| `short-id.js` | `shortId(length?)` | Генерація коротких ID |
| `load-resource.js` | `loadResource(url, type, id)` | Динамічне завантаження CSS/JS ресурсів |
| `copyright.js` | `copyright`, `consoleCopyright()` | Copyright banner для build + console.log |
| `player.js` | Media player utilities | Ініціалізація Plyr для відео/аудіо |
| `selection.js` | `getSelectionText(editor)`, `getSelectionNode(editor)` | Робота з виділенням у редакторі |
| `time-ago.js` | `timeAgo(timestamp)` | Форматування часу "X хвилин тому" |
| `diagram-editor.js` | Diagram editor integration | Інтеграція з diagrams.net (draw.io) |
| `history-record.js` | `addHistory()`, `undoHistoryRecord()`, `redoHistoryRecord()` | Управління undo/redo історією (editor + page changes) |
