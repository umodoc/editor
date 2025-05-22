import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import WordExporter from '@/components/menus/toolbar/export/word.vue' // Adjusted path
import type { Editor } from '@tiptap/vue-3'

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

// Mock html-to-docx
vi.mock('html-to-docx', () => ({
  default: vi.fn().mockResolvedValue(new Blob(['test docx content'])),
}))

describe('WordExporter.vue', () => {
  it('should call getHTML on editor and attempt to save a docx file when export button is clicked', async () => {
    const mockEditor = {
      getHTML: vi.fn(() => '<p>Test HTML content</p>'),
    }

    const wrapper = mount(WordExporter, {
      global: {
        provide: {
          // @ts-expect-error: Mocking editor
          editor: { value: mockEditor },
        },
        stubs: {
          'menus-button': { // Stubbing MenusButton to simplify testing
            template: '<button @click="$emit(\'menu-click\')"><slot /></button>',
          }
        }
      },
    })

    // Find the button (based on the stub) and click it
    const button = wrapper.find('button')
    await button.trigger('click')

    // Assert that editor.getHTML was called
    expect(mockEditor.getHTML).toHaveBeenCalledTimes(1)

    // Assert that html-to-docx was called
    const htmlToDocx = (await import('html-to-docx')).default
    expect(htmlToDocx).toHaveBeenCalledTimes(1)
    expect(htmlToDocx).toHaveBeenCalledWith('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>Test HTML content</p></body></html>')


    // Assert that saveAs was called
    const saveAs = (await import('file-saver')).saveAs
    expect(saveAs).toHaveBeenCalledTimes(1)
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'document.docx')
  })
})
