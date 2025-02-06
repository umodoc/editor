import { Extension } from '@tiptap/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setMargin: {
      setMargin: (options: any) => ReturnType
    }
    unsetMargin: {
      unsetMargin: () => ReturnType
    }
  }
}
export default Extension.create({
  name: 'margin',
  addOptions() {
    return {
      types: [
        'heading',
        'paragraph',
        'audio',
        'codeBlock',
        'file',
        'iframe',
        'image',
        'toc',
        'video',
        'horizontalRule',
        'table',
        'bulletList',
        'orderedList',
        'taskList',
        'echarts',
      ],
      margin: { top: 0, bottom: 0 },
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          margin: {
            default: {},
            parseHTML: (element) => {
              const { marginTop, marginBottom } = element.style
              if (
                (marginTop === '' && marginBottom === '') ||
                (marginTop === '0px' && marginBottom === '0px')
              ) {
                return {}
              }
              const styleMargin = { top: '0px', bottom: '0px' }
              if (marginTop && marginTop !== '0px') {
                styleMargin.top = marginTop.replace(/px/g, '')
              }
              if (marginBottom && marginBottom !== '0px') {
                styleMargin.bottom = marginBottom.replace(/px/g, '')
              }
              return styleMargin
            },
            renderHTML: ({ margin }) => {
              if (!Object.keys(margin).length) {
                return {}
              }
              const { top, bottom } = margin
              let styleMargin = ''
              if (top && top !== '') {
                styleMargin += `margin-top: ${top}px;`
              }
              if (bottom && bottom !== '') {
                styleMargin += `margin-bottom: ${bottom}px;`
              }
              return {
                style: styleMargin,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setMargin:
        (options) =>
        ({ editor, commands }) => {
          return this.options.types.every((type: string) => {
            const { margin } = editor.getAttributes(type)
            return commands.updateAttributes(type, {
              margin: Object.assign({}, margin, options),
            })
          })
        },
      unsetMargin:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.resetAttributes(type, 'margin'),
          )
        },
    }
  },
})
