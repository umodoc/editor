import { InvisibleNode } from '@tiptap-pro/extension-invisible-characters'

class Invisible extends InvisibleNode {
  constructor() {
    super({
      type: 'paragraph',
      predicate: (node) => {
        return ['heading'].includes(node.type.name)
      },
    })
  }
}

export default Invisible
