import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend API
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class BusinessAssistant {
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

Keep responses concise but comprehensive. Ask clarifying questions when needed to provide better advice.`;

  async getChatCompletion(messages: ChatMessage[]): Promise<string> {
    try {
      // Add system prompt as the first message if not present
      const messagesWithSystem = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // You can change to 'gpt-4' if you have access
        messages: messagesWithSystem,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      });

      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please check your OpenAI billing.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
      }
      
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async getStreamingResponse(messages: ChatMessage[]): Promise<ReadableStream> {
    try {
      const messagesWithSystem = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages
      ];

      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messagesWithSystem,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      });

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(content);
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      throw error;
    }
  }
}

export const businessAssistant = new BusinessAssistant();