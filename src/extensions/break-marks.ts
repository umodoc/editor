import type { Node } from '@tiptap/pm/model'
import { InvisibleNode } from '@tiptap-pro/extension-invisible-characters'
import InvisibleCharacters, {
  HardBreakNode,
  ParagraphNode,
} from '@tiptap-pro/extension-invisible-characters'

class HeadingNode extends InvisibleNode {
  constructor() {
    super({
      type: 'paragraph',
      predicate: (node: Node) => ['heading'].includes(node.type.name),
    })
  }
}

const breakMarks = InvisibleCharacters.configure({
  injectCSS: false,
  builders: [new HardBreakNode(), new ParagraphNode(), new HeadingNode()],
})

export default breakMarks
