import App from './app.vue'
import generateId from '@/utils/generate-id'
import 'katex/dist/katex.min.css'

// 插件本地开发
import { useUmoEditor, UmoEditor } from './components'

// 插件打包测试
// import UmoEditor from '../dist/es/umo-editor'

const app = createApp(App)

// @umodoc/editor
const options = {
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
  },
  document: {
    title: '测试文档',
    content: localStorage.getItem('document.content'),
  },
  templates: [
    {
      title: '工作任务',
      description: '工作任务模板',
      content: '<p>工作任务</p>',
    },
    {
      title: '工作周报',
      description: '工作周报模板',
      content: '<h2>工作任务</h2>',
    },
  ],
  shareUrl: 'https://xx.com/?id=1',
  cdnUrl: location.origin,
  onSave(content, page, document) {
    console.log('onSave', { content, page, document })
    localStorage.setItem('document.content', document.content)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (true) {
          resolve('操作成功')
        } else {
          reject('操作失败')
        }
      }, 2000)
    })
  },

  async onFileUpload(file) {
    if (!file) throw new Error('没有找到要上传的文件')
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: generateId(),
      url: file.url || URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
}
// app.use(useUmoEditor, options)
app.component('UmoEditor', UmoEditor)

app.mount('#app')
