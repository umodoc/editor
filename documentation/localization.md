# Localization — Umo Editor

## Архітектура i18n

Umo Editor використовує **vue-i18n** у composition mode (non-legacy).

### Ініціалізація

```
src/i18n.js
  └── createI18n({
        legacy: false,
        locale: 'en-US',          // Default locale
        defaultLocale: 'en-US',
        messages: { 'en-US': ... }
      })
```

Instance `i18n` імпортується у `src/composables/i18n.js`, який надає auto-imported хелпери.

### Composable API

```js
t(key)           // Стандартний переклад: t('toolbar.base') → "Home"
l(data)          // Locale-aware label: l('Bold') → 'Bold' (accepts plain string)
useI18n()        // Повний vue-i18n global instance (locale, mergeLocaleMessage тощо)
```

`l()` використовується для даних із конфігурації (dicts, webPages тощо), де label є plain string.

### Custom translations

Користувач може передати додаткові переклади через опцію `translations`:
```js
{
  translations: {
    en_US: { myKey: 'My translation' },
  }
}
```
Вони мержаться при ініціалізації через `mergeLocaleMessage()`.

## Файли локалей

| Файл | Мова | Статус |
|------|------|--------|
| `src/locales/en-US.json` | Англійська | Повний (default) |
| `src/locales/ru-RU.json` | Російська | Частковий |
| `src/locales/it-IT.json` | Італійська | Частковий |
| `src/locales/bo.json` | Тибетська | Частковий |

Тільки `en-US` вбудований у i18n instance при ініціалізації. Інші мови — community contributions, потребують додаткового підключення.

## Структура translation keys

Top-level секції JSON файлу:

| Key | Опис | Приклад |
|-----|------|---------|
| `welcome` | Console copyright message | `"Thanks for using Umo Editor..."` |
| `toolbar` | Назви toolbar tabs | `toolbar.base` → "Home" |
| `base` | Toolbar Home tab items | `base.bold` → "Bold" |
| `insert` | Toolbar Insert tab items | `insert.image.title` → "Image" |
| `table` | Toolbar Table tab items | `table.insert` → "Insert Table" |
| `tools` | Toolbar Tools tab items | `tools.math.title` → "Math" |
| `page` | Toolbar Page tab items | `page.size.title` → "Page Size" |
| `view` | Toolbar View tab items | `view.theme` → "Theme" |
| `export` | Toolbar Export tab items | `export.pdf` → "Export as PDF" |
| `list` | List types | `list.ordered`, `list.bullet` |
| `colorPicker` | Color picker UI | `colorPicker.recent` → "Recent" |
| `blockMenu` | Block menu items | `blockMenu.delete` → "Delete" |
| `bubbleMenu` | Bubble menu items | `bubbleMenu.image.edit` → "Edit" |
| `pageOptions` | Page option labels | `pageOptions.margin` → "Margin" |
| `document` | Document-level texts | `document.headingPlaceholder` |
| `search` | Search & replace | `search.find`, `search.replace` |
| `toc` | Table of contents | `toc.show`, `toc.hide` |
| `spellcheck` | Spellcheck | `spellcheck.enable`, `spellcheck.disable` |
| `shortcut` | Keyboard shortcuts | `shortcut.title` |
| `changeLocale` | Locale change dialog | `changeLocale.title`, `changeLocale.message` |
| `resetAll` | Reset dialog | `resetAll.title`, `resetAll.message` |
| `about` | About dialog | `about.version` |
| `layout` | Єдиний web-layout (підпис у статус-барі) | `layout.web` |
| `wordCount` | Word count | `wordCount.characters`, `wordCount.selection` |
| `preview` | Preview mode | `preview.title`, `preview.disable` |
| `fullscreen` | Fullscreen | `fullscreen.title`, `fullscreen.disable` |
| `zoom` | Zoom controls | `zoom.zoomIn`, `zoom.zoomOut`, `zoom.reset` |
| `node` | Node operations | `node.delete`, `node.duplicate` |
| `file` | File operations | `file.upload`, `file.download` |
| `callout` | Callout | `callout.types.*` |
| `mention` | Mentions | `mention.noResults` |
| `save` | Save states | `save.saving`, `save.success`, `save.failed` |
| `print` | Print | `print.title` |
| `dialog` | Dialog buttons | `dialog.cancel`, `dialog.confirm` |
| `copy` | Copy operations | `copy.copyFailed`, `copy.notSupported` |
| `officePaste` | Office paste | `officePaste.*` |

## Locale-aware labels у конфігурації

Dicts та деякі інші опції використовують простий рядковий формат:
```js
{
  label: 'Default Font',
  value: null,
}
```

Функція `l()` з `src/composables/i18n.js` повертає рядок напряму. Schema validation перевіряє, що label є string.

## Як додати нову мову

1. Створи `src/locales/{lang-code}.json` (скопіюй `en-US.json` як шаблон)
2. Переклади всі ключі
3. Зареєструй у `src/i18n.js`:
   ```js
   import newLang from './locales/{lang-code}.json'
   // Додай до messages: { '{lang-code}': newLang }
   ```
4. Додай валідацію locale у `src/options/schema.js` (розшир список `['en-US', ...]`)
5. Додай пункт у language switcher у `src/components/statusbar/index.vue` (масив `langs`)
6. Якщо TDesign має переклад для цієї мови — додай до `localeConfig` у `src/components/index.vue`

## Як додати/змінити переклад

1. Знайди ключ у `src/locales/en-US.json`
2. Зміни значення
3. Переконайся, що ключ присутній у всіх locale файлах
4. Для interpolation використовуй `{variable}`: `"Hello, {name}"`
