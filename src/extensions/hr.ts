import { nodeInputRule } from '@tiptap/core'
import hr from '@tiptap/extension-horizontal-rule'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setHr: {
      setHr: (option: any) => ReturnType
    }
  }
}
export default hr.extend({
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'umo-page-divider',
        'data-line-number': false,
      },
    }
  },
  parseHTML() {
    return [{ tag: 'hr' }]
  },
  addAttributes() {
    return {
      'data-type': {
        parseHTML: (element) => element.getAttribute('data-type') ?? 'signle',
      },
      color: {
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => {
          return {
            'data-color': attributes.color,
            style: `color: ${attributes.color ?? 'inherit'}`,
          }
        },
      },
    }
  },
  addCommands() {
    return {
      setHr:
        ({ type, color }) =>
        ({ chain, state }) => {
          const { $to: $originTo } = state.selection
          const currentChain = chain()
          if ($originTo.parentOffset === 0) {
            currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), {
              type: this.name,
              attrs: { 'data-type': type, color },
            })
          } else {
            currentChain.insertContent({
              type: this.name,
              attrs: { 'data-type': type, color },
            })
          }
          return (
            currentChain
              // set cursor after horizontal rule
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection
                  const posAfter = $to.end()
                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                    }
                  } else {
                    // add node after horizontal rule if it’s the end of the document
                    const node =
                      $to.parent.type.contentMatch.defaultType?.create() ?? 0
                    if (node) {
                      tr.insert(posAfter, node)
                      tr.setSelection(
                        TextSelection.create(tr.doc, posAfter + 1),
                      )
                    }
                  }
                  tr.scrollIntoView()
                }
                return true
              })
              .run()
          )
        },
    }
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type,
      }),
    ]
  },
})
