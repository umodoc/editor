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

Pre-commit hooks (Husky + lint-staged) run `oxfmt` then `oxlint` on staged `*.{js,vue,scss}` files automatically.

## Code Style

- **Formatter**: Oxfmt — no semicolons, single quotes, 2-space indent, 80-char line width
- **Linter**: Oxlint (Rust-based, not ESLint)
- **Types**: JSDoc annotations — this project does NOT use TypeScript. No `.ts` files.
- **Styles**: SCSS using `@use` module system (not `@import`) — includes are namespaced, e.g. `@include mixins.umo-scrollbar`. TDesign vendor styles compile via a LESS bridge in `tdesign-vendor.less`; TDesign component overrides live in `tdesign-overrides.scss`

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
- **Constants directory**: `src/constants/` holds fixed values that are no longer user-configurable (e.g. `PRINT_PAGE_LAYOUT`). Use it for hardcoded defaults extracted from options.
- **Removing a config option touches 4 places**: `src/options/schema.js` (validation), `src/options/config/index.js` (default), `src/options/config/dicts.js` (dict lists if applicable), and `src/locales/en-US.json` (labels)
- **Toolbar tab visibility**: `toolbar.menus` array in config controls which tabs render — omit a name (e.g. `'page'`) to hide its tab entirely; order in the array determines display order

## Component & Extension Patterns

- Vue SFCs use `<template>`, `<script setup>`, `<style lang="scss">` block order
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
