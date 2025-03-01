import { callClaudeAPI } from '../../lib/claude';
import { parseYAMLFromResponse } from '../../lib/yaml-parser';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    // Call Claude API with your prompt template
    const claudeResponse = await callClaudeAPI(jobDescription);
    
    // Parse YAML from Claude's response
    const resumeData = parseYAMLFromResponse(claudeResponse);
    
    return res.status(200).json({ resumeData });
  } catch (error) {
    console.error('Error generating resume:', error);
    return res.status(500).json({ 
      error: 'Failed to generate resume',
      details: error.message 
    });
  }
}