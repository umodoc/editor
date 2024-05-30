import { Extension } from '@tiptap/core'
import { TextSelection, AllSelection } from '@tiptap/pm/state'

// @weiruo/tiptap-extension-indent Version:2.0.4-1
const classAttrPrefix = 'indent-'
export default Extension.create({
  name: 'indent',
  addOptions() {
    return {
      types: ['heading', 'listItem', 'taskItem', 'paragraph'],
      minLevel: 0,
      maxLevel: 5,
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {}
              }
              if (attributes.indent > this.options.minLevel) {
                return {
                  class: `${classAttrPrefix}${attributes.indent}`,
                }
              }
              return {}
            },
            parseHTML: (element) => {
              let indentClassName = ''
              element.classList.forEach((className) => {
                if (className.indexOf(classAttrPrefix) === 0) {
                  indentClassName = className
                }
              })
              if (indentClassName) {
                const level = parseInt(
                  indentClassName.slice(classAttrPrefix.length),
                  7,
                )
                return level && level > this.options.minLevel ? level : null
              }
              return null
            },
          },
        },
      },
    ]
  },
  addCommands() {
    const setNodeIndentMarkup = (tr, pos, delta) => {
      const node = tr?.doc?.nodeAt(pos) || null // 使用可选链操作符进行安全访问
      if (node) {
        const nextLevel = (node.attrs.indent || 0) + delta
        const { minLevel, maxLevel } = this.options
        let indent = nextLevel
        if (nextLevel < minLevel) {
          indent = minLevel
        } else if (nextLevel > maxLevel) {
          indent = maxLevel
        }
        if (indent !== node.attrs.indent) {
          const { indent: oldIndent, ...currentAttrs } = node.attrs
          const nodeAttrs =
            indent > minLevel ? { ...currentAttrs, indent } : currentAttrs
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
        }
      }
      return tr
    }
    const updateIndentLevel = (tr, delta) => {
      const { doc, selection } = tr
      if (
        doc &&
        selection &&
        (selection instanceof TextSelection ||
          selection instanceof AllSelection)
      ) {
        const { from, to } = selection
        doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = setNodeIndentMarkup(tr, pos, delta)
            return false
          }
          return true
        })
      }
      return tr
    }
    const applyIndent =
      (direction) =>
      () =>
      ({ tr, state, dispatch }) => {
        const { selection } = state
        tr = tr.setSelection(selection)
        tr = updateIndentLevel(tr, direction)
        if (tr.docChanged) {
          dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr)
          return true
        }
        return false
      }
    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1),
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent()
      },
    }
  },
})
