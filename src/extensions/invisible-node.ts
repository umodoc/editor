
//@ts-ignore
import { InvisibleNode } from '@tiptap-pro/extension-invisible-characters'
import { Node } from '@tiptap/pm/model'
export default class Invisible extends InvisibleNode {
  constructor() {
    super({
      type: 'paragraph',
      predicate: (node:Node) => {
        return ['heading'].includes(node.type.name)
      },
    })
  }
}
