import { Node } from '@tiptap/pm/model'

/**
 * Generates a random ID.
 * @returns {string} - A random string ID.
 */
export function getId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Finds the parent DOM reference of a specific node type.
 * @param {any} nodeType - The node type to find.
 * @param {function} domAtPos - Function to retrieve the DOM position.
 * @returns {function} - A function that returns the DOM reference for a given selection.
 */
export const findParentDomRefOfType = (nodeType, domAtPos) => (selection) => {
  return findParentDomRef(
    (node) => equalNodeType(nodeType, node),
    domAtPos,
  )(selection)
}
/**
 * Checks if the node type matches the specified type.
 * @param {any} nodeType - The node type to check.
 * @param {Node} node - The node to compare.
 * @returns {boolean} - True if the node matches the type, false otherwise.
 */
export const equalNodeType = (nodeType, node) => {
  return (
    (Array.isArray(nodeType) && nodeType.includes(node.type)) ||
    node.type === nodeType
  )
}
/**
 * Finds the parent DOM reference based on a predicate.
 * @param {function} predicate - Predicate to determine the parent node.
 * @param {function} domAtPos - Function to retrieve the DOM position.
 * @returns {function} - A function that returns the DOM reference for a given selection.
 */
export const findParentDomRef = (predicate, domAtPos) => (selection) => {
  const parent = findParentNode(predicate)(selection)
  if (parent) {
    return findDomRefAtPos(parent.pos, domAtPos)
  }
}
/**
 * Finds the DOM reference at a given position.
 * @param {number} position - The position in the document.
 * @param {function} domAtPos - Function to retrieve the DOM position.
 * @returns {Node} - The DOM node at the specified position.
 */
export const findDomRefAtPos = (position, domAtPos) => {
  const dom = domAtPos(position)
  const node = dom.node.childNodes[dom.offset]
  if (dom.node.nodeType === Node.TEXT_NODE) {
    return dom.node.parentNode
  }
  if (!node || node.nodeType === Node.TEXT_NODE) {
    return dom.node
  }

  return node
}
/**
 * Finds the parent node based on a predicate.
 * @param {function} predicate - Predicate to determine the parent node.
 * @returns {function} - A function that returns the parent node closest to a position.
 */
export const findParentNode =
  (predicate) =>
  ({ $from }) =>
    findParentNodeClosestToPos($from, predicate)
/**
 * Finds the parent node closest to a given position.
 * @param {any} $pos - The position in the document.
 * @param {function} predicate - Predicate to determine the parent node.
 * @returns {Object|null} - The parent node and its details if found, or null.
 */
export const findParentNodeClosestToPos = ($pos, predicate) => {
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
