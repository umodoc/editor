# Extensions — Umo Editor

## Як працює система розширень Tiptap

Tiptap побудований на ProseMirror і використовує три типи extensions:

- **Node** — блоковий або inline елемент документа (paragraph, heading, image, table, callout...)
- **Mark** — inline форматування, що накладається на текст (bold, italic, link, bookmark...)
- **Extension** — функціональність без власного DOM-вузла (undo/redo, hotkeys, indent, format painter...)

Кожен extension має стандартну структуру:

```js
Node.create({
  name: 'myNode',
  group: 'block',           // або 'inline'
  content: 'paragraph+',    // ProseMirror content expression
  addAttributes() { ... },  // Атрибути вузла (зберігаються в HTML)
  parseHTML() { ... },       // Як парсити з HTML
  renderHTML() { ... },      // Як рендерити в HTML
  addNodeView() { ... },     // Vue component для інтерактивного рендерингу
  addCommands() { ... },     // Команди для програмного управління
  addInputRules() { ... },   // Markdown-подібні правила введення
  addKeyboardShortcuts() { ... },
})
```

## Агрегація розширень

Файл `src/extensions/index.js` містить функцію `getDefaultExtensions()`, яка:

1. Створює `buildInExtensions` — масив вбудованих extensions (StarterKit, Document, TextStyleKit, UndoRedo, Focus, Placeholder, FormatPainter, Bold, Subscript/Superscript, Indent, TextAlign, SearchReplace, Table, Echarts, PageBreak, Selection, NodeRange, Typography, CharacterCount, FileHandler, Dropcursor, TypeWriter, OfficePaste тощо)

2. Створює об'єкт `extensions` — map кастомних extensions, де key = назва, яку можна передати в `disableExtensions` для вимкнення

3. Мержить їх разом і додає user-defined extensions з `options.value.extensions`

Фінальний масив передається у `new Editor({ extensions })` у `src/components/editor/index.vue`.

**Важливо**: `disableExtensions` option приймає масив рядків (key від об'єкта `extensions`), що дозволяє вимикати окремі extensions.

## @tiptap/* залежності

| Package | Призначення |
|---------|-------------|
| `@tiptap/core` | Ядро Tiptap: Extension, Node, Mark базові класи |
| `@tiptap/vue-3` | Vue 3 інтеграція: `Editor`, `EditorContent`, `VueNodeViewRenderer` |
| `@tiptap/starter-kit` | Базовий набір: paragraph, heading, blockquote, list, italic, strike, code, etc. |
| `@tiptap/extensions` | Утиліти: CharacterCount, Dropcursor, Focus, TrailingNode, Placeholder, UndoRedo |
| `@tiptap/extension-bold` | Bold (перевизначений: рендерить `<b>` замість `<strong>`) |
| `@tiptap/extension-text-style` | TextStyleKit — inline стилі (font, color, background) |
| `@tiptap/extension-text-align` | Вирівнювання тексту (extended у проєкті) |
| `@tiptap/extension-link` | Гіперпосилання |
| `@tiptap/extension-image` | Зображення (extended в `src/extensions/image/`) |
| `@tiptap/extension-table` | Таблиці (extended в `src/extensions/table/`) |
| `@tiptap/extension-table-of-contents` | Зміст документа |
| `@tiptap/extension-code-block-lowlight` | Код з підсвіткою |
| `@tiptap/extension-mathematics` | Математичні формули (KaTeX) |
| `@tiptap/extension-mention` | @mentions |
| `@tiptap/extension-details` | Collapsible blocks (Details/Summary) |
| `@tiptap/extension-subscript` / `superscript` | Надрядковий/підрядковий текст |
| `@tiptap/extension-typography` | Типографічні правила (лапки, тире тощо) |
| `@tiptap/extension-unique-id` | Унікальні ID для нод (опціонально) |
| `@tiptap/extension-horizontal-rule` | Горизонтальна лінія (extended) |
| `@tiptap/extension-invisible-characters` | Відображення невидимих символів (break marks) |
| `@tiptap/extension-list` | Списки (TaskList/TaskItem) |
| `@tiptap/extension-node-range` | Виділення діапазону нод |
| `@tiptap/extension-drag-handle` / `drag-handle-vue-3` | Drag handle для блоків |
| `@tiptap/extension-collaboration` | Collaborative editing через Yjs |
| `@tiptap/suggestion` | Autocomplete suggestions (використовується mention) |
| `@tiptap/pm` | ProseMirror re-exports |
| `@tiptap/y-tiptap` | Yjs + Tiptap інтеграція |

## Кастомні extensions (`src/extensions/`)

### Extensions з окремими директоріями (Node з Vue NodeView)

| Extension | Тип | Файл | Опис |
|-----------|-----|------|------|
| `audio` | Node | `audio/index.js` | Вставка аудіофайлів з плеєром |
| `callout` | Node | `callout/index.js` | Callout блоки з іконкою та кольоровим тлом |
| `code-block` | Node | `code-block/index.js` | Блок коду з підсвіткою (lowlight), word wrap, copy |
| `columns` | Node | `columns/index.js` | Багатоколонковий layout |
| `datetime` | Node | `datetime/index.js` | Вставка дати/часу |
| `echarts` | Node | `echarts/index.js` | Вбудовані графіки ECharts |
| `file` | Node | `file/index.js` | Вставка файлів з preview та download |
| `foonotes` | Node | `foonotes/index.js` | Виноски (footnotes): Footnotes, FootnoteReference, Footnote |
| `iframe` | Node | `iframe/index.js` | Вбудовані web-сторінки (Figma, Bilibili тощо) |
| `image` | Node | `image/index.js` | BlockImage + InlineImage з drag, resize, crop |
| `mention` | Node | `mention/index.js` | @mentions з suggestion popup |
| `office-paste` | Extension | `office-paste/index.js` | Обробка paste з MS Office (HTML cleanup) |
| `option-box` | Node | `option-box/index.js` | Checkbox / radio option boxes |
| `tag` | Node | `tag/index.js` | Inline tags з кольором |
| `text-box` | Node | `text-box/index.js` | Floating text box з border та drag |
| `toc` | Node | `toc/index.js` | Inline table of contents block |
| `video` | Node | `video/index.js` | Вставка відео з плеєром |

### Standalone extensions (один файл)

| Extension | Тип | Файл | Опис |
|-----------|-----|------|------|
| `bookmark` | Mark | `bookmark.js` | Закладки в документі |
| `break-marks` | Extension | `break-marks.js` | Invisible characters (пробіли, переноси) |
| `bullet-list` | Node | `bullet-list.js` | Extends BulletList (8 типів маркерів) |
| `file-handler` | Extension | `file-handler.js` | Обробка paste/drop файлів |
| `format-painter` | Extension | `format-painter.js` | Копіювання формату (як у Word) |
| `horizontal-rule` | Node | `horizontal-rule.js` | Горизонтальна лінія (extended) |
| `indent` | Extension | `indent.js` | Відступи (indent/outdent) |
| `letter-spacing` | Mark | `letter-spacing.js` | Міжсимвольний інтервал |
| `line-height` | Extension | `line-height.js` | Міжрядковий інтервал |
| `margin` | Extension | `margin.js` | Margin для блокових елементів |
| `node-align` | Extension | `node-align.js` | Вирівнювання нод (block-level) |
| `node-select` | Extension | `node-select.js` | Виділення та операції з нодами |
| `ordered-list` | Node | `ordered-list.js` | Extends OrderedList (6 типів нумерації) |
| `page-break` | Node | `page-break.js` | Розрив сторінки |
| `search-replace` | Extension | `search-replace.js` | Пошук та заміна в документі |
| `selection` | Extension | `selection.js` | Кастомне виділення |
| `text-align` | Extension | `text-align.js` | Extends TextAlign (додано `distributed`) |
| `type-writer` | Extension | `type-writer.js` | Typewriter effect (анімація друку) |
| `word-wrap` | Extension | `word-wrap.js` | Word wrap toggle для code blocks |

## Паттерн створення нового extension

### Block Node з Vue NodeView (типовий)

```
src/extensions/my-node/
  ├── index.js        # Node.create({ ... addNodeView: VueNodeViewRenderer })
  └── node-view.vue   # Vue component для рендерингу в редакторі
```

**index.js** — визначає schema (group, content, attributes, parseHTML, renderHTML), commands, input rules.

**node-view.vue** — Vue component, що отримує `node`, `updateAttributes`, `deleteNode` як props від `NodeViewWrapper`.

Приклад (callout):
```js
// src/extensions/callout/index.js
import { Node, wrappingInputRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import NodeView from './node-view.vue'

export default Node.create({
  name: 'callout',
  group: 'block',
  content: 'paragraph+',
  addAttributes() {
    return {
      type: { default: 'primary' },
      icon: { default: '⭐️' },
      backgroundColor: { default: 'rgb(217, 231, 255)' },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(NodeView)
  },
  addCommands() {
    return {
      insertCallout: (options) => ({ chain }) => {
        return chain().insertContent({ type: this.name, attrs: options, content: [{ type: 'paragraph' }] }).run()
      },
    }
  },
})
```

### Inline Node (atom)

Для елементів типу tag, datetime — `group: 'inline'`, `inline: true`, `atom: true`.

### Extension (без DOM)

Для функцій типу indent, format painter — `Extension.create({ ... })` з `addGlobalAttributes()` або `addCommands()`.

### Extending existing Tiptap extension

Для модифікації вбудованих — `.extend({ ... })`:
```js
export default BulletList.extend({
  addAttributes() { ... },  // Додати нові атрибути
})
```

## Як додати extension до toolbar

Після створення extension, потрібно:
1. Зареєструвати його в `src/extensions/index.js` (у `extensions` map або `buildInExtensions`)
2. Додати UI компонент меню в `src/components/menus/toolbar/{category}/`
3. Якщо потрібне bubble menu — додати в `src/components/menus/bubble/`
4. Додати переклади в `src/locales/*.json`
