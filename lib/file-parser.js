// lib/file-parser.js
import mammoth from 'mammoth';
import { PDFExtract } from 'pdf.js-extract';

const pdfExtract = new PDFExtract();

export async function extractTextFromFile(file) {
  const fileType = file.originalFilename.split('.').pop().toLowerCase();
  
  switch (fileType) {
    case 'pdf':
      const pdfData = await pdfExtract.extract(file.filepath);
      return pdfData.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
      
    case 'docx':
      const result = await mammoth.extractRawText({ path: file.filepath });
      return result.value;
      
    case 'yaml':
    case 'yml':
    case 'txt':
    case 'md':
      return fs.readFile(file.filepath, 'utf8');
      
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}