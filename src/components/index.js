import 'virtual:svg-icons-register'
import UmoEditor from './index.vue'

const useUmoEditor = {
  install: (app, options) => {
    // 组件配置
    const { setOptions } = useStore()
    setOptions(options)

    // 使用组件
    app.component(UmoEditor.name, UmoEditor)
  },
}

export { UmoEditor as default, useUmoEditor, UmoEditor }
