import { NodeSelection, TextSelection } from '@tiptap/pm/state'

export const getSelectionNode = (editor) => {
  const { selection } = editor.state
  if (selection instanceof NodeSelection && selection.node) {
    return selection.node
  }
  const { $from } = selection
  if ($from.depth >= 1) {
    return $from.node(1)
  }
  return selection.node
}

export const getSelectionText = (editor) => {
  const { from, to, empty } = editor.state.selection
  if (empty) {
    return ''
  }
  return editor.state.doc.textBetween(from, to, '')
}

export const setSelectionText = (editor, prevDocLength, from, to) => {
  const state = editor?.state
  const newDocLength = state.doc.content.size
  const newTo = to + (newDocLength - prevDocLength)
  if (newTo <= from) {
    return false
  }
  const selection = TextSelection.create(state.doc, from, newTo)
  const { tr } = editor.view.state
  if (tr && selection) {
    tr.setSelection(selection)
    editor.view.dispatch(tr)
    editor?.commands.focus()
  }
}
