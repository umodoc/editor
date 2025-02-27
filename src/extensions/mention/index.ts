import Mention from '@tiptap/extension-mention'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertMention: {
      insertMention: (options: any) => ReturnType
    }
  }
}

const CustomMention = Mention.extend({
  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: null,
      },
    }
  },
  addCommands() {
    return {
      insertMention:
        () =>
        ({ commands }) => {
          console.log(this.options)
          return commands.insertContent(
            ' ' + (this.options?.suggestion?.char || '@'),
          )
        },
    }
  },
})

// 配置并导出扩展
const mentionExtension = CustomMention.configure({
  HTMLAttributes: {
    class: 'umo-node-mention',
  },
})

export default mentionExtension
