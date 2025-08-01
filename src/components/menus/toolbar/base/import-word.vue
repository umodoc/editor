<template>
  <menus-button
    ico="word"
    :text="t('base.importWord.text')"
    huge
    @menu-click="importWord"
  />
</template>

<script setup lang="ts">
const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const $options = options.value.importWord

// 动态导入 mammoth.js
onMounted(() => {
  const mammothScriptElement = document.querySelector('#mammoth-script')
  if (mammothScriptElement === null && $options.enabled) {
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
      attach: container,
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
    if (file.size > $options.maxSize) {
      useMessage('error', {
        attach: container,
        content: t('base.importWord.limitSize', {
          limitSize: $options.maxSize / (1024 * 1024),
        }),
      })
      return
    }
    const message = await useMessage('loading', {
      attach: container,
      content: t('base.importWord.converting'),
    })

    // 使用用户自定义导入方法
    if ($options?.useCustomMethod) {
      const result = await $options.onCustomImportMethod?.(file)
      message.close()
      try {
        if (result?.messages?.type === 'error') {
          useMessage('error', {
            attach: container,
            content: `${t('base.importWord.convertError')} (${result.messages.message})`,
          })
          return
        }
        if (result?.value) {
          editor.value?.commands.setContent(result.value)
        } else {
          useMessage('error', {
            attach: container,
            content: t('base.importWord.importError'),
          })
        }
      } catch {
        useMessage('error', {
          attach: container,
          content: t('base.importWord.importError'),
        })
      }
      return
    }

    // @ts-expect-error, global variable injected by script
    if (!mammoth) {
      return
    }
    // 使用 Mammoth 导入
    const arrayBuffer = file.arrayBuffer()
    // 一些配置默认
    const customOptions = {
      transformConvertRun(run: any) {
        const resultRun: any = {}
        if (run.bgColor) {
          resultRun['mark'] = {
            style: `background-color:${run.bgColor}; color: inherit`,
            'data-color': run.bgColor,
          }
        }
        return resultRun
      },
      styleMap: [
        "p[style-name='引用'] => blockquote.blockquote > p:fresh",
        "p[style-name='blockquote'] => blockquote.blockquote > p:fresh",
        "p[style-name='BlockQuote'] => blockquote.blockquote > p:fresh",
        "p[style-name='代码块'] => pre.preCode > code:fresh",
        "p[style-name='Code'] => pre.preCode > code:fresh",
        "p[style-name='code'] => pre.preCode > code:fresh",
      ],
    }
    // @ts-expect-error, global variable injected by script
    const { messages, value } = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        ...customOptions,
        ...$options.options,
      },
    )
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
      message.close()
    } catch {
      useMessage('error', {
        attach: container,
        content: t('base.importWord.importError'),
      })
    }
  })
}
</script>
