<template>
  <menus-button
    ico="file-json"
    :text="t('export.json.import')"
    huge
    @menu-click="importJSON"
  />
</template>

<script setup>
const editor = inject('editor')

const importJSON = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.multiple = false
  input.onchange = (e) => {
    const file = e?.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = () => {
      let dataSource = ''
      try {
        dataSource = JSON.parse(reader.result)
      } catch (err) {
        console.error(err)
      }
      editor.value?.chain().setContent(dataSource, true).focus().run()
    }
  }
  input.click()
}
</script>
