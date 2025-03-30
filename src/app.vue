<template>
  <div class="examples">
    <div class="box">
      <umo-editor ref="editorRef" v-bind="options" />
    </div>
    <!-- <div class="box">
      <umo-editor editor-key="testaaa" :toolbar="{ defaultMode: 'classic' }" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'

const editorRef = $ref(null)
const templates = [
  {
    title: '工作任务',
    description: '工作任务模板',
    content:
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>',
  },
  {
    title: '工作周报',
    description: '工作周报模板',
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
  },
]
const options = $ref({
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
  },
  document: {
    title: '测试文档',
    content: localStorage.getItem('document.content') ?? '<p>测试文档</p>',
    characterLimit: 10000,
  },
  page: {
    showBookmark: true,
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  assistant: {
    enabled: true,
  },
  user: {
    id: 'umoeditor',
    label: 'Umo Editor',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  users: [
    { id: 'umodoc', label: 'Umo Team' },
    { id: 'Cassielxd', label: 'Cassielxd' },
    { id: 'Goldziher', label: "Na'aman Hirschfeld" },
    { id: 'SerRashin', label: 'SerRashin' },
    { id: 'ChenErik', label: 'ChenErik' },
    { id: 'china-wangxu', label: 'china-wangxu' },
    { id: 'Sherman Xu', label: 'xuzhenjun130' },
    { id: 'testuser', label: '测试用户' },
  ],
  async onSave(content: string, page: number, document: { content: string }) {
    localStorage.setItem('document.content', document.content)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true
        if (success) {
          console.log('onSave', { content, page, document })
          resolve('操作成功')
        } else {
          reject(new Error('操作失败'))
        }
      }, 2000)
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url ?? URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  onFileDelete(id: string, url: string) {
    console.log(id, url)
  },
  onCustomEChartSettings(data: any, config: any) {
    return null
  },
  async onAssistant() {
    return await Promise.resolve('<p>AI助手测试</p>')
  },
  async onCustomImportWordMethod() {
    return await Promise.resolve({
      value: '<p>测试导入word</p>',
    })
  },
})
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.examples {
  margin: 20px;
  display: flex;
  height: calc(100vh - 40px);
}
.box {
  border: solid 1px #ddd;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
