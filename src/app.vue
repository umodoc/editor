<template>
  <div class="examples">
    <div class="box">
      <umo-editor ref="editorRef" v-bind="options"></umo-editor>
    </div>
    <!-- <div class="box">
      <umo-editor editor-key="testaaa" :toolbar="{ defaultMode: 'classic' }" />
    </div> -->
  </div>
</template>

<script setup>
import { shortId } from '@/utils/short-id'

const editorRef = $ref(null)
const templates = [
  {
    title: 'Work Task',
    description: 'Work task template',
    content:
      '<h1>Work Task</h1><h3>Task Name:</h3><p>[Brief description of the task]</p><h3>Owner:</h3><p>[Name of the person responsible]</p><h3>Due Date:</h3><p>[Date the task must be completed]</p><h3>Task Details:</h3><ol><li>[Step 1]</li><li>[Step 2]</li><li>[Step 3]...</li></ol><h3>Goal:</h3><p>[Specific outcome or result expected]</p><h3>Notes:</h3><p>[Any additional information or caveats]</p>',
  },
  {
    title: 'Weekly Report',
    description: 'Weekly work report template',
    content:
      '<h1>Weekly Report</h1><h2>Summary This Week</h2><hr /><h3>Completed:</h3><ul><li>[Task 1]: [Brief description and outcome]</li><li>[Task 2]: [Brief description and outcome]</li><li>...</li></ul><h3>In Progress:</h3><ul><li>[Task 1]: [Current progress and next steps]</li><li>[Task 2]: [Current progress and next steps]</li><li>...</li></ul><h3>Blockers:</h3><ul><li>[Issue 1]: [Description and proposed resolution]</li><li>[Issue 2]: [Description and proposed resolution]</li><li>...</li></ul><hr /><h2>Plan for Next Week</h2><h3>Planned Work:</h3><ul><li>[Task 1]: [Brief description]</li><li>[Task 2]: [Brief description]</li><li>...</li></ul><h3>Resources Needed:</h3><ul><li>[Resource 1]: [Description]</li><li>[Resource 2]: [Description]</li><li>...</li></ul>',
  },
]
const options = $ref({
  // theme: 'auto',
  // skin: 'modern',
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
  },
  document: {
    title: 'Test Document',
    content: localStorage.getItem('document.content') || '<p>Test document</p>',
    // structure: 'heading block*',
  },
  page: {
    layouts: ['web'],
    showBookmark: true,
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://www.umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  user: {
    id: 'umoeditor',
    label: 'Umo Editor',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  users: [
    {
      id: 'umodoc',
      label: 'Umo Team',
      bio: 'Core developer',
      avatar: 'https://s1.umodoc.com/images/favicon.png',
      color: 'var(--umo-primary-color)',
    },
    {
      id: 'china-wangxu',
      label: 'china-wangxu',
      bio: 'Key contributor',
      color: 'var(--umo-primary-color)',
    },
    {
      id: 'Cassielxd',
      label: 'Cassielxd',
      bio: 'Key contributor',
      color: 'var(--umo-primary-color)',
    },
    { id: 'Goldziher', label: "Na'aman Hirschfeld" },
    { id: 'SerRashin', label: 'SerRashin' },
    { id: 'ChenErik', label: 'ChenErik' },
    { id: 'china-wangxu', label: 'china-wangxu' },
    { id: 'Sherman Xu', label: 'xuzhenjun130' },
    { id: 'testuser', label: 'Test User' },
  ],
  // Demo-only extras (merged with fork defaults in config/index.js)
  // disableExtensions: ['math'],
  async onSave(content, page, document) {
    localStorage.setItem('document.content', content.html)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('onSave', { content, page, document })
        resolve('Document saved successfully')
      }, 2000)
    })
  },
  async onFileUpload(file) {
    if (!file) {
      throw new Error('No file found to upload')
    }
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url || URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  onFileDelete(id, url, type) {
    console.log(id, url, type)
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
