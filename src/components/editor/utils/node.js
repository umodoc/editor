// :: (node: ProseMirrorNode, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 展平给定“节点”的后代。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const children = flatten(node);
// ```
export const flatten = (node, descend = true) => {
  if (!node) {
    throw new Error('Invalid "node" parameter');
  }
  const result = [];
  node.descendants((child, pos) => {
    result.push({ node: child, pos });
    if (!descend) {
      return false;
    }
  });
  return result;
};

// :: (node: ProseMirrorNode, predicate: (node: ProseMirrorNode) → boolean, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 遍历给定“node”的子节点，根据predicate条件查找。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const textNodes = findChildren(node, child => child.isText, false);
// ```
export const findChildren = (node, predicate, descend) => {
  if (!node) {
    throw new Error('Invalid "node" parameter');
  } else if (!predicate) {
    throw new Error('Invalid "predicate" parameter');
  }
  return flatten(node, descend).filter((child) => predicate(child.node));
};

// :: (node: ProseMirrorNode, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 返回给定“节点”的文本节点。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const textNodes = findTextNodes(node);
// ```
export const findTextNodes = (node, descend) => {
  return findChildren(node, (child) => child.isText, descend);
};

// :: (node: ProseMirrorNode, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 返回给定“node”的内联节点。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const inlineNodes = findInlineNodes(node);
// ```
export const findInlineNodes = (node, descend) => {
  return findChildren(node, (child) => child.isInline, descend);
};

// :: (node: ProseMirrorNode, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 返回给定“节点”的block节点。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const blockNodes = findBlockNodes(node);
// ```
export const findBlockNodes = (node, descend) => {
  return findChildren(node, (child) => child.isBlock, descend);
};

// :: (node: ProseMirrorNode, predicate: (attrs: ?Object) → boolean, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 遍历给定“node”的子节点，根据attrs属性进行过滤。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const mergedCells = findChildrenByAttr(table, attrs => attrs.colspan === 2);
// ```
export const findChildrenByAttr = (node, predicate, descend) => {
  return findChildren(node, (child) => !!predicate(child.attrs), descend);
};

// :: (node: ProseMirrorNode, nodeType: NodeType, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 遍历给定“node”的子节点，根据type属性进行过滤。当下降参数为“false”（默认为“true”）时，它不会下降到节点中。
//
// ```javascript
// const cells = findChildrenByType(table, schema.nodes.tableCell);
// ```
export const findChildrenByType = (node, nodeType, descend) => {
  return findChildren(node, (child) => child.type === nodeType, descend);
};

// :: (node: ProseMirrorNode, markType: markType, descend: ?boolean) → [{ node: ProseMirrorNode, pos: number }]
// 遍历给定“node”的子节点，返回具有给定markType标记的子节点。当下降参数为“false”（默认为“true”）时，它不会下降到“node”。
//
// ```javascript
// const nodes = findChildrenByMark(state.doc, schema.marks.strong);
// ```
export const findChildrenByMark = (node, markType, descend) => {
  return findChildren(node, (child) => markType.isInSet(child.marks), descend);
};

// :: (node: ProseMirrorNode, nodeType: NodeType) → boolean
// 如果给定节点包含给定“nodeType”的节点，则返回“true”`
//
// ```javascript
// if (contains(panel, schema.nodes.listItem)) {
//   // ...
// }
// ```
export const contains = (node, nodeType) => {
  return !!findChildrenByType(node, nodeType).length;
};
