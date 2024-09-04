import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'placeholder',
  addOptions() {
    return {
      types: ['paragraph'],
      // @ts-ignore
      placeholder: null,
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          placeholder: {
            default: this.options.placeholder,
            parseHTML: (element) => element.getAttribute('data-placeholder'),
            renderHTML: ({ placeholder }) => ({ 'data-placeholder': placeholder }),
          },
        },
      },
    ]
  },
})
