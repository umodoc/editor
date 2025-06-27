import 'virtual:svg-icons-register'
import UmoEditor from './index.vue'
import UmoMenuButton from './menus/button.vue'
import UmoDialog from './modal.vue'
import UmoTooltip from './tooltip.vue'
import type { UmoEditorOptions } from '@/types'
const useUmoEditor = {
  install: (app: any, options: UmoEditorOptions) => {
    app.provide('defaultOptions', options)
    app.component(UmoEditor.name ?? 'UmoEditor', UmoEditor)
  },
}

export {
  UmoEditor as default,
  UmoDialog,
  UmoEditor,
  UmoMenuButton,
  UmoTooltip,
  useUmoEditor,
}
