import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'student';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  currentQuestion: number;
  totalQuestions: number;
}

export default function ChatInterface({ messages, currentQuestion, totalQuestions }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: chatMessages.length + 1,
      sender: 'student',
      content: input,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, newMessage]);
    setInput('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: chatMessages.length + 2,
        sender: 'ai',
        content: "Thank you for your explanation. Let me follow up on that point...",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">AI Examiner</h3>
              <p className="text-xs text-gray-500">Dr. Virtual Assistant</p>
            </div>
          </div>
          <div className="text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            Question {currentQuestion} of {totalQuestions}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'student' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'ai' ? 'bg-indigo-100' : 'bg-gray-200'
            }`}>
              {message.sender === 'ai' ? (
                <Bot className="w-5 h-5 text-indigo-600" />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className={`flex-1 max-w-2xl ${message.sender === 'student' ? 'items-end' : ''}`}>
              <div className={`rounded-lg p-4 ${
                message.sender === 'ai'
                  ? 'bg-gray-50 border border-gray-200'
                  : 'bg-indigo-600 text-white'
              }`}>
                <p className={`text-sm leading-relaxed ${
                  message.sender === 'ai' ? 'text-gray-900' : 'text-white'
                }`}>
                  {message.content}
                </p>
              </div>
              <div className={`text-xs text-gray-500 mt-1 px-1 ${
                message.sender === 'student' ? 'text-right' : ''
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Answer questions clearly and concisely. You can reference specific lines of code.
        </p>
      </div>
    </div>
  );
}
