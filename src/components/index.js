import 'virtual:svg-icons-register'
import UmoEditor from './index.vue'

const useUmoEditor = {
  install: (app, options) => {
    const { setOptions } = useStore()
    setOptions(options)
    // app.config.warnHandler = () => null
    app.component(UmoEditor.name, UmoEditor)
  },
}

export { UmoEditor as default, useUmoEditor, UmoEditor }
