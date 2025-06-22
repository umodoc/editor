import type { UmoEditorOptions } from '@/types'

import App from './app.vue'
import { useUmoEditor } from './components'
const app = createApp(App)

const options = {}

app.use(useUmoEditor, options as UmoEditorOptions)

app.mount('#app')
