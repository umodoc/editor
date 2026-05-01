# Umo Editor Fork — Project Wiki

> Це AI-орієнтована документація для форку [Umo Editor](https://github.com/umodoc/editor), адаптованого під потреби **7eminar**.
> Кожен файл покриває одну конкретну область. Завантажуй лише те, що стосується поточного завдання.

## Що це за проєкт

**Umo Editor** — open-source WYSIWYG document editor на базі **Vue 3** + **Tiptap 3** (ProseMirror).
Розповсюджується як npm-пакет `@umoteam/editor` і підключається до Vue-додатків як plugin.
Надає редагування документів у стилі Microsoft Word: форматування, таблиці, зображення, медіа, пагінація, друк, експорт.

## Карта документації

| Файл | Коли читати |
|------|-------------|
| [architecture.md](./architecture.md) | Перед будь-якою роботою з проєктом — high-level огляд, стек, структура `src/`, потік даних |
| [extensions.md](./extensions.md) | При роботі з `src/extensions/`, додаванні нових node/mark типів, зміні поведінки редактора |
| [components.md](./components.md) | При роботі з `src/components/`, зміні UI, toolbar, меню, statusbar |
| [composables-and-state.md](./composables-and-state.md) | При роботі з `src/composables/`, станом, i18n composable, діалогами |
| [options-and-config.md](./options-and-config.md) | При роботі з `src/options/`, зміні дефолтних налаштувань, додаванні нових опцій |
| [build-and-dev.md](./build-and-dev.md) | При зміні Vite конфігурації, auto-import, SVG іконок, збірки, лінтингу |
| [localization.md](./localization.md) | При роботі з `src/locales/`, додаванні нової мови або зміні перекладів |

## Конвенції документації

- **Мова**: технічні терміни англійською, пояснення українською
- **Актуальність**: після суттєвих змін у коді — оновлюй відповідний файл документації
- **On-demand**: не завантажуй всю документацію одразу; cursor rules автоматично підтягують потрібний файл залежно від glob-паттерну файлів, з якими працюєш
