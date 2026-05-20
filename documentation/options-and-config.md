# Options & Config — Umo Editor

## Архітектура конфігурації

Конфігурація складається з трьох шарів, які мержаться через `ObjectSchema`:

```
Default options (src/options/config/index.js)
  └── Global options (app.use(useUmoEditor, globalOptions))
      └── Component props (<umo-editor v-bind="propsOptions" />)
```

Мерж відбувається у `src/utils/options.js` → `getOptions()`:
```js
const options = objectSchema.merge(defaultOptions, globalOptions, componentOptions)
```

**`disableExtensions`** — виняток: кожен шар **додає** ключі до спільного списку (без дублікатів), а не перезаписує попередній масив. Порожній `[]` у props нічого не знімає з дефолтів форку.

Приклад для хост-проєкту (Nuxt):
```js
// plugins/umo-editor.client.js — додаткові вимкнення для всього застосунку
app.use(useUmoEditor, { disableExtensions: ['math', 'echarts'] })

// Сторінка — ще один інстанс
<umo-editor :disable-extensions="['export-pdf']" />
// Результат: fork defaults + math + echarts + export-pdf
```

## Файли

| Файл | Призначення |
|------|-------------|
| `src/options/config/index.js` | Дефолтні значення всіх опцій |
| `src/options/config/dicts.js` | Словники: fonts, colors, lineHeights, symbols, emojis |
| `src/options/schema.js` | ObjectSchema — валідація типів та значень |
| `src/options/index.js` | Barrel export: `defaultOptions`, `objectSchema`, `propsOptions` |

## Опції

### Top-level

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `editorKey` | `string` | `'default'` | Унікальний ключ instance (для localStorage ізоляції) |
| `locale` | `string` | `'en-US'` | Мова інтерфейсу: `'en-US'` |
| `theme` | `string` | `'light'` | Тема: `'light'`, `'dark'`, `'auto'` |
| `skin` | `string` | `'default'` | Скін: `'default'` або `'modern'` |
| `height` | `string` | `'100%'` | CSS висота контейнера |
| `fullscreenZIndex` | `number` | `10` | z-index у fullscreen mode |
| `cdnUrl` | `string` | `'https://unpkg.com/...'` | CDN для зовнішніх ресурсів (KaTeX CSS, Mermaid JS) |
| `shareUrl` | `string` | `location.href` | URL для кнопки "Поділитися" |
| `templates` | `array` | `[]` | Шаблони документів `[{ title, description?, content }]` |
| `extensions` | `array` | `[]` | Додаткові Tiptap extensions |
| `disableExtensions` | `array` | `[]` | Масив назв extensions для вимкнення. **Мержиться union** (config → `app.use` → props), а не замінюється цілком |
| `translations` | `object` | `{ en_US: {} }` | Custom переклади (мержаться з вбудованими) |
| `user` | `object` | `{}` | Поточний користувач `{ id, label, avatar }` |
| `users` | `array` | `[]` | Список користувачів для @mentions `[{ id, label, bio?, avatar?, color? }]` |

### Callbacks

| Опція | Тип | Опис |
|-------|-----|------|
| `onSave` | `async function(content, page, document)` | **Обов'язковий**. Має повернути string (message) або `{ status, message, showMessage }` |
| `onFileUpload` | `async function(file)` | **Обов'язковий**. Має повернути `{ id, url, name, type, size }` |
| `onFileDelete` | `function(id, url, type)` | Callback при видаленні файлу |

### `toolbar`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `toolbar.showSaveLabel` | `boolean` | `true` | Показувати кнопку Save + Ctrl+S shortcut |
| `toolbar.defaultMode` | `string` | `'ribbon'` | Mode: `'classic'` або `'ribbon'` |
| `toolbar.menus` | `array` | `['base', 'insert', 'table', 'tools', 'page', 'view', 'export']` | Які menu groups показувати. `'base'` обов'язковий |

### `page`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `page.layouts` | `array` | `['web']` | Доступний layout завжди **web** (`page.layout === 'web'`). Режим «аркушів» (`page`) і перемикання layout прибрані; значення лише `'web'` (див. секцію **Breaking changes** нижче) |
| `page.showBreakMarks` | `boolean` | `true` | Показувати invisible characters |
| `page.showLineNumber` | `boolean` | `false` | Нумерація рядків |
| `page.showBookmark` | `boolean` | `false` | Показувати закладки |
| `page.showToc` | `boolean` | `false` | Показувати зміст |
| `page.watermark` | `object` | `{ type, alpha, fontColor, fontSize, fontFamily, fontWeight, text }` | Водяний знак |

### `document`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `document.title` | `string` | `''` | Назва документа |
| `document.content` | `string/object` | `''` | HTML або JSON контент |
| `document.placeholder` | `string` | `'Please enter the document content...'` | Placeholder тексту |
| `document.structure` | `string` | `'block+'` | ProseMirror document content expression |
| `document.enableSpellcheck` | `boolean` | `true` | Перевірка правопису |
| `document.enableMarkdown` | `boolean` | `true` | Markdown input rules |
| `document.enableBubbleMenu` | `boolean` | `true` | Bubble context menus |
| `document.enableBlockMenu` | `boolean` | `true` | Block drag handle menu |
| `document.enableNodeId` | `boolean` | `false` | Unique ID для кожної ноди |
| `document.readOnly` | `boolean` | `false` | Режим "тільки для читання" |
| `document.autofocus` | `string/boolean/number` | `false` | Автофокус: `'start'`, `'end'`, `'all'`, number, true, false |
| `document.characterLimit` | `number` | `0` | Ліміт символів (0 = без ліміту) |
| `document.typographyRules` | `object` | `{}` | Правила Typography extension |
| `document.editorProps` | `object` | `{}` | ProseMirror EditorProps passthrough |
| `document.parseOptions` | `object` | `{ preserveWhitespace: 'full' }` | ProseMirror ParseOptions |
| `document.autoSave` | `object` | `{ enabled: true, interval: 300000 }` | Автозбереження (5 хв) |

### `echarts`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `echarts.mode` | `number` | `1` | Режим ECharts |
| `echarts.renderImage` | `boolean` | `false` | Рендерити як зображення |
| `echarts.onCustomSettings` | `function` | `() => null` | Custom settings callback |

### `file`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `file.allowedMimeTypes` | `array` | `[]` | Дозволені MIME типи (порожній = всі) |
| `file.maxSize` | `number` | `104857600` | Максимальний розмір (100MB) |
| `file.preview` | `array` | `[{ extensions, url }]` | Правила preview для типів файлів |

### `webPages`

Масив конфігурацій для вбудованих web-сторінок (iframe):
```js
{
  label: 'Figma',
  icon: '<svg>...</svg>',
  validate(url) { return /pattern/.test(url) },
  transformURL(url) { return embedUrl },
}
```

Default: Bilibili, Youku, Figma, MockingBot, Tencent Video.

### `diagrams`

| Опція | Тип | Default | Опис |
|-------|-----|---------|------|
| `diagrams.domain` | `string` | `'https://embed.diagrams.net'` | Diagrams.net domain |
| `diagrams.params` | `object` | `{}` | URL параметри для diagrams.net |

### `dicts` (словники)

Визначені у `src/options/config/dicts.js`:

| Dict | Опис |
|------|------|
| `fonts` | Список шрифтів `[{ label: string, value, url?, format? }]` |
| `colors` | Масив HEX кольорів для color picker |
| `lineHeights` | Варіанти міжрядкового інтервалу `[{ label, value, default? }]` |
| `symbols` | Групи спецсимволів `[{ label, items: string }]` |
| `emojis` | Групи emoji `[{ label, items: string }]` |

## Валідація (schema.js)

`ObjectSchema` з `@eslint/object-schema` валідує кожну опцію при merge. Кожне правило має:

- `merge` — стратегія мержу (`'replace'`, `'assign'`)
- `validate` — функція або shorthand (`'string!'`, `'number'`, `'boolean'`, `'object'`, `'array'`)
- `required` — чи обов'язкова (всі `false` для опцій)

При невалідних значеннях кидає `Error` з описом проблеми.

## Breaking changes (web-only layout)

Цей форк використовує **лише web-layout** редактора.

- Перемикання «Page» / «Web» у статус-барі та тулбарі View **видалено**; статус-бар показує індикатор `layout.web`.
- **`setLayout()` прибрано** з публічного `defineExpose`; подія **`changed:pageLayout`** більше **не emit**-иться.
- **`setPage(..., { layout })`** / передача `layout` для зміни режиму **не підтримується** (поле `layout` можна лише інтерпретувати як константу `'web'` у `page` state для сумісності).
- **`useState('layout')` видалено** — режим відображення більше не зберігається в `localStorage`.
- Ключ **`disableExtensions`**: `layout-page` та `layout-web` для тулбара більше не мають ефекту (кнопок немає).

### Page margin, size, orientation, background

- UI (toolbar Page tab) та **`page-options`** модалка для margin/size **видалені**.
- З **`getPage()`** / **`onSave(..., page)`** прибрані поля: `margin`, `size`, `orientation`, `background`.
- **`setPage({ margin | size | orientation | background })`** більше не змінює стан (метод лишається для сумісності виклику).
- Події **`changed:pageMargin`**, **`changed:pageSize`**, **`changed:pageOrientation`**, **`changed:pageBackground`** **не emit**-яться.
- Опції **`page.defaultMargin`**, **`page.defaultOrientation`**, **`page.defaultBackground`** та **`dicts.pageSizes`** **видалені** з config/schema.
- **Web:** контент має фіксований padding `1rem` (`--umo-editor-content-padding`).
- **Print/PDF:** layout A4 portrait, колишні cm margins і білий фон — константи в `src/constants/print-page-layout.js` (не з `page` state).

## Як додати нову опцію

1. Додай default value у `src/options/config/index.js`
2. Додай validation rule у `src/options/schema.js`
3. Використовуй `options.value.myOption` через `inject('options')` у компонентах
4. Якщо потрібна persistence — додай handling у `src/composables/state.js`
