# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Umo Editor — a Vue 3 + Tiptap 3 WYSIWYG document editor published as `@umoteam/editor`. Built as a single ES module library. The comprehensive developer wiki lives in `documentation/`.

## Commands

```bash
npm run dev       # Dev server on port 9000 (auto-opens browser)
npm run build     # Library build → dist/umo-editor.js + dist/umo-editor.css
npm run lint      # Oxlint with auto-fix: oxlint --fix src
npm run format    # Oxfmt with auto-fix: oxfmt --write .
npm run analyzer  # Bundle visualizer
```

Pre-commit hooks (Husky + lint-staged) run `oxfmt` then `oxlint` on staged `*.{js,vue,less}` files automatically.

## Code Style

- **Formatter**: Oxfmt — no semicolons, single quotes, 2-space indent, 80-char line width
- **Linter**: Oxlint (Rust-based, not ESLint)
- **Types**: JSDoc annotations — this project does NOT use TypeScript. No `.ts` files.
- **Styles**: LESS — not SCSS, not plain CSS

## Key Gotchas

- **Library entry** is `src/components/index.js`, NOT `src/main.js` (which is the demo app entry)
- **Build output** is a single `dist/umo-editor.js` + `dist/umo-editor.css`; all dependencies are marked external
- **TDesign Vue Next** components use the `umo-` prefix (not the default `t-`), e.g. `<umo-button>` not `<t-button>`
- **Auto-imports**: Vue, VueUse composables, and all `src/composables/*` are auto-imported via `unplugin-auto-import` — no explicit imports needed in SFCs
- **Component auto-imports**: All `src/components/**` are namespaced by folder via `unplugin-vue-components`
- **SVG icons**: Sourced from `src/assets/icons/`, referenced as `umo-icon-[name]`
- **i18n**: English only (Chinese support was removed); locale files live in `src/locales/`
- **Layout**: Single web layout only (page layout mode was removed)
- **Reactivity sugar**: `$ref`, `$computed`, `$watch` macros are enabled via `unplugin-vue-macros`

## Component & Extension Patterns

- Vue SFCs use `<template>`, `<script setup>`, `<style lang="less">` block order
- Tiptap extensions live in `src/extensions/` — each extension folder contains an `index.js`
- Editor state and shared logic is in `src/composables/` — prefer composables over provide/inject
- Configuration schemas and defaults are in `src/options/`

## Documentation

Detailed wiki for this codebase (architecture, component patterns, extension authoring, config schema):

- `@documentation/architecture.md`
- `@documentation/components.md`
- `@documentation/extensions.md`
- `@documentation/composables-and-state.md`
- `@documentation/options-and-config.md`
- `@documentation/build-and-dev.md`
- `@documentation/localization.md`
