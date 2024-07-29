import { EditorState, NodeSelection, TextSelection } from "@tiptap/pm/state";
import { canSplit } from "@tiptap/pm/transform";

import { defaultBlockAt} from "@tiptap/vue-3";
import { getId } from "../../utils/id";
import { getSplittedAttributes } from './index'

function ensureMarks(state, splittableMarks) {
  const marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks());

  if (marks) {
    const filteredMarks = marks.filter((mark) => splittableMarks?.includes(mark.type.name));

    state.tr.ensureMarks(filteredMarks);
  }
}


/*修改系统默认 block块分割事件操作  如果分割的时候  属性包含id的话
 * 需要重新生成 因为id 在 html里面是唯一的 只有 其他的属性 可以被继承到 下一个 block
 * */

export const splitBlock =
  ({ keepMarks = true } = {}) =>
  ({ tr, state, dispatch, editor }) => {
    const { selection, doc } = tr;
    const { $from, $to } = selection;
    const extensionAttributes = editor.extensionManager.attributes;
    const newAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
    //值如果包含id 需要重新生成
    newAttributes.id = getId();

    if (newAttributes.extend) {
      newAttributes.extend = false;
    }
    if (selection instanceof NodeSelection && selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(doc, $from.pos)) {
        return false;
      }

      if (dispatch) {
        if (keepMarks) {
          ensureMarks(state, editor.extensionManager.splittableMarks);
        }

        tr.split($from.pos).scrollIntoView();
      }

      return true;
    }

    if (!$from.parent.isBlock) {
      return false;
    }

    if (dispatch) {
      const atEnd = $to.parentOffset === $to.parent.content.size;

      if (selection instanceof TextSelection) {
        tr.deleteSelection();
      }

      const deflt = $from.depth === 0 ? undefined : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
      //修改默认操作 不管是不是在末尾都分割 都需要有新的属性id 保证id的唯一性
      let types =
        atEnd && deflt
          ? [
              {
                type: deflt,
                attrs: newAttributes
              }
            ]
          : undefined;

      let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);

      if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [{ type: deflt }] : undefined)) {
        can = true;
        types = deflt
          ? [
              {
                type: deflt,
                attrs: newAttributes
              }
            ]
          : undefined;
      }

      if (can) {
        //如果没有类型 默认就是当前节点
        if (!types) {
          types = [
            {
              type: $from.node().type,
              attrs: newAttributes
            }
          ];
        }
        tr.split(tr.mapping.map($from.pos), 1, types);

        if (deflt && !atEnd && !$from.parentOffset && $from.parent.type !== deflt) {
          const first = tr.mapping.map($from.before());
          const $first = tr.doc.resolve(first);

          if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
            tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
          }
        }
      }
      if (keepMarks) {
        ensureMarks(state, editor.extensionManager.splittableMarks);
      }
      tr.scrollIntoView();
    }

    return true;
  };
