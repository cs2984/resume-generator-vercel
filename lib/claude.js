import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load template from separate file or embed here
const PROMPT_TEMPLATE = `You are an expert ATS optimization specialist and technical recruiter who understands how applicant tracking systems parse and score resumes. Your task is to analyze a job description and create an ATS-optimized YAML resume that maximizes match rates while maintaining authenticity and readability.

Reference Documents:
{reference_files}

You will analyze a job description and create an ATS-optimized YAML resume that:
- Maximizes keyword matching
- Uses consistent terminology
- Maintains proper formatting
- Emphasizes relevant experience
- Incorporates appropriate keyword density

Before creating the YAML, perform these analysis steps:

1. Extract Keywords:
- Identify primary job title variations
- List all technical skills and tools
- Identify recurring phrases and industry terminology
- Note specific certifications or methodologies
- Capture soft skills and leadership competencies

2. Create Keyword Categories:
- Must-have technical skills
- Preferred technical skills
- Required methodologies/frameworks
- Soft skills and competencies
- Industry-specific terminology
- Tools and platforms

3. Analyze Keyword Frequency:
- Note which terms appear multiple times
- Identify synonyms used for the same concept
- Record specific versions/variations of tools or technologies

Using the keyword analysis, create a YAML file with these ATS optimization rules:

1. Professional Summary:
- Include the exact job title from the posting
- Incorporate top 3-4 most frequent keywords
- Use industry-standard terminology
- Keep under 4-5 lines for optimal ATS parsing

2. Core Competencies:
- Match exact phrases from job description
- Include both spelled-out and acronym versions of key terms
- Order by frequency in job description
- Maintain 75% keyword match rate with job requirements

3. Skills:
- Use consistent formatting for all technical skills
- Include version numbers where mentioned in job description
- Group similar technologies using job description terminology
- List skills using exact matches from job posting
- Avoid graphics, special characters, or custom bullets

4. Professional Experience:
- Start each bullet with strong action verbs from job description
- Include at least one major keyword in each bullet point
- Place most relevant keywords in first 2-3 words of bullets
- Maintain 2-3 keywords per bullet without overstuffing
- Use metrics and numbers to break up keyword text
- Keep bullets between 1-2 lines for optimal parsing

5. Additional Experience & Education:
- Include relevant certifications using exact terminology
- Add any coursework that matches job requirements
- Use standard degree terminology

After creating the YAML, verify:
1. Keyword Optimization:
- Critical keywords appear in first 2-3 lines
- Each major requirement has corresponding experience
- Keywords are used naturally within context
- Proper noun capitalization matches job description
- Appropriate keyword density (5-8% per section)

The YAML should follow the structure of the original resume file provided.

JOB DESCRIPTION:
{job_description}

CURRENT RESUME:
{resume_content}

After analyzing the job description, provide:
1. A brief summary of key requirements identified
2. A list of critical keywords extracted
3. The ATS-optimized YAML file matching the structure of the original resume
`;

export async function callClaudeAPIWithFiles(
  jobDescription,
  resumeContent,
  referenceContents = []
) {
  try {
    // Format reference files section
    let referenceFilesText = '';
    if (referenceContents.length > 0) {
      referenceFilesText = referenceContents.map((file, index) => 
        `${index + 1}. ${file.name} - Content:\n${file.content.substring(0, 1000)}${file.content.length > 1000 ? '...' : ''}`
      ).join('\n\n');
    } else {
      referenceFilesText = 'No additional reference documents provided.';
    }
    
    // Prepare the prompt with file contents
    const prompt = PROMPT_TEMPLATE
      .replace('{job_description}', jobDescription)
      .replace('{resume_content}', resumeContent)
      .replace('{reference_files}', referenceFilesText);
    
    // Call Claude API  
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      system: "You are an expert ATS optimization specialist",
      messages: [
        {
          role: "user", 
          content: prompt
        }
      ]
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Claude API error: ${error.message}`);
  }
}