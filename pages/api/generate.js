// pages/api/generate.js
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { callClaudeAPIWithFiles } from '../../lib/claude';
import { parseYAMLFromResponse } from '../../lib/yaml-parser';

// Disable built-in bodyParser to handle form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });
    
    const jobDescription = fields.jobDescription?.[0] || '';
    
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    // Read resume file
    const resumeFile = files.resume?.[0];
    if (!resumeFile) {
      return res.status(400).json({ error: 'Resume file is required' });
    }
    
    // Read resume content
    const resumeContent = await fs.readFile(resumeFile.filepath, 'utf8');
    
    // Read reference files if any
    const referenceFiles = Object.keys(files)
      .filter(key => key.startsWith('reference_'))
      .map(key => files[key][0]);
    
    const referenceContents = await Promise.all(
      referenceFiles.map(async (file) => ({
        name: file.originalFilename,
        content: await fs.readFile(file.filepath, 'utf8')
      }))
    );
    
    // Call Claude API with the files
    const claudeResponse = await callClaudeAPIWithFiles(
      jobDescription,
      resumeContent,
      referenceContents
    );
    
    // Parse YAML from Claude's response
    const resumeData = parseYAMLFromResponse(claudeResponse);
    
    // Clean up temporary files
    await Promise.all([
      fs.unlink(resumeFile.filepath),
      ...referenceFiles.map(file => fs.unlink(file.filepath))
    ]);
    
    return res.status(200).json({ resumeData });
  } catch (error) {
    console.error('Error generating resume:', error);
    return res.status(500).json({ 
      error: 'Failed to generate resume',
      details: error.message 
    });
  }
}