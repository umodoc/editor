import { DocxSerializer, defaultNodes, defaultMarks,defaultDocxSerializer, writeDocx } from 'prosemirror-docx';

import { writeFileSync } from 'fs';
async function exportDocx(editor,name) {
  const { doc } = editor.state;
  const nodeSerializer = {
    ...defaultNodes,
    page(state, node) {
      state.renderContent(node)
      state.closeBlock(node);
    },
  };
  const umoDocxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);
  const wordDocument  = umoDocxSerializer.serialize(doc, {
    getImageBuffer: (src) => {
      const img = new Image();
      img.src = src;
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          resolve(canvas.toDataURL("image/png"))
        }
      })
    }
  })
  await writeDocx(wordDocument, (buffer) => {
    writeFileSync(name+'.docx', buffer);
  });
}