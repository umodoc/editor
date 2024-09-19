import 'virtual:svg-icons-register'

import type { UmoEditorOptions } from '@/types'

import UmoEditor from './index.vue'
import UmoMenuButton from './menus/button.vue'
import UmoDialog from './modal.vue'
import UmoTooltip from './tooltip.vue'

const useUmoEditor = {
  install: (app: any, options: UmoEditorOptions) => {
    // 组件配置
    const { setOptions } = useStore()
    setOptions(options)
    // 使用组件
    app.component(UmoEditor.name ?? 'UmoEditor instance', UmoEditor)
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
