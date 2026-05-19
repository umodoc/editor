import 'virtual:svg-icons-register'
import '@/assets/styles/tdesign-vendor.less'

import UmoEditor from './index.vue'
import UmoMenuButton from './menus/button.vue'
import UmoDialog from './modal.vue'
import UmoTooltip from './tooltip.vue'

const useUmoEditor = {
  install: (app, options) => {
    app.provide('defaultOptions', options || {})
    app.component(UmoEditor.name || 'UmoEditor', UmoEditor)
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
