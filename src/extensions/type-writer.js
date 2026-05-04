import { Extension } from '@tiptap/core'
import { ref } from 'vue'

const typewriterState = ref({
  isRunning: false,
  currentParagraph: 0,
  currentTextNode: 0,
  currentChar: 0,
})

let typewriterTimer = null
let typewriterProgress = {
  totalChars: 0,
  typedChars: 0,
}

const calculateTotalChars = (content) => {
  return content.reduce((total, node) => {
    if (node.type === 'paragraph' && node.content) {
      return node.content.reduce((paraTotal, textNode) => {
        return (
          paraTotal + (textNode.type === 'text' ? textNode.text?.length : 0)
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
          ;(async () => {
            try {
              if (typewriterTimer) {
                clearTimeout(typewriterTimer)
                typewriterTimer = null
              }

              typewriterState.value = {
                isRunning: true,
                currentParagraph: 0,
                currentTextNode: 0,
                currentChar: 0,
              }

              typewriterProgress = {
                totalChars: calculateTotalChars(content?.content),
                typedChars: 0,
              }
              const focusState =
                options?.focus === null ? null : options?.focus || 'end'
              const typeWriterInsertContent = async (curContent) => {
                await new Promise((resolve) => {
                  setTimeout(() => {
                    try {
                      editor
                        .chain()
                        .insertContent(curContent)
                        .focus(focusState)
                        .run()
                    } catch (e) {}
                    resolve()
                  }, 0)
                })
              }
              const speed = Math.max(options?.speed || 1, 0)

              const isEmptyParagraph = (node) => {
                return (
                  node?.type === 'paragraph' &&
                  (!node.content ||
                    node.content.length === 0 ||
                    (node.content.length === 1 &&
                      node.content[0].type === 'text' &&
                      !node.content[0].text))
                )
              }
              const processNode = async (
                node,
                index,
                nodes,
                isTopLevel = false,
              ) => {
                let resultIndex = 0
                if (node.type === 'paragraph') {
                  if (isEmptyParagraph(node)) {
                    const ParagraphNodes = [node]
                    for (
                      let paragraphIndex = index + 1;
                      paragraphIndex < nodes.length;
                      paragraphIndex++
                    ) {
                      if (isEmptyParagraph(nodes[paragraphIndex])) {
                        ParagraphNodes.push(nodes[paragraphIndex])
                        resultIndex++
                        typewriterState.value.currentParagraph++
                      } else {
                        break
                      }
                    }
                    await typeWriterInsertContent(ParagraphNodes)
                    typewriterState.value.currentParagraph++
                  } else {
                    await typeWriterInsertContent([
                      { type: 'paragraph', attrs: node.attrs },
                    ])
                    if (node.content && node.content.length > 0) {
                      for (
                        let childIndex = 0;
                        childIndex < node.content.length;
                        childIndex++
                      ) {
                        typewriterState.value.currentTextNode = childIndex
                        const childNode = node.content[childIndex]
                        const childResultIndex = await processNode(
                          childNode,
                          childIndex,
                          node.content,
                          false,
                        )
                        childIndex = childIndex + (childResultIndex || 0)
                      }
                    } else {
                      editor.commands.enter()
                    }
                    typewriterState.value.currentParagraph++
                  }
                } else if (node.type === 'text') {
                  const text = node.text || ''
                  const marks = node.marks || []
                  const step = options?.step || 1
                  for (let i = 0; i < text.length; i += step) {
                    if (!typewriterState.value.isRunning) return
                    const endIndex = Math.min(i + step, text.length)
                    const currentText = text.slice(i, endIndex)
                    await new Promise((resolve) => {
                      typewriterTimer = setTimeout(async () => {
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
                  const tableNodes = [node]
                  for (
                    let tableIndex = index + 1;
                    tableIndex < nodes.length;
                    tableIndex++
                  ) {
                    if (isEmptyParagraph(nodes[tableIndex])) {
                      tableNodes.push(nodes[tableIndex])
                      resultIndex++
                    } else {
                      break
                    }
                  }
                  if (tableNodes.length === 1) {
                    tableNodes.push({ type: 'paragraph' })
                  }
                  await typeWriterInsertContent(tableNodes)
                  editor.commands.enter()
                } else {
                  if (isTopLevel) {
                    await typeWriterInsertContent([node, { type: 'paragraph' }])
                  } else {
                    await typeWriterInsertContent([node])
                  }
                }
                return resultIndex
              }
              const contentNodes = content?.content
              for (let i = 0; i < contentNodes.length; i++) {
                if (!typewriterState.value.isRunning) break
                const resultIndex = await processNode(
                  contentNodes[i],
                  i,
                  contentNodes,
                  true,
                )
                i = i + resultIndex
              }
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

      getTypewriterState: () => {
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

export const getTypewriterRunState = () => typewriterState.value.isRunning
