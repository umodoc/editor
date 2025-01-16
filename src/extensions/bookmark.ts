import { Mark, mergeAttributes } from '@tiptap/core'

export interface BookmarkOptions {
  /**
   *样式 左右有括号 {}
   * @default umo-editor-bookmark
   * @example
   */
  class: string | undefined
  /**
   *书签名称
   * @default 不可为空 唯一标识 用于定位 删除等操作
   * @example true
   */
  bookmarkName: string | undefined
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bookmark: {
      /**
       * Set a bookmark//设置书签
       * @param attributes
       * @example
       */
      setBookmark: (attributes: {
        bookmarkName: string | undefined
      }) => ReturnType
    }
  }
}
//书签格式 创建一个书签
export default Mark.create<BookmarkOptions>({
  name: 'bookmark',
  priority: 1000,
  keepOnSplit: false,
  exitable: true,
  addOptions() {
    return {
      bookmarkName: '',
      class: 'umo-editor-bookmark',
    }
  },
  addAttributes() {
    return {
      bookmarkName: {
        default: 'bookmarkName',
      },
      class: {
        default: this.options.class ? this.options.class : undefined,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'bookmark',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['bookmark', mergeAttributes(this.options, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setBookmark:
        (attributes) =>
        ({ chain }) => {
          return chain().setMark(this.name, attributes).run()
        },
    }
  },
})
