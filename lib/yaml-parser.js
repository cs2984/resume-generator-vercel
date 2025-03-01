import yaml from 'js-yaml';

export function parseYAMLFromResponse(responseText) {
  try {
    // First try to find YAML within code blocks
    if (responseText.includes("```yaml") && responseText.includes("```")) {
      const yamlBlock = responseText.split("```yaml")[1].split("```")[0].trim();
      return yaml.load(yamlBlock);
    }
    
    // Next try to find YAML by looking for start markers
    const startMarkers = ["personal_information:", "Here's the optimized YAML:"];
    
    for (const marker of startMarkers) {
      const startIdx = responseText.indexOf(marker);
      if (startIdx !== -1) {
        const potentialYaml = responseText.substring(startIdx);
        try {
          return yaml.load(potentialYaml);
        } catch (e) {
          console.log(`Failed to parse with marker ${marker}:`, e);
          // Continue to next method
        }
      }
    }
    
    // If everything else fails, try to parse the entire response
    return yaml.load(responseText);
  } catch (error) {
    console.error("Error parsing YAML:", error);
    throw new Error("Could not parse resume data from Claude response");
  }
}