import { Mark,
    mergeAttributes  } from '@tiptap/core'
  
  export interface BookMarkOptions {
    /**
     *样式 左右有括号 {}
     * @default umo-editor-bookmark
     * @example 
     */
     class: string|undefined,
    /**
     *书签名称
     * @default 不可为空 唯一标识 用于定位 删除等操作
     * @example true
     */
     bookMarkName:string|undefined,
    
  }
  declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      bookMark: {
        /**
         * Set a bookMark//设置书签
         * @param attributes 
         * @example
         */
        setBookMark: (attributes: {
          bookMarkName:string|undefined,
        }) => ReturnType;
      };
    }
  }
  //书签格式 创建一个书签
   const BookMark = Mark.create<BookMarkOptions>({
    name: 'bookMark',
    priority: 1000,
    keepOnSplit: false,
    exitable: true,
    addOptions() {
      return {
        bookMarkName:"",
        class:"umo-editor-bookmark"
      }
    },
    addAttributes() {
      return {
        bookMarkName:{
          default:"bookMarkName",
        },
        class:{
          default:this.options.class?this.options.class:undefined
        }
      }
    },
    
    parseHTML() {
      return [
        {
          tag: 'bookMark',
        }
      ]
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['bookMark', mergeAttributes(this.options, HTMLAttributes), 0]
    },
  
    addCommands() {
      return {
        setBookMark:attributes=> ({ chain }) => {
          return chain().setMark(this.name,attributes).run()
        }
      }
    },
  })
  
  export default BookMark