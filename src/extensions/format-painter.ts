import { Extension } from '@tiptap/core'
import type { Mark } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setFormatPainter: {
      setFormatPainter: (once: any) => ReturnType
    }
    unsetFormatPainter: {
      unsetFormatPainter: () => ReturnType
    }
  }
}

export default Extension.create({
  name: 'painter',
  addCommands() {
    // 添加命令
    return {
      setFormatPainter:
        (once: boolean) =>
        ({ editor, view }) => {
          const { tr } = view.state
          const marks = editor.state.selection.$head.marks()
          // @ts-ignore
          view.painter = {
            enabled: true,
            once,
            marks,
          }
          // 设置格式刷开始的动作
          view.dispatch(tr.setMeta('painterAction', { type: 'start', marks }))
          return true
        },
      unsetFormatPainter:
        () =>
        ({ view }) => {
          const { tr } = view.state
          // @ts-ignore
          view.painter = {
            enabled: false,
            once: true,
            marks: [],
          }
          // 设置格式刷结束的动作
          view.dispatch(tr.setMeta('painterAction', { type: 'end' }))
          return true
        },
    }
  },
  addProseMirrorPlugins() {
    // 添加插件
    return [
      new Plugin({
        key: new PluginKey('format-painter'),
        state: {
          init: () => [],
          apply(tr, set) {
            const action = tr.getMeta('painterAction')
            if (action?.type === 'start') {
              return action.marks
            }
            if (action?.type === 'end') {
              return []
            }
            return set
          },
        },
        props: {
          handleDOMEvents: {
            mousedown(view) {
              const marks: Mark[] | undefined = this.getState(view.state)

              // 通过 view 传值，方便获取，但是不建议这样做
              // @ts-ignore
              const { painter } = view

              if (!marks || marks.length === 0) {
                return false // 如果没有标记，则不执行任何操作
              }
              const mouseup = () => {
                document.removeEventListener('mouseup', mouseup)

                if (!painter.enabled) {
                  return
                }

                const { dispatch } = view
                let { tr, selection } = view.state

                tr = tr.removeMark(selection.from, selection.to)
                for (const mark of marks) {
                  if (mark.type.name !== 'link') {
                    tr = tr.addMark(selection.from, selection.to, mark)
                  }
                }
                if (painter.once) {
                  painter.enabled = false
                  painter.marks = []
                  dispatch(tr.setMeta('painterAction', { type: 'end' }))
                } else {
                  dispatch(
                    tr.setMeta('painterAction', {
                      type: 'start',
                      marks: painter.marks,
                    }),
                  )
                }
              }
              document.addEventListener('mouseup', mouseup)
              return true
            },
          },
        },
      }),
    ]
  },
})
