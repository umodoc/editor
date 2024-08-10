<template>
  <menus-button
    v-if="options.toolbar.importWord.enabled"
    ico="word"
    :text="t('base.importWord.text')"
    huge
    @menu-click="importWord"
  />
</template>

<script setup>
import { convertToHtml } from 'mammoth'
const { editor, options } = useStore()

const importWord = () => {
  const { open, onChange } = useFileDialog({
    accept: '.docx',
    reset: true,
    multiple: false,
  })
  // 打开文件对话框
  open()
  // 插入文件
  onChange(async (files) => {
    const file = Array.from(files)[0]
    if (!file) {
      return
    }
    if (file.size > 1024 * 1024 * 5) {
      useMessage('error', t('base.importWord.limitSize'))
      return
    }
    let message = await useMessage(
      'loading',
      t('base.importWord.converting'),
      0,
    )

    // 使用用户自定义导入方法
    if (options.value.toolbar.importWord.useCustomMethod) {
      const result = await options.value.onCustomImportWordMethod(file)
      message.close()
      try {
        if (result?.messages?.type === 'error') {
          useMesssage(
            'error',
            `${t('base.importWord.convertError')} (${messages.message})`,
          )
          return
        }
        if (result?.value) {
          editor.value.commands.setContent(result.value)
        } else {
          useMessage('error', t('base.importWord.importError'))
        }
      } catch (error) {
        useMessage('error', t('base.importWord.importError'))
      }
      return
    }

    // 默认使用 Mammoth 导入
    const arrayBuffer = file.arrayBuffer()
    const { messages, value } = await convertToHtml(
      { arrayBuffer },
      options.value.toolbar.importWord.options,
    )
    message.close()
    if (messages.type === 'error') {
      useMesssage(
        'error',
        `${t('base.importWord.convertError')} (${messages.message})`,
      )
      return
    }
    try {
      // 解析和加工 Mammoth 返回的 HTML 内容
      let domparser = new DOMParser()
      let doc = domparser.parseFromString(value, 'text/html')
      doc.querySelectorAll('img').forEach((img) => {
        const parent = img.parentElement
        if (parent.tagName === 'P') {
          parent.insertAdjacentElement('beforebegin', img)
          if (!parent.hasChildNodes() && parent.textContent === '') {
            parent.remove()
          }
        }
      })
      const content = doc.body.innerHTML.toString()
      editor.value.commands.setContent(content)
    } catch (error) {
      useMessage('error', t('base.importWord.importError'))
    }
  })
}
</script>
