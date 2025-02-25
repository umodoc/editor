import Mention from '@tiptap/extension-mention'
import mentionSuggestion from './suggestion'

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
})

// 配置并导出扩展
const mentionExtension = CustomMention.configure({
  HTMLAttributes: {
    class: 'umo-node-mention',
  },
})

export default mentionExtension
