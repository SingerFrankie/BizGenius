import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Bookmark, Download, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  bookmarked?: boolean;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI business assistant. I can help you with marketing strategies, financial planning, operations management, and more. What business question can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (question: string): string => {
    const responses = {
      marketing: "For effective marketing, focus on understanding your target audience, creating valuable content, and maintaining consistent brand messaging across all channels. Consider digital marketing strategies like SEO, social media marketing, and email campaigns for cost-effective reach.",
      finance: "Financial planning requires careful cash flow management, regular monitoring of key metrics like ROI and profit margins, and maintaining adequate reserves. Consider implementing financial forecasting and budgeting tools to track performance.",
      operations: "Streamline your operations by identifying bottlenecks, automating repetitive tasks, and implementing quality control measures. Focus on efficiency while maintaining service quality.",
      strategy: "Develop a clear business strategy by analyzing your market position, identifying competitive advantages, and setting measurable goals. Regularly review and adapt your strategy based on market changes."
    };

    const lowerInput = question.toLowerCase();
    if (lowerInput.includes('market')) return responses.marketing;
    if (lowerInput.includes('financ') || lowerInput.includes('money')) return responses.finance;
    if (lowerInput.includes('operat')) return responses.operations;
    if (lowerInput.includes('strateg')) return responses.strategy;
    
    return "That's an excellent business question! Based on current best practices, I'd recommend taking a data-driven approach to this challenge. Could you provide more specific details about your situation so I can give you more targeted advice?";
  };

  const toggleBookmark = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, bookmarked: !msg.bookmarked }
          : msg
      )
    );
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hello! I'm your AI business assistant. I can help you with marketing strategies, financial planning, operations management, and more. What business question can I help you with today?",
        timestamp: new Date()
      }
    ]);
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-conversation.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">AI Business Assistant</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Get expert business advice powered by AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={exportConversation}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 sm:mr-2 inline" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={clearConversation}
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4 sm:mr-2 inline" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 sm:space-x-3 max-w-full sm:max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  {message.type === 'assistant' && (
                    <button
                      onClick={() => toggleBookmark(message.id)}
                      className={`p-1 rounded ${
                        message.bookmarked
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-gray-400 hover:text-gray-600'
                      } transition-colors`}
                    >
                      <Bookmark className="h-4 w-4" fill={message.bookmarked ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2 sm:space-x-3 max-w-full sm:max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-6">
        <div className="flex space-x-2 sm:space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about marketing, finance, operations, strategy..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}