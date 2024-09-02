import type { Node as ProsemirrorNode } from '@tiptap/pm/model'
import {
  Document,
  type INumberingOptions,
  type ISectionOptions,
  Packer,
  SectionType,
} from 'docx'

import type { IFootnotes } from './types'

export function createShortId() {
  return Math.random().toString(36).substr(2, 9)
}

export function createDocFromState(state: {
  numbering: INumberingOptions['config']
  children: ISectionOptions['children']
  footnotes?: IFootnotes
}) {
  const doc = new Document({
    footnotes: state.footnotes,
    numbering: {
      config: state.numbering,
    },
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: state.children,
      },
    ],
  })
  return doc
}

export async function writeDocx(
  doc: Document,
  write: ((buffer: Buffer) => void) | ((buffer: Buffer) => Promise<void>),
) {
  const buffer = await Packer.toBuffer(doc)
  return write(buffer)
}

export function getLatexFromNode(node: ProsemirrorNode): string {
  let math = ''
  node.forEach((child) => {
    if (child.isText) {
      math += child.text
    }
    // TODO: improve this as we may have other things in the future
  })
  return math
}
