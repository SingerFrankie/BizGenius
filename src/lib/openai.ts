// OpenRouter API Integration for Business Assistant
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class BusinessAssistant {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private model = 'anthropic/claude-3.5-sonnet'; // You can change this to other models

  private systemPrompt = `You are an expert AI Business Assistant specializing in helping entrepreneurs, startups, and business owners. Your expertise includes:

- Marketing strategies and digital marketing
- Financial planning and analysis  
- Operations management and optimization
- Business strategy and competitive analysis
- Leadership and team management
- Startup funding and investment
- Legal and regulatory guidance
- Technology and innovation

Provide practical, actionable advice that is:
- Clear and easy to understand
- Specific to the user's situation
- Based on current best practices
- Focused on real-world implementation

Keep responses concise but comprehensive and tailored too users context. Ask clarifying questions when needed to provide better advice.`;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured');
    }
  }

  async getChatCompletion(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not configured. Please add your API key to the .env file.');
    }

    try {
      // Add system prompt as the first message if not present
      const messagesWithSystem = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BizGenius AI Assistant'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messagesWithSystem,
          max_tokens: 1000,
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
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async getStreamingResponse(messages: ChatMessage[]): Promise<ReadableStream> {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not configured. Please add your API key to the .env file.');
    }

    try {
      const messagesWithSystem = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BizGenius AI Assistant'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messagesWithSystem,
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.error(new Error('No response body'));
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content || '';
                    if (content) {
                      controller.enqueue(content);
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('OpenRouter Streaming Error:', error);
      throw error;
    }
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
}

export const businessAssistant = new BusinessAssistant();
export type { ChatMessage };