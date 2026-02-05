'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

/**
 * AIAssistant - Intelligent Financial Companion
 *
 * A floating AI button that opens a chat drawer.
 * Features:
 * - Pulse glow animation
 * - Smooth drawer transition
 * - Message bubbles
 * - Typing indicator
 * - Suggested actions
 */
export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! Ben Budgeify AI asistanınızım. Size finansal hedeflerinize ulaşmanızda yardımcı olmak için buradayım. Nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedActions = [
    'Bu ay ne kadar harcadım?',
    'Tasarruf önerilerin var mı?',
    'Hedeflerime ne kadar yakınım?',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('harcadım') || lowerInput.includes('harcama')) {
      return 'Bu ay toplam harcamalarınızı analiz ediyorum... Gider sayfasından detaylı dökümü görebilirsiniz. En büyük harcama kategoriniz genellikle market ve yemek oluyor. Bütçenizi daha iyi yönetmek için bu kategorilere dikkat etmenizi öneririm.';
    }

    if (lowerInput.includes('tasarruf') || lowerInput.includes('biriktir')) {
      return 'Tasarruf yapmanız için birkaç önerim var:\n\n1. 50/30/20 kuralını deneyin: Gelirinizin %50\'si zorunlu giderler, %30\'u istekler, %20\'si tasarruf için.\n\n2. Küçük harcamaları takip edin - kahve ve atıştırmalıklar toplamda büyük rakamlara ulaşabilir.\n\n3. Otomatik tasarruf sistemi kurun.';
    }

    if (lowerInput.includes('hedef') || lowerInput.includes('yakın')) {
      return 'Hedefler sayfasında aktif hedeflerinizi ve ilerlemenizi görebilirsiniz. Düzenli birikim yaparak hedeflerinize daha hızlı ulaşabilirsiniz. Size özel bir tasarruf planı oluşturmamı ister misiniz?';
    }

    return 'Anlıyorum! Size daha iyi yardımcı olabilmem için birkaç önerim var:\n\n• Harcamalarınızı düzenli olarak kaydedin\n• Aylık bütçe hedefleri belirleyin\n• Tasarruf hedeflerinizi takip edin\n\nBaşka sorularınız varsa sormaktan çekinmeyin!';
  };

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
                    ai-gradient ai-glow animate-pulse-glow
                    transition-all duration-300 hover:scale-110 active:scale-95
                    ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}
        aria-label="AI Asistan"
      >
        <Sparkles size={24} className="text-white" strokeWidth={2} />
      </button>

      {/* Chat Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-cosmic-900/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col
                    max-h-[85vh] rounded-t-3xl
                    bg-gradient-to-b from-cosmic-700/95 to-cosmic-800/95
                    backdrop-blur-xl border-t border-x border-white/10
                    shadow-2xl shadow-black/50
                    transition-all duration-500 ease-out
                    ${isOpen
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0 pointer-events-none'
                    }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient shadow-lg">
              <Sparkles size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Budgeify AI</h3>
              <p className="text-xs text-slate-400">Finansal asistanınız</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full
                       bg-white/5 text-slate-400 transition-all
                       hover:bg-white/10 hover:text-white active:scale-95"
            aria-label="Kapat"
          >
            <ChevronDown size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-accent-600 text-white rounded-br-md'
                    : 'ai-message-gradient text-slate-200 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-[10px] mt-1.5 ${
                  message.role === 'user' ? 'text-white/60' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="ai-message-gradient rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedAction(action)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium
                             bg-white/5 text-slate-300 border border-white/10
                             transition-all hover:bg-white/10 hover:border-white/20
                             active:scale-95"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Bir şey sorun..."
              className="flex-1 h-12 px-4 rounded-xl
                         bg-white/5 border border-white/10
                         text-white placeholder-slate-500
                         focus:outline-none focus:border-accent-500/50 focus:bg-white/10
                         transition-all duration-200"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`flex h-12 w-12 items-center justify-center rounded-xl
                         transition-all duration-200 active:scale-95
                         ${inputValue.trim()
                           ? 'ai-gradient text-white shadow-lg shadow-accent-500/25'
                           : 'bg-white/5 text-slate-500'
                         }`}
              aria-label="Gönder"
            >
              <Send size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
