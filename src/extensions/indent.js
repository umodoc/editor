import { Extension } from '@tiptap/core'
import { AllSelection, TextSelection } from '@tiptap/pm/state'

const DEFAULT_INDENT_UNIT = 'em'

const parseIndentConfig = (indentSize, fallbackUnit = DEFAULT_INDENT_UNIT) => {
  if (typeof indentSize === 'number') {
    return Number.isFinite(indentSize)
      ? { value: indentSize, unit: fallbackUnit }
      : null
  }

  if (typeof indentSize !== 'string') {
    return null
  }

  const match = indentSize.trim().match(/^(-?[\d.]+)\s*([a-z%]*)$/i)
  if (!match) {
    return null
  }

  const value = Number.parseFloat(match[1])
  if (!Number.isFinite(value)) {
    return null
  }

  return {
    value,
    unit: match[2] || fallbackUnit,
  }
}

const parseTextIndent = (textIndent, fallbackUnit = DEFAULT_INDENT_UNIT) => {
  if (typeof textIndent !== 'string') {
    return null
  }

  const match = textIndent.trim().match(/^(-?[\d.]+)\s*([a-z%]*)$/i)
  if (!match) {
    return null
  }

  const value = Number.parseFloat(match[1])
  if (!Number.isFinite(value)) {
    return null
  }

  return {
    value,
    unit: match[2] || fallbackUnit,
  }
}

export default Extension.create({
  name: 'indent',
  addOptions() {
    return {
      types: ['heading', 'listItem', 'taskItem', 'paragraph'],
      minLevel: 0,
      maxLevel: 20,
      indentSize: 2,
      defaultUnit: DEFAULT_INDENT_UNIT,
    }
  },
  addGlobalAttributes() {
    const getIndentConfig = () =>
      parseIndentConfig(this.options.indentSize, this.options.defaultUnit)
    const parseElementIndent = (element) => {
      const config = getIndentConfig()
      if (!config) {
        return null
      }
      return parseTextIndent(element.style.textIndent, config.unit)
    }

    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,
            renderHTML: (attributes) => {
              const { indent, indentUnit } = attributes
              const { minLevel } = this.options
              if (!indent || indent <= minLevel) {
                return {}
              }
              const config = getIndentConfig()
              if (!config) {
                return {}
              }
              return {
                style: `text-indent: ${indent * config.value}${indentUnit || config.unit};`,
              }
            },
            parseHTML: (element) => {
              const parsedIndent = parseElementIndent(element)
              const config = getIndentConfig()
              if (!parsedIndent || !config?.value) {
                return null
              }
              const level = Math.round(parsedIndent.value / config.value)
              return level > this.options.minLevel ? level : null
            },
          },
          indentUnit: {
            default: null,
            renderHTML: () => ({}),
            parseHTML: (element) => {
              const parsedIndent = parseElementIndent(element)
              const config = getIndentConfig()
              if (!parsedIndent || !config?.value) {
                return null
              }
              const level = Math.round(parsedIndent.value / config.value)
              return level > this.options.minLevel ? parsedIndent.unit : null
            },
          },
        },
      },
    ]
  },
  addCommands() {
    const getIndentConfig = () =>
      parseIndentConfig(this.options.indentSize, this.options.defaultUnit)
    const shouldClampMaxLevel = (indentUnit) => {
      const config = getIndentConfig()
      if (!config) {
        return true
      }
      return !indentUnit || indentUnit === config.unit
    }

    const setNodeIndentMarkup = (tr, pos, delta) => {
      const node = tr.doc.nodeAt(pos)
      if (!node) return tr
      const nextLevel = (node.attrs.indent || 0) + delta
      const { minLevel, maxLevel } = this.options
      let indent = nextLevel
      if (nextLevel < minLevel) indent = minLevel
      if (nextLevel > maxLevel && shouldClampMaxLevel(node.attrs.indentUnit)) {
        indent = maxLevel
      }
      if (indent !== node.attrs.indent) {
        const attrs = { ...node.attrs }
        delete attrs.indent
        delete attrs.indentUnit
        const config = getIndentConfig()
        const nextAttrs =
          indent > minLevel
            ? {
                ...attrs,
                indent,
                indentUnit:
                  node.attrs.indentUnit || config?.unit || DEFAULT_INDENT_UNIT,
              }
            : attrs
        return tr.setNodeMarkup(pos, node.type, nextAttrs, node.marks)
      }
      return tr
    }
    const updateIndentLevel = (tr, delta) => {
      const { doc, selection } = tr
      if (
        selection instanceof TextSelection ||
        selection instanceof AllSelection
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
        tr.setSelection(state.selection)
        tr = updateIndentLevel(tr, direction)
        if (tr.docChanged) {
          if (dispatch) {
            dispatch(tr)
          }
          return true
        }
        return false
      }
    return {
      setIndent: applyIndent(1),
      setOutdent: applyIndent(-1),
    }
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return this.editor.commands.sinkListItem('listItem')
        }
        if (this.editor.isActive('taskList')) {
          return this.editor.commands.sinkListItem('taskItem')
        }
        return this.editor.commands.setIndent()
      },
      'Shift-Tab': () => {
        if (
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList')
        ) {
          return this.editor.commands.liftListItem('listItem')
        }
        if (this.editor.isActive('taskList')) {
          return this.editor.commands.liftListItem('taskItem')
        }
        return this.editor.commands.setOutdent()
      },
    }
  },
})
