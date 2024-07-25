import { NodeSelection } from "@tiptap/pm/state";
import { Fragment, Node as PMNode } from "@tiptap/pm/model";
import { setTextSelection } from "./transforms";
import { findParentNodeClosestToPos } from "./selection";

// :: (selection: Selection) → boolean
// 验证选中类型是 `NodeSelection`.
//
// ```javascript
// if (isNodeSelection(tr.selection)) {
//   // ...
// }
// ```
export const isNodeSelection = (selection) => {
  return selection instanceof NodeSelection;
};

// (nodeType: union<NodeType, [NodeType]>) → boolean
// 检查给定“node”的类型是否等于给定的`nodeType`.
export const equalNodeType = (nodeType, node) => {
  return (Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) || node.type === nodeType;
};

// (tr: Transaction) → Transaction
// 从给定事务创建新事务对象
export const cloneTr = (tr) => {
  return Object.assign(Object.create(tr), tr).setTime(Date.now());
};

// (position: number, content: union<ProseMirrorNode, Fragment>) → (tr: Transaction) → Transaction
// Returns a `replace` transaction that replaces a node at a given position with the given `content`.
// It will return the original transaction if replacing is not possible.
// `position` should point at the position immediately before the node.
export const replaceNodeAtPos = (position, content) => (tr) => {
  const node = tr.doc.nodeAt(position);
  const $pos = tr.doc.resolve(position);
  if (canReplace($pos, content)) {
    tr = tr.replaceWith(position, position + node.nodeSize, content);
    const start = tr.selection.$from.pos - 1;
    // put cursor inside of the inserted node
    tr = setTextSelection(Math.max(start, 0), -1)(tr);
    // move cursor to the start of the node
    tr = setTextSelection(tr.selection.$from.start())(tr);
    return cloneTr(tr);
  }
  return tr;
};

// ($pos: ResolvedPos, doc: ProseMirrorNode, content: union<ProseMirrorNode, Fragment>, ) → boolean
// 检查是否可以用给定的“content”替换“doc”节点内部给定的“$pos”处的节点。
export const canReplace = ($pos, content) => {
  const node = $pos.node($pos.depth);
  return node && node.type.validContent(content instanceof Fragment ? content : Fragment.from(content));
};

// (position: number) → (tr: Transaction) → Transaction
// Returns a `delete` transaction that removes a node at a given position with the given `node`.
// `position` should point at the position immediately before the node.
export const removeNodeAtPos = (position) => (tr) => {
  const node = tr.doc.nodeAt(position);
  return cloneTr(tr.delete(position, position + node.nodeSize));
};

// :: ($pos: ResolvedPos, content: union<ProseMirrorNode, Fragment>) → boolean
// 检查给定的“内容”是否可以插入到给定的“$pos”`
//
// ```javascript
// const { selection: { $from } } = state;
// const node = state.schema.nodes.atom.createChecked();
// if (canInsert($from, node)) {
//   // ...
// }
// ```
export const canInsert = ($pos, content) => {
  const index = $pos.index();

  if (content instanceof Fragment) {
    return $pos.parent.canReplace(index, index, content);
  } else if (content instanceof PMNode) {
    return $pos.parent.canReplaceWith(index, index, content.type);
  }
  return false;
};

// (node: ProseMirrorNode) → boolean
// 检查给定的“节点”是否为空段落
export const isEmptyParagraph = (node) => {
  return !node || (node.type.name === "paragraph" && node.nodeSize === 2);
};

export const checkInvalidMovements = (originIndex, targetIndex, targets, type) => {
  const direction = originIndex > targetIndex ? -1 : 1;
  const errorMessage = `Target position is invalid, you can't move the ${type} ${originIndex} to ${targetIndex}, the target can't be split. You could use tryToFit option.`;

  if (direction === 1) {
    if (targets.slice(0, targets.length - 1).indexOf(targetIndex) !== -1) {
      throw new Error(errorMessage);
    }
  } else {
    if (targets.slice(1).indexOf(targetIndex) !== -1) {
      throw new Error(errorMessage);
    }
  }

  return true;
};
