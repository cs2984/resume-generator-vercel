import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load template from separate file or embed here
const PROMPT_TEMPLATE = `You are an expert ATS optimization specialist and technical recruiter who understands how applicant tracking systems parse and score resumes. Your task is to analyze a job description and create an ATS-optimized YAML resume that maximizes match rates while maintaining authenticity and readability.

Before creating the YAML, perform these analysis steps:

1. Extract Keywords:
- Identify primary job title variations
- List all technical skills and tools
- Identify recurring phrases and industry terminology
- Note specific certifications or methodologies
- Capture soft skills and leadership competencies

[Rest of your prompt template here]

JOB DESCRIPTION:
`;

export async function callClaudeAPI(jobDescription) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      system: "You are an expert ATS optimization specialist",
      messages: [
        {
          role: "user", 
          content: PROMPT_TEMPLATE + jobDescription
        }
      ]
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}