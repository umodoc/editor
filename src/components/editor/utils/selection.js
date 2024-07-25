import { Selection } from "@tiptap/pm/state";
import { equalNodeType, isNodeSelection } from "./helpers";

// :: (predicate: (node: ProseMirrorNode) → boolean) → (selection: Selection) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// 在父节点上迭代，返回最近的节点，根据predicate条件返回 `start’指向节点的起始位置，pos’直接指向节点之前。
//
// ```javascript
// const predicate = node => node.type === schema.nodes.blockquote;
// const parent = findParentNode(predicate)(selection);
// ```
export const findParentNode =
  (predicate) =>
  ({ $from }) =>
    findParentNodeClosestToPos($from, predicate);

// :: ($pos: ResolvedPos, predicate: (node: ProseMirrorNode) → boolean) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// 从给定的“$pos”开始在父节点上迭代，返回最近的节点， 返回值 `start’指向节点的起始位置，pos’直接指向节点之前。
//
// ```javascript
// const predicate = node => node.type === schema.nodes.blockquote;
// const parent = findParentNodeClosestToPos(state.doc.resolve(5), predicate);
// ```
export const findParentNodeClosestToPos = ($pos, predicate) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node
      };
    }
  }
};

// :: (predicate: (node: ProseMirrorNode) → boolean, domAtPos: (pos: number) → {node: dom.Node, offset: number}) → (selection: Selection) → ?dom.Node
// 在父节点上迭代，返回最近节点的 dom
//
// ```javascript
// const domAtPos = view.domAtPos.bind(view);
// const predicate = node => node.type === schema.nodes.table;
// const parent = findParentDomRef(predicate, domAtPos)(selection); // <table>
// ```
export const findParentDomRef = (predicate, domAtPos) => (selection) => {
  const parent = findParentNode(predicate)(selection);
  if (parent) {
    return findDomRefAtPos(parent.pos, domAtPos);
  }
};

// :: (predicate: (node: ProseMirrorNode) → boolean) → (selection: Selection) → boolean
// 检查是否存在某个父节点
//
// ```javascript
// if (hasParentNode(node => node.type === schema.nodes.table)(selection)) {
//   // ....
// }
// ```
export const hasParentNode = (predicate) => (selection) => {
  return !!findParentNode(predicate)(selection);
};

// :: (nodeType: union<NodeType, [NodeType]>) → (selection: Selection) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// 在父节点上迭代，返回给定“nodeType”的最近节点`start’指向节点的起始位置，pos’直接指向节点之前。
//
// ```javascript
// const parent = findParentNodeOfType(schema.nodes.paragraph)(selection);
// ```
export const findParentNodeOfType = (nodeType) => (selection) => {
  return findParentNode((node) => equalNodeType(nodeType, node))(selection);
};

// :: ($pos: ResolvedPos, nodeType: union<NodeType, [NodeType]>) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// 从给定的“$pos”开始在父节点上迭代，返回给定“nodeType”的最近节点`start’指向节点的起始位置，pos’直接指向节点之前。.
//
// ```javascript
// const parent = findParentNodeOfTypeClosestToPos(state.doc.resolve(10), schema.nodes.paragraph);
// ```
export const findParentNodeOfTypeClosestToPos = ($pos, nodeType) => {
  return findParentNodeClosestToPos($pos, (node) => equalNodeType(nodeType, node));
};

// :: (nodeType: union<NodeType, [NodeType]>) → (selection: Selection) → boolean
// 检查是否存在给定“nodeType”的父节点。
//
// ```javascript
// if (hasParentNodeOfType(schema.nodes.table)(selection)) {
//   // ....
// }
// ```
export const hasParentNodeOfType = (nodeType) => (selection) => {
  return hasParentNode((node) => equalNodeType(nodeType, node))(selection);
};

// :: (nodeType: union<NodeType, [NodeType]>, domAtPos: (pos: number) → {node: dom.Node, offset: number}) → (selection: Selection) → ?dom.Node
// 在父节点上迭代，返回给定“nodeType”的最近节点的DOM引用。
//
// ```javascript
// const domAtPos = view.domAtPos.bind(view);
// const parent = findParentDomRefOfType(schema.nodes.codeBlock, domAtPos)(selection); // <pre>
// ```
export const findParentDomRefOfType = (nodeType, domAtPos) => (selection) => {
  return findParentDomRef((node) => equalNodeType(nodeType, node), domAtPos)(selection);
};

// :: (nodeType: union<NodeType, [NodeType]>) → (selection: Selection) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// 如果选择了给定“nodeType”的节点，则返回该节点`start’指向节点的起始位置，pos’直接指向节点之前。
//
// ```javascript
// const { extension, inlineExtension, bodiedExtension } = schema.nodes;
// const selectedNode = findSelectedNodeOfType([
//   extension,
//   inlineExtension,
//   bodiedExtension,
// ])(selection);
// ```
export const findSelectedNodeOfType = (nodeType) => (selection) => {
  if (isNodeSelection(selection)) {
    const { node, $from } = selection;
    if (equalNodeType(nodeType, node)) {
      return { node, pos: $from.pos, depth: $from.depth };
    }
  }
};

// :: (selection: Selection) → ?number
// Returns position of the previous node.
//
// ```javascript
// const pos = findPositionOfNodeBefore(tr.selection);
// ```
export const findPositionOfNodeBefore = (selection) => {
  const { nodeBefore } = selection.$from;
  const maybeSelection = Selection.findFrom(selection.$from, -1);
  if (maybeSelection && nodeBefore) {
    // leaf node
    const parent = findParentNodeOfType(nodeBefore.type)(maybeSelection);
    if (parent) {
      return parent.pos;
    }
    return maybeSelection.$from.pos;
  }
};

// :: (position: number, domAtPos: (pos: number) → {node: dom.Node, offset: number}) → dom.Node
// 返回给定“位置”处节点的DOM引用。如果节点类型为“TEXT_node”类型，它将返回父节点的引用。
//
// ```javascript
// const domAtPos = view.domAtPos.bind(view);
// const ref = findDomRefAtPos($from.pos, domAtPos);
// ```
export const findDomRefAtPos = (position, domAtPos) => {
  const dom = domAtPos(position);
  const node = dom.node.childNodes[dom.offset];

  if (dom.node.nodeType === Node.TEXT_NODE) {
    return dom.node.parentNode;
  }

  if (!node || node.nodeType === Node.TEXT_NODE) {
    return dom.node;
  }

  return node;
};
