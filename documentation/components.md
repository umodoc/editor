# Components — Umo Editor

## Загальні принципи

- Всі компоненти з `src/components/` **auto-imported** через `unplugin-vue-components` з опцією `directoryAsNamespace: true`
- Naming convention для auto-import: `<menus-toolbar-base-bold />` → `src/components/menus/toolbar/base/bold.vue`
- Компоненти використовують **provide/inject** замість props для доступу до `editor`, `options`, `page`, `container` тощо
- UI елементи (buttons, dropdowns, sliders, dialogs) з **TDesign Vue Next** з prefix `umo-` (через `classPrefix: 'umo'`)
- Стилі: **LESS** з CSS custom properties (`--umo-*`)

## Component tree

```
<UmoEditor>  (index.vue — головний компонент)
│
├── <TConfigProvider>  (TDesign locale + class prefix)
│
├── <header class="umo-toolbar">
│   └── <Toolbar>  (toolbar/index.vue)
│       ├── <ToolbarRibbon>  або  <ToolbarClassic>
│       └── Slot-based menu rendering по options.toolbar.menus
│
├── <main class="umo-main">
│   └── <ContainerPage>  (container/page.vue)
│       ├── <EditorIndex>  (editor/index.vue)
│       │   ├── <EditorContent :editor="editor" />  ← Tiptap
│       │   ├── <MenusBlock>  (menus/block/index.vue)
│       │   └── <MenusBubble>  (menus/bubble/index.vue)
│       ├── <ContainerToc>  (container/toc.vue)
│       ├── <ContainerPrint>  (container/print.vue)
│       └── <ContainerSearchReplace>  (container/search-replace.vue)
│
└── <footer class="umo-footer">
    └── <Statusbar>  (statusbar/index.vue)
        ├── <StatusbarShortcuts>
        ├── <StatusbarCountdown>
        └── <StatusbarAbout>
```

## Toolbar (`src/components/toolbar/`)

| Файл | Опис |
|------|------|
| `index.vue` | Wrapper: вибирає ribbon або classic mode, рендерить menu groups через slots |
| `ribbon.vue` | Ribbon mode — tabs з групами меню (як у MS Word) |
| `classic.vue` | Classic mode — всі меню в одному рядку |
| `scrollable.vue` | Scrollable wrapper для меню, що не вміщуються |

Toolbar рендерить menu groups динамічно на основі `options.toolbar.menus` (базові значення в upstream: `['base', 'insert', 'table', 'tools', 'page', 'view', 'export']`; у форку див. `src/options/config/index.js`).

Кожна група меню — це набір button-компонентів з `src/components/menus/toolbar/{group}/`.

## Toolbar Menus (`src/components/menus/toolbar/`)

### `base/` — Home tab

Основне форматування тексту:

| Компонент | Опис |
|-----------|------|
| `undo.vue` / `redo.vue` | Undo/Redo |
| `format-painter.vue` | Format Painter |
| `clear-format.vue` | Очищення формату |
| `print.vue` | Друк |
| `bold.vue`, `italic.vue`, `underline.vue`, `strike.vue` | Базове форматування |
| `subscript.vue` / `superscript.vue` | Верхній/нижній індекс |
| `code.vue` | Inline code |
| `heading.vue` | Заголовки (H1-H6) |
| `font-family.vue` / `font-size.vue` | Шрифт та розмір |
| `color.vue` / `highlight.vue` | Колір тексту та маркер |
| `letter-spacing.vue` / `line-height.vue` | Інтервали |
| `align-left.vue`, `align-center.vue`, `align-right.vue`, `align-justify.vue`, `align-distributed.vue` | Вирівнювання |
| `ordered-list.vue` / `bullet-list.vue` / `task-list.vue` | Списки |
| `indent.vue` / `outdent.vue` | Відступи |
| `quote.vue` | Цитата |
| `markdown.vue` | Toggle Markdown mode |
| `save.vue` | Зберегти |

### `insert/` — Insert tab

| Компонент | Опис |
|-----------|------|
| `image.vue` / `video.vue` / `audio.vue` / `file.vue` | Медіа файли |
| `code-block.vue` | Блок коду |
| `hr.vue` / `hard-break.vue` | Горизонтальна лінія / розрив рядка |
| `toc.vue` | Зміст |
| `bookmark.vue` | Закладка |
| `columns.vue` | Колонки |
| `callout.vue` | Callout block |
| `details.vue` | Collapsible block |
| `text-box.vue` | Text box |
| `option-box.vue` | Checkbox/radio |
| `emoji.vue` / `symbol.vue` | Emoji та спецсимволи |
| `chinese-date.vue` | Китайська дата |
| `footnote.vue` | Виноска |
| `mention.vue` | @mention |
| `template.vue` | Шаблони |
| `web-page.vue` | Вбудована web-сторінка (iframe) |

### `table/` — Table tab

Всі операції з таблицями: insert, delete row/column, merge/split cells, toggle headers, alignment, background, fix layout, cell navigation.

### `tools/` — Tools tab

| Компонент | Опис |
|-----------|------|
| `math.vue` | Математичні формули |
| `echarts.vue` | Графіки ECharts |
| `mermaid.vue` | Mermaid діаграми |
| `diagrams.vue` | Diagrams.net |
| `qrcode.vue` / `barcode.vue` | QR-код та штрих-код |
| `signature.vue` | Електронний підпис |
| `chinese-case.vue` | Зміна регістру (китайський) |

### `page/` — Page tab

Налаштування сторінки: size, orientation, margin, background, watermark, header/footer, break marks, bookmark toggle, line number, page break.

### `view/` — View tab

| Компонент | Опис |
|-----------|------|
| `theme.vue` | Тема (light/dark/auto) |
| `page.vue` / `web.vue` | Режим відображення |
| `zoom-in.vue` / `zoom-out.vue` / `zoom-original.vue` / `zoom-auto.vue` | Масштаб |
| `fullscreen.vue` | Повноекранний режим |
| `preview.vue` | Режим перегляду/презентації |
| `reset.vue` | Скидання налаштувань |
| `search-replace.vue` | Пошук та заміна |

### `export/` — Export tab

| Компонент | Опис |
|-----------|------|
| `pdf.vue` | Експорт у PDF |
| `html.vue` | Експорт у HTML |
| `image.vue` | Експорт як зображення |
| `markdown.vue` | Експорт у Markdown |
| `text.vue` | Експорт як текст |
| `embed.vue` | Код для вбудовування |
| `share.vue` | Поширення |

## Bubble Menus (`src/components/menus/bubble/`)

Контекстні меню, що з'являються при виділенні або кліку на конкретний тип ноди.

| Директорія | Для якого node type | Дії |
|------------|-------------------|------|
| `image/` | Image | Edit, preview, open, reset, rotate, flip, proportion, convert, draggable |
| `link/` | Link | Open, copy, unlink |
| `callout/` | Callout | Builtin types, emoji remove, background color |
| `tag/` | Tag | Input, color, background, builtin, delete |
| `text-box/` | TextBox | Background, border, writing-mode |
| `file/` | File | Width, download |
| `webpage/` | Iframe | Open, clickable |
| `node/` | Generic node | Duplicate, delete, convert to file |
| `math.vue` | Math | Inline math edit |
| `menus.vue` | Text selection | Загальне bubble menu для тексту (formatting) |

### Як bubble menu визначає, який набір кнопок показати

`menus/bubble/menus.vue` перевіряє `editor.isActive(nodeType)` і рендерить відповідний набір компонентів.

## Block Menu (`src/components/menus/block/`)

| Файл | Опис |
|------|------|
| `index.vue` | Drag handle / block menu — з'являється ліворуч від блоку |
| `common.vue` | Контекстне меню для блокових операцій (duplicate, delete, convert тощо) |

Використовує `@tiptap/extension-drag-handle-vue-3`.

## Button Component (`src/components/menus/button.vue`)

Універсальний компонент кнопки для toolbar та bubble menus. Підтримує:
- Icon, text, tooltip
- Dropdown, popup
- Active state
- Disabled state
- Size variants

## Container (`src/components/container/`)

| Файл | Опис |
|------|------|
| `page.vue` | Canvas редактора: web-layout (розтягування по ширині контейнера), зум, watermark, TOC, viewer |
| `toc.vue` | Table of Contents sidebar panel |
| `print.vue` | Print overlay (підготовка до друку) |
| `search-replace.vue` | Пошук та заміна UI |

## Statusbar (`src/components/statusbar/`)

| Файл | Опис |
|------|------|
| `index.vue` | Footer bar: TOC, spellcheck, shortcuts, reset, індикатор web-layout, лічильник слів, copyright, fullscreen, preview, zoom, мова |
| `shortcuts.vue` | Панель з гарячими клавішами |
| `countdown.vue` | Таймер зворотного відліку (для презентацій) |
| `about.vue` | About Umo Editor dialog |

## Picker (`src/components/picker/`)

Спеціалізовані picker-компоненти для вибору кольорів, emoji, символів тощо.

## Інші компоненти кореневого рівня

| Файл | Опис |
|------|------|
| `modal.vue` | Dialog wrapper (exported як `UmoDialog`) |
| `tooltip.vue` | Tooltip wrapper (exported як `UmoTooltip`) |

## Як додати новий пункт toolbar menu

1. Створи `.vue` файл у `src/components/menus/toolbar/{category}/`
2. Використовуй `<UmoMenuButton>` або TDesign компоненти
3. Inject `editor` та `options` через `inject()`
4. Викликай editor commands: `editor.value.chain().{command}().run()`
5. Якщо потрібен переклад — додай ключі в `src/locales/*.json`
6. Компонент буде auto-imported за naming convention

## Як додати bubble menu для нового node type

1. Створи директорію `src/components/menus/bubble/{node-type}/`
2. Додай окремі `.vue` файли для кожної дії
3. Зареєструй їх у `src/components/menus/bubble/menus.vue` (перевірка `editor.isActive()`)
