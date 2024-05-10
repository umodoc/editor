<template>
  <div class="box">
    <umo-editor ref="editorRef" v-bind="options" @save="onSave" />
    <button @click="setPage">设置页面信息</button>
  </div>
</template>

<script setup>
import generateId from '@/utils/generate-id'
const editorRef = $ref(null)
const onSave = async (content, page, document) => {
  localStorage.setItem('document.content', document.content)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true
      if (success) {
        console.log('onSave', { content, page, document })
        resolve('操作成功')
      } else {
        reject('操作失败')
      }
    }, 2000)
  })
}
const options = $ref({
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
  },
  document: {
    // title: '测试文档',
    // content: localStorage.getItem('document.content') || '<p>测试文档</p>',
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
  // shareUrl: 'https://xx.com/?id=1',
  cdnUrl: location.origin,
  file: {
    allowedMimeTypes: ['image/svg+xml', 'video/mp4', 'audio/*'],
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
})

const setPage = () => {
  editorRef.setPage({
    size: 'A5',
    background: 'rgb(233, 246, 227)',
  })
}
</script>

<style>
.box {
  margin: 50px;
  height: 500px;
  border: solid 1px #ddd;
  position: relative;
}
</style>
