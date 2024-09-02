import type { Node } from '@tiptap/pm/model'
import { InvisibleNode } from '@tiptap-pro/extension-invisible-characters'
export default class Invisible extends InvisibleNode {
  constructor() {
    super({
      type: 'paragraph',
      predicate: (node: Node) => {
        return ['heading'].includes(node.type.name)
      },
    })
  }
}
