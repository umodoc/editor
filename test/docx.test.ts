import { describe, it, expect } from 'vitest';
import { convertDocxToHTML, createDocxFromContent } from '../src/utils/docxHandler';

describe('DOCX Compatibility', () => {
  it('should convert basic DOCX to HTML', async () => {
    const docxBlob = await createDocxFromContent('Test Content');
    const html = await convertDocxToHTML(new File([docxBlob], 'test.docx'));
    expect(html).toContain('Test Content');
  });

  it('should preserve basic formatting', async () => {
    const docxBlob = await createDocxFromContent('Bold Text');
    const html = await convertDocxToHTML(new File([docxBlob], 'formatted.docx'));
    expect(html).toMatch(/<strong>Bold Text<\/strong>/i);
  });
});
