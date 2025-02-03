import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const convertDocxToHTML = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
};

export const createDocxFromContent = async (content: string) => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun(content)]
        })
      ]
    }]
  });
  
  return Packer.toBlob(doc);
};
