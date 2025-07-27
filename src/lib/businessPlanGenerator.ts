// OpenRouter API Integration for Business Plan Generation
interface BusinessPlanInput {
  businessName: string;
  industry: string;
  businessType: string;
  location: string;
  targetAudience: string;
  uniqueValue: string;
  revenueModel: string;
  goals: string;
}

interface BusinessPlanSection {
  title: string;
  content: string;
}

interface GeneratedBusinessPlan {
  id: string;
  title: string;
  industry: string;
  createdAt: Date;
  sections: BusinessPlanSection[];
  status: 'draft' | 'complete';
}

export class BusinessPlanGenerator {
  private apiKey: string;
  
  private baseUrl = 'https://openrouter.ai/api/v1';
  private model = 'tngtech/deepseek-r1t2-chimera:free';

  private systemPrompt = `You are an expert business plan consultant with 20+ years of experience helping entrepreneurs and startups create professional, investor-ready business plans. Your expertise includes:

- Market analysis and competitive research
- Financial modeling and projections
- Strategic planning and growth strategies
- Risk assessment and mitigation
- Industry-specific insights and trends
- Investor presentation and funding strategies

Create comprehensive, professional business plans that are:
- Well-structured with clear sections
- Data-driven with realistic projections
- Tailored to the specific industry and market
- Investor-ready with compelling narratives
- Actionable with clear implementation steps

IMPORTANT: Format your response as clean, readable text without any markdown formatting, asterisks, or special characters. Use plain text with proper paragraphs and line breaks. Structure your response with the following sections:
1. Executive Summary
2. Company Description
3. Market Analysis
4. Organization & Management
5. Products or Services
6. Marketing & Sales Strategy
7. Financial Projections
8. Risk Analysis
9. Implementation Timeline
10. Appendices

Each section should be detailed, professional, and specific to the business context provided. Write in clear, professional language without any formatting symbols, asterisks, or markdown. Use proper paragraphs with line breaks for readability.`;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured');
    }
  }

  async generateBusinessPlan(input: BusinessPlanInput): Promise<GeneratedBusinessPlan> {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not configured. Please add your API key to the .env file.');
    }

    try {
      const prompt = this.createBusinessPlanPrompt(input);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BizGenius Business Plan Generator'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4000,
          temperature: 0.7,
          stream: false,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter billing.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      const generatedContent = data.choices[0]?.message?.content || 'Failed to generate business plan.';

      // Parse the generated content into sections
      const sections = this.parseBusinessPlanSections(generatedContent);

      const businessPlan: GeneratedBusinessPlan = {
        id: Date.now().toString(),
        title: `${input.businessName} Business Plan`,
        industry: input.industry,
        createdAt: new Date(),
        sections,
        status: 'complete'
      };

      return businessPlan;
    } catch (error) {
      console.error('Business Plan Generation Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to generate business plan. Please try again.');
    }
  }

  private createBusinessPlanPrompt(input: BusinessPlanInput): string {
    return `Create a comprehensive, professional business plan for the following business:

**Business Details:**
- Business Name: ${input.businessName}
- Industry: ${input.industry}
- Business Type: ${input.businessType}
- Location: ${input.location}
- Target Audience: ${input.targetAudience}
- Unique Value Proposition: ${input.uniqueValue}
- Revenue Model: ${input.revenueModel}
- Goals: ${input.goals}

Please create a detailed, investor-ready business plan that includes:
- Market research specific to ${input.industry} in ${input.location}
- Competitive analysis and positioning
- Realistic financial projections for 3-5 years
- Marketing strategies tailored to ${input.targetAudience}
- Implementation roadmap aligned with the goal: ${input.goals}
- Risk assessment and mitigation strategies
- Industry-specific insights and trends

The plan should be professional, comprehensive, and ready for presentation to investors, lenders, or stakeholders. Include specific data, metrics, and actionable strategies where possible.`;
  }

  private parseBusinessPlanSections(content: string): BusinessPlanSection[] {
    const sections: BusinessPlanSection[] = [];
    
    // Clean up the content first - remove asterisks and markdown formatting
    const cleanContent = content
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove asterisks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/^\s*[-•]\s/gm, '• ') // Normalize bullet points
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
      .trim();
    
    // Split content by common section headers
    const sectionHeaders = [
      'Executive Summary',
      'Company Description',
      'Market Analysis',
      'Organization & Management',
      'Products or Services',
      'Marketing & Sales Strategy',
      'Financial Projections',
      'Risk Analysis',
      'Implementation Timeline',
      'Appendices'
    ];

    let currentSection = '';
    let currentContent = '';
    
    const lines = cleanContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this line is a section header
      const matchedHeader = sectionHeaders.find(header => 
        trimmedLine.toLowerCase().includes(header.toLowerCase()) &&
        (trimmedLine.match(/^\d+\./) || trimmedLine.toLowerCase() === header.toLowerCase())
      );
      
      if (matchedHeader) {
        // Save previous section if it exists
        if (currentSection && currentContent.trim()) {
          sections.push({
            title: currentSection,
            content: this.formatSectionContent(currentContent.trim())
          });
        }
        
        // Start new section
        currentSection = matchedHeader;
        currentContent = '';
      } else {
        // Add content to current section
        currentContent += line + '\n';
      }
    }
    
    // Add the last section
    if (currentSection && currentContent.trim()) {
      sections.push({
        title: currentSection,
        content: this.formatSectionContent(currentContent.trim())
      });
    }
    
    // If no sections were parsed, create a single section with all content
    if (sections.length === 0) {
      sections.push({
        title: 'Business Plan',
        content: this.formatSectionContent(cleanContent)
      });
    }
    
    return sections;
  }

  private formatSectionContent(content: string): string {
    return content
      .replace(/\*\*/g, '') // Remove any remaining bold markdown
      .replace(/\*/g, '') // Remove any remaining asterisks
      .replace(/^\s*[-•]\s/gm, '• ') // Normalize bullet points
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .replace(/^\s+/gm, '') // Remove leading whitespace from lines
      .trim();
  }

  // Export business plan to different formats
  exportToPDF(businessPlan: GeneratedBusinessPlan): void {
    const content = this.formatBusinessPlanForExport(businessPlan);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessPlan.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToWord(businessPlan: GeneratedBusinessPlan): void {
    const content = this.formatBusinessPlanForExport(businessPlan);
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessPlan.title.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private formatBusinessPlanForExport(businessPlan: GeneratedBusinessPlan): string {
    let content = `${businessPlan.title}\n`;
    content += `Industry: ${businessPlan.industry}\n`;
    content += `Created: ${businessPlan.createdAt.toLocaleDateString()}\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    businessPlan.sections.forEach(section => {
      content += `${section.title}\n`;
      content += '-'.repeat(section.title.length) + '\n\n';
      content += `${section.content}\n\n`;
    });
    
    return content;
  }

  // Get available models
  async getAvailableModels(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  // Change model
  setModel(model: string) {
    this.model = model;
  }

  getCurrentModel(): string {
    return this.model;
  }

  // Modify existing business plan with AI assistance
  async modifyBusinessPlan(
    businessPlan: GeneratedBusinessPlan, 
    modificationRequest: string
  ): Promise<GeneratedBusinessPlan> {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not configured. Please add your API key to the .env file.');
    }

    try {
      const currentPlanText = this.formatBusinessPlanForModification(businessPlan);
      
      const prompt = `You are an expert business plan consultant. Please modify the following business plan based on this specific request: "${modificationRequest}"

Current Business Plan:
${currentPlanText}

Please provide the complete modified business plan with all sections updated as needed. Maintain the same professional structure and format. Focus specifically on the requested changes while ensuring the entire plan remains coherent and professional.

IMPORTANT: Format your response as clean, readable text without any markdown formatting, asterisks, or special characters. Use plain text with proper paragraphs and line breaks.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BizGenius Business Plan Modifier'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4000,
          temperature: 0.7,
          stream: false,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter billing.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }
      }

      const data = await response.json();
      const modifiedContent = data.choices[0]?.message?.content || 'Failed to modify business plan.';

      // Parse the modified content into sections
      const sections = this.parseBusinessPlanSections(modifiedContent);

      const modifiedPlan: GeneratedBusinessPlan = {
        ...businessPlan,
        id: Date.now().toString(), // New ID for modified version
        title: `${businessPlan.title} (Modified)`,
        createdAt: new Date(),
        sections,
        status: 'complete'
      };

      return modifiedPlan;
    } catch (error) {
      console.error('Business Plan Modification Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to modify business plan. Please try again.');
    }
  }

  private formatBusinessPlanForModification(businessPlan: GeneratedBusinessPlan): string {
    let content = `${businessPlan.title}\n`;
    content += `Industry: ${businessPlan.industry}\n\n`;
    
    businessPlan.sections.forEach(section => {
      content += `${section.title}\n`;
      content += `${section.content}\n\n`;
    });
    
    return content;
  }
}

export const businessPlanGenerator = new BusinessPlanGenerator();
export type { BusinessPlanInput, GeneratedBusinessPlan, BusinessPlanSection };