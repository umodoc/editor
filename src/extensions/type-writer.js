import { Extension } from '@tiptap/core'
import { ref } from 'vue'

const initialState = () => ({
  isRunning: false,
  currentParagraph: 0,
  currentTextNode: 0,
  currentChar: 0,
})

const stopTyping = (storage) => {
  const { run } = storage
  storage.run = null
  storage.state.value.isRunning = false
  run?.cancelDelay?.()
}

const waitForStep = (run, delay) =>
  new Promise((resolve) => {
    const done = () => {
      run.cancelDelay = null
      resolve()
    }
    const timer = setTimeout(done, delay)
    run.cancelDelay = () => {
      clearTimeout(timer)
      done()
    }
  })

const isEmptyParagraph = (node) =>
  node.type === 'paragraph' &&
  (!node.content?.length ||
    (node.content.length === 1 &&
      node.content[0].type === 'text' &&
      !node.content[0].text))

const runTypewriter = async (editor, nodes, options, storage, run) => {
  const { state } = storage
  const isCurrent = () => storage.run === run && !editor.isDestroyed
  const focus = options?.focus === undefined ? 'end' : options.focus
  const speed = Number.isFinite(options?.speed) ? Math.max(0, options.speed) : 1
  const step = Math.max(1, Math.floor(options?.step) || 1)
  let totalChars = 0
  let typedChars = 0

  for (const node of nodes) {
    if (node.type === 'paragraph') {
      for (const child of node.content || []) {
        if (child.type === 'text') totalChars += child.text?.length || 0
      }
    }
  }

  const insert = async (content, delay = 0) => {
    await waitForStep(run, delay)
    if (!isCurrent()) return false
    if (!editor.chain().insertContent(content).focus(focus).run()) {
      throw new Error('Failed to insert typewriter content')
    }
    return isCurrent()
  }

  const processNodes = async (content, topLevel) => {
    for (let index = 0; index < content.length && isCurrent(); index += 1) {
      const node = content[index]
      if (!topLevel) state.value.currentTextNode = index

      if (isEmptyParagraph(node) || node.type === 'table') {
        const blocks = [node]
        while (content[index + 1] && isEmptyParagraph(content[index + 1])) {
          blocks.push(content[++index])
        }
        if (node.type === 'table' && blocks.length === 1) {
          blocks.push({ type: 'paragraph' })
        }
        if (!(await insert(blocks))) return
        if (node.type === 'table') {
          editor.commands.enter()
        } else {
          state.value.currentParagraph += blocks.length
        }
      } else if (node.type === 'paragraph') {
        if (!(await insert([{ type: 'paragraph', attrs: node.attrs }]))) return
        await processNodes(node.content, false)
        if (isCurrent()) state.value.currentParagraph += 1
      } else if (node.type === 'text') {
        const text = node.text || ''
        for (let i = 0; i < text.length && isCurrent(); i += step) {
          const chunk = text.slice(i, i + step)
          if (!(await insert([{ ...node, text: chunk }], speed))) return
          state.value.currentChar = i + chunk.length - 1
          typedChars += chunk.length
          if (totalChars > 0) options?.onProgress?.(typedChars / totalChars)
        }
      } else {
        await insert(topLevel ? [node, { type: 'paragraph' }] : [node])
      }
    }
  }

  await waitForStep(run, 0)
  await processNodes(nodes, true)
  if (isCurrent()) options?.onComplete?.()
}

export default Extension.create({
  name: 'typewriter',
  addStorage() {
    return { state: ref(initialState()), run: null }
  },
  onBeforeCreate() {
    const { editor, storage } = this
    editor.on('unmount', () => stopTyping(storage))
  },
  addCommands() {
    return {
      startTypewriter:
        (content, options) =>
        ({ editor, dispatch }) => {
          if (!Array.isArray(content?.content) || editor.isDestroyed) {
            return false
          }
          if (!dispatch) return true

          const { typewriter } = editor.storage
          stopTyping(typewriter)
          const run = { cancelDelay: null }
          typewriter.run = run
          typewriter.state.value = { ...initialState(), isRunning: true }
          runTypewriter(editor, content.content, options, typewriter, run)
            .catch((error) => console.error('[typewriter]', error))
            .finally(() => {
              if (typewriter.run === run) stopTyping(typewriter)
            })
          return true
        },
      stopTypewriter:
        () =>
        ({ editor, dispatch }) => {
          if (dispatch) stopTyping(editor.storage.typewriter)
          return true
        },
    }
  },
})
