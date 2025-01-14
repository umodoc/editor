<template>
  <menus-button
    v-if="options.toolbar?.importWord?.enabled"
    ico="word"
    :text="t('base.importWord.text')"
    huge
    @menu-click="importWord"
  />
</template>

<script setup lang="ts">
const { editor, options } = useStore()

// 动态导入 mammoth.js
onMounted(() => {
  const mammothScriptElement = document.querySelector('#mammoth-script')
  if (
    mammothScriptElement === null &&
    options.value.toolbar?.importWord.enabled
  ) {
    const style = document.createElement('script')
    style.src = `${options.value.cdnUrl}/libs/mammoth/mammoth.browser.min.js`
    style.id = 'mammoth-script'
    document.querySelector('head')?.append(style)
  }
})

const importWord = () => {
  // @ts-expect-error, global variable injected by script
  if (!mammoth) {
    const dialog = useAlert({
      theme: 'warning',
      header: t('base.importWord.loadScript.title'),
      body: t('base.importWord.loadScript.message'),
      onConfirm() {
        dialog.destroy()
      },
    })
    return
  }
  const { open, onChange } = useFileDialog({
    accept: '.docx',
    reset: true,
    multiple: false,
  })
  // 打开文件对话框
  open()
  // 插入文件
  onChange(async (files: FileList | null) => {
    const [file] = Array.from(files ?? [])
    if (!file) {
      return
    }
    if (file.size > 1024 * 1024 * 5) {
      useMessage('error', t('base.importWord.limitSize'))
      return
    }
    const message = await useMessage('loading', t('base.importWord.converting'))

    // 使用用户自定义导入方法
    if (options.value.toolbar?.importWord?.useCustomMethod) {
      const result =
        await options.value.toolbar?.importWord.onCustomImportWordMethod?.(file)
      message.close()
      try {
        if (result?.messages?.type === 'error') {
          useMessage(
            'error',
            `${t('base.importWord.convertError')} (${result.messages.message})`,
          )
          return
        }
        if (result?.value) {
          editor.value?.commands.setContent(result.value)
        } else {
          useMessage('error', t('base.importWord.importError'))
        }
      } catch {
        useMessage('error', t('base.importWord.importError'))
      }
      return
    }

    // 默认使用 Mammoth 导入
    const arrayBuffer = file.arrayBuffer()
    // @ts-expect-error, global variable injected by script
    if (!mammoth) {
      return
    }
    // @ts-expect-error, global variable injected by script
    const { messages, value } = await mammoth.convertToHtml(
      { arrayBuffer },
      options.value.toolbar?.importWord.options,
    )
    message.close()
    if (messages.type === 'error') {
      useMessage(
        'error',
        `${t('base.importWord.convertError')} (${messages.message})`,
      )
      return
    }
    try {
      // 解析和加工 Mammoth 返回的 HTML 内容
      const domparser = new DOMParser()
      const doc = domparser.parseFromString(value, 'text/html')
      for (const img of doc.querySelectorAll('img')) {
        const parent = img.parentElement
        if (parent?.tagName === 'P') {
          parent.insertAdjacentElement('beforebegin', img)
          if (!parent.hasChildNodes() && parent.textContent === '') {
            parent.remove()
          }
        }
      }
      const content = doc.body.innerHTML.toString()
      editor.value?.commands.setContent(content)
    } catch {
      useMessage('error', t('base.importWord.importError'))
    }
  })
}
</script>
