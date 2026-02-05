'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, ChevronDown, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getFinancialSnapshot,
  generateInsights,
  answerQuery,
  storeInsights,
  type Insight,
} from '@/lib/oracle';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  insights?: Insight[];
}

/**
 * AIAssistant — Oracle Financial Advisor
 *
 * Real data analysis using the heuristics engine.
 * No hardcoded responses. All answers come from actual user data.
 */
export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Generate initial greeting with real insights
  const initializeChat = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const snapshot = getFinancialSnapshot();
    const insights = generateInsights(snapshot);
    storeInsights(insights);

    const hasData = snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes;

    let greeting = 'Merhaba! Ben Budgeify Oracle, yapay zeka finansal danismaniniz.';

    if (hasData && insights.length > 0) {
      const topInsight = insights[0];
      greeting += `\n\n${topInsight.title}: ${topInsight.content}`;
      greeting += '\n\nBaska bir konu hakkinda sormak ister misiniz?';
    } else {
      greeting += '\n\nGelir ve giderlerinizi kaydetmeye baslayin, size kisisel finansal analizler sunayim.';
    }

    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      insights: insights.slice(0, 3),
    }]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, initializeChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const suggestedActions = [
    'Bu ay ne kadar harcadim?',
    'Butce saglik puanim kac?',
    'Hedeflerime ne kadar yakinim?',
    'Tasarruf onerisi ver',
  ];

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Simulate slight delay for natural feel, then compute real answer
    setTimeout(() => {
      const snapshot = getFinancialSnapshot();
      const response = answerQuery(queryText, snapshot);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 600);
  }, [inputValue]);

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => {
      const snapshot = getFinancialSnapshot();
      const response = answerQuery(action, snapshot);

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: action, timestamp: new Date() },
      ]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() },
        ]);
      }, 400);
    }, 100);
    setInputValue('');
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
                      ai-gradient ai-glow animate-pulse-glow"
            aria-label="Oracle AI Asistan"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Sparkles size={24} className="text-white" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-cosmic-900/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col
                  max-h-[85vh] rounded-t-3xl
                  bg-gradient-to-b from-cosmic-700/95 to-cosmic-800/95
                  backdrop-blur-xl border-t border-x border-white/10
                  shadow-2xl shadow-black/50"
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl ai-gradient shadow-lg">
              <Sparkles size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Oracle AI</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-slate-400">Gercek veri analizi</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Refresh insights
                const snapshot = getFinancialSnapshot();
                const insights = generateInsights(snapshot);
                storeInsights(insights);
                const summaryMsg: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: insights.slice(0, 3).map((i) => `${i.title}: ${i.content}`).join('\n\n') || 'Analiz icin veri bekleniyor.',
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, summaryMsg]);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full
                         bg-white/5 text-slate-400 transition-all
                         hover:bg-white/10 hover:text-accent-400 active:scale-95"
              aria-label="Analizi yenile"
            >
              <Activity size={16} strokeWidth={2} />
            </button>
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
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-accent-600 text-white rounded-br-md'
                    : 'ai-message-gradient text-slate-200 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={`flex items-center gap-2 mt-1.5 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.role === 'assistant' && message.insights && message.insights.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-accent-400">
                      <Zap size={10} />
                      {message.insights.length} analiz
                    </span>
                  )}
                  <p className={`text-[10px] ${
                    message.role === 'user' ? 'text-white/60' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="ai-message-gradient rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestedAction(action)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium
                             bg-white/5 text-slate-300 border border-white/10
                             transition-all hover:bg-white/10 hover:border-white/20"
                  whileTap={{ scale: 0.95 }}
                >
                  {action}
                </motion.button>
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
              placeholder="Bir soru sorun..."
              className="flex-1 h-12 px-4 rounded-xl
                         bg-white/5 border border-white/10
                         text-white placeholder-slate-500
                         focus:outline-none focus:border-accent-500/50 focus:bg-white/10
                         transition-all duration-200"
              aria-label="Mesaj yaz"
            />
            <motion.button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`flex h-12 w-12 items-center justify-center rounded-xl
                         transition-all duration-200
                         ${inputValue.trim()
                           ? 'ai-gradient text-white shadow-lg shadow-accent-500/25'
                           : 'bg-white/5 text-slate-500'
                         }`}
              aria-label="Gonder"
              whileTap={{ scale: 0.95 }}
            >
              <Send size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AIAssistant;
