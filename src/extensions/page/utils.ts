import type { Node, NodeType } from '@tiptap/pm/model'
import type { NodeSelection } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

/**
 * Generates a random ID.
 * @returns {string} - A random string ID.
 */
export function getId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Finds the parent DOM reference of a specific node type.
 */
export const findParentDomRefOfType =
  (nodeType: NodeType, domAtPos: EditorView['domAtPos']) =>
  (selection: NodeSelection) => {
    return findParentDomRef(
      (node: Node) => equalNodeType(nodeType, node),
      domAtPos,
    )(selection)
  }
/**
 * Checks if the node type matches the specified type.
 */
export const equalNodeType = (nodeType: NodeType, node: Node) => {
  return (
    (Array.isArray(nodeType) && nodeType.includes(node.type)) ||
    node.type === nodeType
  )
}
/**
 * Finds the parent DOM reference based on a predicate.
 */
export const findParentDomRef =
  (predicate: (node: Node) => boolean, domAtPos: EditorView['domAtPos']) =>
  (selection: NodeSelection) => {
    const parent = findParentNode(predicate)(selection)
    if (parent) {
      return findDomRefAtPos(parent.pos, domAtPos)
    }
  }
/**
 * Finds the DOM reference at a given position.
 */
export const findDomRefAtPos = (
  position: number,
  domAtPos: EditorView['domAtPos'],
) => {
  const dom = domAtPos(position)
  const node = dom.node.childNodes[dom.offset]
  // FIXME: Node.TEXT_NODE does not exist.
  // See the prosemirror codebase: https://github.com/ProseMirror/prosemirror-model
  // if (dom.node.nodeType === Node.TEXT_NODE) {
  //   return dom.node.parentNode
  // }
  // if (!node || node.nodeType === Node.TEXT_NODE) {
  //   return dom.node
  // }

  return node
}
/**
 * Finds the parent node based on a predicate.
 */
export const findParentNode =
  (predicate: (node: Node) => boolean) =>
  ({ $from }: { $from: any }) =>
    findParentNodeClosestToPos($from, predicate)
/**
 * Finds the parent node closest to a given position.
 * @param {any} $pos - The position in the document.
 * @param {function} predicate - Predicate to determine the parent node.
 * @returns {Object|null} - The parent node and its details if found, or null.
 */
export const findParentNodeClosestToPos = (
  $pos: any,
  predicate: (node: Node) => boolean,
) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i)
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      }
    }
  }
  return null
}
