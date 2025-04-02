// Content Methods 打字机效果方法 開始
let editor: any = null
export const setTypeWriter = (
  _editor: any,
  content: object,
  options = {
    timerCount: 1,
    state: 0, // 0 初始  1刷新  2 停止 3 重新开始 4 清空打字机
  },
) => {
  editor = _editor
  if (options.state === 2 || options.state === 4) {
    typeWriterTimer = null
    return
  } else if (options.state === 3) {
    // 不用初始
  } else {
    // 初始 刷新 都需要重置一下计时器
    typeWriterCurIndex.value = {
      paragraph: 0,
      textNode: 0,
      char: 0,
    }
  }
  typeWriterTimer = setInterval(() => {
    try {
      typeWriterProcess(content)
    } catch (error) {
      console.error('处理过程中出现错误:', error)
      clearInterval(typeWriterTimer)
    }
  }, options.timerCount ?? 1)
}

const typeWriterCurIndex = ref({
  paragraph: 0,
  textNode: 0,
  char: 0,
})
let typeWriterTimer: any = null

const typeWriterProcess = (complexContent: any) => {
  const { paragraph, textNode, char } = typeWriterCurIndex.value
  // 段落执行完成后 终止
  if (paragraph >= complexContent.content.length) {
    clearInterval(typeWriterTimer)
    return
  }
  const currentNode = complexContent.content[paragraph]
  switch (currentNode.type) {
    case 'paragraph':
      {
        console.log(currentNode)
        if (currentNode.content && textNode < currentNode.content.length) {
          const currentTextNode = currentNode.content[textNode]
          // 真正的打字機
          if (currentTextNode.text && currentTextNode.type === 'text') {
            if (char < currentTextNode.text.length) {
              const newText = currentTextNode.text[char]
              const newMarks = currentTextNode.marks || []
              typeWriterInsertContent([
                {
                  type: 'text',
                  marks: newMarks,
                  text: newText,
                },
              ])

              typeWriterCurIndex.value = {
                ...typeWriterCurIndex.value,
                char: char + 1,
              }
            } else {
              typeWriterCurIndex.value = {
                ...typeWriterCurIndex.value,
                textNode: textNode + 1,
                char: 0,
              }
            }
          } else {
            typeWriterInsertContent([currentTextNode])
            typeWriterCurIndex.value = {
              ...typeWriterCurIndex.value,
              textNode: textNode + 1,
              char: 0,
            }
          }
        } else {
          typeWriterInsertContent([{ type: 'paragraph' }])
          typeWriterCurIndex.value = {
            paragraph: paragraph + 1,
            textNode: 0,
            char: 0,
          }
        }
      }
      break
    default:
      {
        typeWriterInsertContent([currentNode, { type: 'paragraph' }])
        // 将光标移动到内容末尾
        const nodeEndPos = editor.value.state.selection.$to.pos
        editor.value.commands.setTextSelection(nodeEndPos)
        typeWriterInsertContent([{ type: 'paragraph' }])
        typeWriterCurIndex.value = {
          paragraph: paragraph + 1,
          textNode: 0,
          char: 0,
        }
      }
      break
  }
}

const typeWriterInsertContent = (curContent: any) => {
  editor.value
    .chain()
    .insertContent(curContent)
    .focus('end', {
      scrollIntoView: true,
      // 增强滚动体验
      scrollMargin: 24, // 留出顶部间距
    })
    .run()
}
// ---打字机效果结束
