import React, { useState, useRef, useEffect } from 'react';
import { UserSettings, Language, ChatMessage } from '../types';
import { UI_TEXT } from '../constants';
import { getGeminiResponse } from '../services/geminiService';
import { Send, User, Sparkles } from 'lucide-react';

interface Props {
  settings: UserSettings;
}

const AiAssistant: React.FC<Props> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isArabic = settings.language === Language.ARABIC;
  const t = UI_TEXT[settings.language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || ''; // In real app, secure this
      const responseText = await getGeminiResponse(messages, userMsg.text, apiKey);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: t.error,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="px-4 py-4 bg-white border-b border-emerald-100 flex items-center gap-2">
            <Sparkles className="text-emerald-500" />
            <h2 className="font-bold text-lg text-emerald-900">{t.askAiTitle}</h2>
        </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
             <Sparkles size={48} className="mb-4" />
             <p className="text-center max-w-xs">{t.askAiPlaceholder}</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-emerald-100 rounded-bl-none'
            }`}>
              {msg.text.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-emerald-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-emerald-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.askAiPlaceholder}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-colors"
          >
            <Send size={20} className={isArabic ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
