import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    typewriter: {
      /**
       * 启动打字机效果
       */
      startTypewriter: (content: any, options: TypewriterOptions) => ReturnType
      /**
       * 停止打字机效果
       */
      stopTypewriter: () => ReturnType
      /**
       * 获取当前打字机状态
       */
      getTypewriterState: () => any
    }
  }
}

interface TypewriterOptions {
  speed?: number
  step?: number
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

interface TypewriterState {
  isRunning: boolean
  currentParagraph: number
  currentTextNode: number
  currentChar: number
}

interface TypewriterProgress {
  totalChars: number
  typedChars: number
}

const typewriterState = ref({
  isRunning: false,
  currentParagraph: 0,
  currentTextNode: 0,
  currentChar: 0,
})

let typewriterTimer: NodeJS.Timeout | null = null
let typewriterProgress: TypewriterProgress = {
  totalChars: 0,
  typedChars: 0,
}

// 计算总字符数用于进度跟踪
function calculateTotalChars(content: any[]): number {
  return content.reduce((total, node) => {
    if (node.type === 'paragraph' && node.content) {
      return node.content.reduce((paraTotal: number, textNode: any) => {
        return (
          paraTotal +
          (textNode.type === 'text' ? textNode.text?.length || 0 : 0)
        )
      }, total)
    }
    return total
  }, 0)
}

export default Extension.create({
  name: 'typewriter',
  addCommands() {
    return {
      startTypewriter:
        (content, options) =>
        ({ editor, commands }) => {
          // 立即返回 true 表示命令开始执行

          ;(async () => {
            try {
              // 清除现有计时器
              if (typewriterTimer) {
                clearTimeout(typewriterTimer)
                typewriterTimer = null
              }

              // 重置状态
              typewriterState.value = {
                isRunning: true,
                currentParagraph: 0,
                currentTextNode: 0,
                currentChar: 0,
              }

              // 计算总字符数
              typewriterProgress = {
                totalChars: calculateTotalChars(content?.content ?? []),
                typedChars: 0,
              }
              // 插入内容
              const typeWriterInsertContent = async (curContent: any) => {
                await new Promise<void>((resolve) => {
                  setTimeout(() => {
                    try {
                      editor
                        .chain()
                        .insertContent(curContent)
                        .focus('end', {
                          scrollIntoView: true,
                        })
                        .run()
                    } catch (e) {}
                    resolve()
                  }, 0)
                })
              }
              // 取非负数
              const speed = Math.max(options?.speed ?? 1, 0)
              // 处理内容
              const processNode = async (node: any, isTopLevel = false) => {
                if (node.type === 'paragraph') {
                  // 当前为段落时 插入段落样式
                  await typeWriterInsertContent([
                    { type: 'paragraph', attrs: node.attrs },
                  ])
                  // 处理段落内容
                  if (node.content && node.content.length > 0) {
                    for (const [index, childNode] of node.content.entries()) {
                      typewriterState.value.currentTextNode = index
                      await processNode(childNode)
                    }
                  } else {
                    editor.commands.enter()
                  }
                  typewriterState.value.currentParagraph++
                } else if (node.type === 'text') {
                  // 处理文本节点
                  const text = node.text || ''
                  const marks = node.marks || []
                  const step = options?.step ?? 1
                  for (let i = 0; i < text.length; i += step) {
                    if (!typewriterState.value.isRunning) return // 检查是否被停止
                    const endIndex = Math.min(i + step, text.length)
                    const currentText = text.slice(i, endIndex)
                    await new Promise<void>((resolve) => {
                      typewriterTimer = setTimeout(async () => {
                        // 插入当前字符
                        await typeWriterInsertContent([
                          {
                            type: 'text',
                            text: currentText,
                            marks,
                          },
                        ])

                        typewriterState.value.currentChar =
                          i + currentText.length - 1
                        typewriterProgress.typedChars += currentText.length

                        // 更新进度回调
                        if (
                          options?.onProgress &&
                          typewriterProgress.totalChars > 0
                        ) {
                          options.onProgress(
                            typewriterProgress.typedChars /
                              typewriterProgress.totalChars,
                          )
                        }

                        resolve()
                      }, speed)
                    })
                  }
                } else if (node.type === 'table') {
                  await typeWriterInsertContent([node, { type: 'paragraph' }])
                  editor.commands.enter()
                } else {
                  if (isTopLevel) {
                    await typeWriterInsertContent([node, { type: 'paragraph' }])
                  } else {
                    await typeWriterInsertContent([node])
                  }
                }
              }
              // 结束当前事务（确保之前的修改已应用）
              editor.view.dispatch(editor.state.tr) // 应用一个空事务来确保状态更新
              // 处理所有顶级节点
              for (const node of content?.content ?? []) {
                if (!typewriterState.value.isRunning) break
                await processNode(node, true)
              }
              // 完成回调
              if (typewriterState.value.isRunning && options?.onComplete) {
                options.onComplete()
              }
              typewriterState.value.isRunning = false
            } catch (e) {}
          })()
          return true
        },

      stopTypewriter: () => () => {
        typewriterState.value.isRunning = false
        if (typewriterTimer) {
          clearTimeout(typewriterTimer)
          typewriterTimer = null
        }
        return true
      },

      getTypewriterState: () => () => {
        return {
          isRunning: typewriterState.value.isRunning,
          currentParagraph: typewriterState.value.currentParagraph,
          currentTextNode: typewriterState.value.currentTextNode,
          currentChar: typewriterState.value.currentChar,
        }
      },
    }
  },
})

export const getTypewriterRunState = () => {
  return typewriterState.value.isRunning
}
