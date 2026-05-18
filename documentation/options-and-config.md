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

## Файли

| Файл | Призначення |
|------|-------------|
| `src/options/config/index.js` | Дефолтні значення всіх опцій |
| `src/options/config/dicts.js` | Словники: fonts, colors, lineHeights, symbols, emojis, pageSizes |
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
| `disableExtensions` | `array` | `[]` | Масив назв extensions для вимкнення |
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
| `page.layouts` | `array` | `['page', 'web']` | Доступні layouts |
| `page.defaultMargin` | `object` | `{ left: 3.18, right: 3.18, top: 2.54, bottom: 2.54 }` | Margins (cm) |
| `page.defaultOrientation` | `string` | `'portrait'` | `'portrait'` або `'landscape'` |
| `page.defaultBackground` | `string` | `'#fff'` | Background color |
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
| `pageSizes` | Розміри сторінок `[{ label, width, height, default? }]` |

## Валідація (schema.js)

`ObjectSchema` з `@eslint/object-schema` валідує кожну опцію при merge. Кожне правило має:

- `merge` — стратегія мержу (`'replace'`, `'assign'`)
- `validate` — функція або shorthand (`'string!'`, `'number'`, `'boolean'`, `'object'`, `'array'`)
- `required` — чи обов'язкова (всі `false` для опцій)

При невалідних значеннях кидає `Error` з описом проблеми.

## Як додати нову опцію

1. Додай default value у `src/options/config/index.js`
2. Додай validation rule у `src/options/schema.js`
3. Використовуй `options.value.myOption` через `inject('options')` у компонентах
4. Якщо потрібна persistence — додай handling у `src/composables/state.js`
