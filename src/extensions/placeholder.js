import { isNodeEmpty } from '@tiptap/core'
import { Placeholder } from '@tiptap/extensions'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const hasHeadingStructure = (structure = '') => /^\s*heading\b/.test(structure)

const getDocChildPos = (doc, targetIndex) => {
  let pos = 0
  for (let index = 0; index < targetIndex; index += 1) {
    pos += doc.child(index).nodeSize
  }
  return pos
}

const shouldShowBodyPlaceholder = (editor, structure, pos) => {
  const { doc } = editor.state
  const bodyStartIndex =
    hasHeadingStructure(structure) && doc.firstChild?.type.name === 'heading'
      ? 1
      : 0
  const bodyCount = doc.childCount - bodyStartIndex

  if (bodyCount !== 1) {
    return false
  }

  const bodyNode = doc.child(bodyStartIndex)
  return (
    bodyNode.type.name === 'paragraph' &&
    isNodeEmpty(bodyNode) &&
    pos === getDocChildPos(doc, bodyStartIndex)
  )
}

export default Placeholder.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      structure: 'block+',
      bodyPlaceholder: null,
      headingPlaceholder: null,
    }
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('placeholder'),
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable
            const { anchor } = selection
            const decorations = []
            const { structure, headingPlaceholder, bodyPlaceholder } =
              this.options

            if (!active) {
              return null
            }

            const isEmptyDoc = this.editor.isEmpty

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
              const isEmpty = !node.isLeaf && isNodeEmpty(node)

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                let placeholder = ''

                if (node.type.name === 'heading') {
                  placeholder =
                    typeof headingPlaceholder === 'function'
                      ? headingPlaceholder({
                          editor: this.editor,
                          node,
                          pos,
                          hasAnchor,
                        })
                      : headingPlaceholder
                } else if (
                  shouldShowBodyPlaceholder(this.editor, structure, pos)
                ) {
                  placeholder =
                    typeof bodyPlaceholder === 'function'
                      ? bodyPlaceholder({
                          editor: this.editor,
                          node,
                          pos,
                          hasAnchor,
                        })
                      : bodyPlaceholder
                }

                if (!placeholder) {
                  return this.options.includeChildren
                }

                const classes = [this.options.emptyNodeClass]

                if (isEmptyDoc) {
                  classes.push(this.options.emptyEditorClass)
                }

                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: classes.join(' '),
                    'data-placeholder': placeholder,
                  }),
                )
              }

              return this.options.includeChildren
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
