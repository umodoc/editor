---
name: verify
description: Run lint and build in sequence to verify the codebase is clean. Use after making changes to confirm nothing is broken.
disable-model-invocation: false
---

Run these commands in sequence from the project root. Stop and report at the first failure.

1. `npm run lint` — oxlint check with auto-fix
2. `npm run build` — build the library to dist/

If both pass, confirm:
- `dist/umo-editor.js` exists
- `dist/umo-editor.css` exists

If either step fails, show the full error output and identify the affected file(s).
