import { Mark, mergeAttributes } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { shortId } from '@/utils/short-id'

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
      /*
      定位书签
      */
      focusBookmark: (bookmarkName: string | undefined) => ReturnType
      /*
      获取所有书签
      */
      getAllBookmarks: (callback: (bookmarks: any[]) => void) => ReturnType
    }
  }
}
// 书签格式 创建一个书签
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
        default: this.options.class ?? undefined,
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
      // 设置书签 若书签有选中区域数据 否则默认值为书签名称
      setBookmark:
        (attributes) =>
        ({ chain, editor }) => {
          try {
            chain().setMark(this.name, attributes).run()
            const { empty } = editor.state.selection
            if (empty && attributes.bookmarkName) {
              chain().focus().insertContent(attributes.bookmarkName).run()
            }
            return true
          } catch (e) {
            return false
          }
        },
      focusBookmark:
        (bookmarkName) =>
        ({ editor, tr }) => {
          if (bookmarkName) {
            const element = editor.view.dom.querySelector(
              `bookmark[bookmarkName="${bookmarkName}"]`,
            )
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
              })
              const pos = editor.view.posAtDOM(element, 0)
              if (tr) {
                tr.setSelection(new TextSelection(tr.doc.resolve(pos ?? 0)))
                editor.view.dispatch(tr)
                editor.view.focus()
              }
            }
            return true
          } else return false
        },
      getAllBookmarks:
        (callback) =>
        ({ editor }) => {
          const bookmarkData: any[] = []
          try {
            const alltext = editor.getHTML()
            const parser = new DOMParser()
            const doc = parser.parseFromString(alltext, 'text/html')
            // 获取所有的 <bookmark> 元素
            const bookmarks = doc.body.querySelectorAll(this.name)
            const keyNode: string[] = []
            Array.from(bookmarks).forEach((node) => {
              if (node !== null) {
                const bookName = node.getAttribute('bookmarkName')
                if (bookName && !keyNode.includes(bookName)) {
                  keyNode.push(bookName)
                  bookmarkData.push({
                    bookmarkRowId: shortId(),
                    bookmarkRowName: bookName,
                  })
                }
              }
            })
          } catch (e) {}
          callback(bookmarkData)
          return true
        },
    }
  },
})
