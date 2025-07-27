import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Bookmark, Download, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { businessAssistant, type ChatMessage } from '../lib/openai';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  bookmarked?: boolean;
  isStreaming?: boolean;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI business assistant powered by OpenAI. I can help you with marketing strategies, financial planning, operations management, business strategy, and more. What business challenge can I help you solve today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if API key is configured
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_openai_api_key_here') {
      setError('OpenAI API key not configured. Please add your API key to the .env file.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages to OpenAI format
      const chatMessages: ChatMessage[] = messages
        .filter(msg => !msg.isStreaming)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Add the current user message
      chatMessages.push({
        role: 'user',
        content: input
      });

      // Get AI response
      const response = await businessAssistant.getChatCompletion(chatMessages);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
      
      // Provide specific guidance for quota errors
      if (error instanceof Error && error.message.includes('quota')) {
        setError('OpenAI API quota exceeded. Please visit platform.openai.com to check your billing and upgrade your plan if needed.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to get AI response');
      }
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the AI service right now. Please check your API configuration and try again.",
        timestamp: new Date()
      };
      // Don't add generic error message if we already set a specific error
    } finally {
      setIsLoading(false);
    }
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
        content: "Hello! I'm your AI business assistant powered by OpenAI. I can help you with marketing strategies, financial planning, operations management, business strategy, and more. What business challenge can I help you solve today?",
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-consultation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">AI Business Assistant</h1>
              <p className="text-xs text-gray-500 sm:text-sm">Powered by OpenAI GPT</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={exportConversation}
              className="px-2 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors sm:px-3 sm:text-sm"
            >
              <Download className="h-4 w-4 sm:mr-2 inline" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={clearConversation}
              className="px-2 py-2 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors sm:px-3 sm:text-sm"
            >
              <Trash2 className="h-4 w-4 sm:mr-2 inline" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4 sm:p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 max-w-full sm:space-x-3 sm:max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center sm:w-8 sm:h-8 ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-3 w-3 text-white sm:h-5 sm:w-5" />
                ) : (
                  <Bot className="h-3 w-3 text-gray-600 sm:h-5 sm:w-5" />
                )}
              </div>
              <div className={`flex-1 px-3 py-2 rounded-lg sm:px-4 sm:py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
            <div className="flex space-x-2 max-w-full sm:space-x-3 sm:max-w-3xl">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center sm:w-8 sm:h-8">
                <Bot className="h-3 w-3 text-gray-600 sm:h-5 sm:w-5" />
              </div>
              <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg sm:px-4 sm:py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
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
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about marketing, finance, operations, strategy, or any business topic..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none sm:px-4 sm:py-3 sm:text-base"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:px-6 sm:py-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}