'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Send, ChevronDown, Activity, Zap, RotateCcw, BarChart3, Target, PiggyBank, TrendingUp } from 'lucide-react';
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

type SuggestionContext = 'home' | 'spending' | 'health' | 'goals' | 'savings';

/** Context-aware suggestion sets */
const SUGGESTION_MAP: Record<SuggestionContext, string[]> = {
  home: [
    'Bu ay ne kadar harcadim?',
    'Butce saglik puanim kac?',
    'Hedeflerime ne kadar yakinim?',
    'Tasarruf onerisi ver',
  ],
  spending: [
    'En cok hangi kategoriye harcadim?',
    'Gecen aya gore degisim ne?',
    'Harcamalarimda anormal bir sey var mi?',
  ],
  health: [
    'Puanimi nasil arttirabilirim?',
    'En buyuk risk faktorum ne?',
    'Tasarruf onerisi ver',
  ],
  goals: [
    'Gunluk ne kadar biriktirmeliyim?',
    'Hedefime ne zaman ulasabilirim?',
    'Yeni hedef onerisi ver',
  ],
  savings: [
    'Nerelerden kesinti yapabilirim?',
    'Bu ay ne kadar harcadim?',
    'Hedeflerime ne kadar yakinim?',
  ],
};

/** Determine next suggestion context from the last query */
function getNextContext(query: string): SuggestionContext {
  const q = query.toLowerCase();
  if (q.includes('harca') || q.includes('gider') || q.includes('kategori')) return 'spending';
  if (q.includes('saglik') || q.includes('puan') || q.includes('skor')) return 'health';
  if (q.includes('hedef') || q.includes('birikim') || q.includes('yakin')) return 'goals';
  if (q.includes('tasarruf') || q.includes('kesinti') || q.includes('oneri')) return 'savings';
  return 'home';
}

/**
 * AIAssistant — Oracle Financial Advisor v2.1
 *
 * Contextual conversation flow: suggestions adapt to the topic.
 * Ana Menü button always available to reset context.
 */
export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionCtx, setSuggestionCtx] = useState<SuggestionContext>('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const currentSuggestions = SUGGESTION_MAP[suggestionCtx];

  /** Context-specific chip icon */
  const contextIcons: Record<SuggestionContext, typeof BarChart3> = {
    home: Sparkles,
    spending: BarChart3,
    health: Activity,
    goals: Target,
    savings: PiggyBank,
  };
  const ContextIcon = contextIcons[suggestionCtx];

  // Generate initial greeting with real insights
  const initializeChat = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const snapshot = getFinancialSnapshot();
    const insights = generateInsights(snapshot);
    storeInsights(insights);

    const hasData = snapshot.dataAvailability.hasExpenses || snapshot.dataAvailability.hasIncomes;

    let greeting = 'Merhaba! Ben Oracle AI, finansal danismaniniz.';

    if (hasData && insights.length > 0) {
      const topInsight = insights[0];
      greeting += `\n\n${topInsight.title}: ${topInsight.content}`;
      greeting += '\n\nAlttan bir konu secin veya serbest soru sorun.';
    } else {
      greeting += '\n\nGelir ve giderlerinizi kaydetmeye baslayin, size kisisel analizler sunayim.';
    }

    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      insights: insights.slice(0, 3),
    }]);
  }, []);

  // Listen for BrainCard open event
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('oracle:open-assistant', handler);
    return () => window.removeEventListener('oracle:open-assistant', handler);
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

  const processQuery = useCallback((queryText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Update suggestion context based on query
    setSuggestionCtx(getNextContext(queryText));

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
    }, 500);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;
    processQuery(inputValue.trim());
    setInputValue('');
  }, [inputValue, processQuery]);

  const handleSuggestedAction = (action: string) => {
    processQuery(action);
  };

  const handleResetContext = () => {
    setSuggestionCtx('home');
    const resetMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Ana menuye dondum. Size nasil yardimci olabilirim?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, resetMsg]);
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
            className="fixed inset-0 z-50 backdrop-blur-md"
            style={{ background: 'rgba(5, 5, 8, 0.80)' }}
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
                  backdrop-blur-xl border-t border-x border-white/10
                  shadow-2xl shadow-black/50"
        style={{ background: 'linear-gradient(180deg, rgba(13, 13, 31, 0.95) 0%, rgba(10, 10, 26, 0.95) 100%)' }}
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
                {/* Actionable Insight Buttons — only on assistant messages with insights */}
                {message.role === 'assistant' && message.insights && message.insights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {message.insights.some((i) => i.type === 'trend' || i.type === 'anomaly') && (
                      <button
                        onClick={() => processQuery('Harcamalarimi nasil azaltabilirim?')}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                                   bg-rose-500/15 text-rose-300 border border-rose-500/20
                                   hover:bg-rose-500/25 transition-all active:scale-95"
                      >
                        <BarChart3 size={10} />
                        Butceyi Ayarla
                      </button>
                    )}
                    {message.insights.some((i) => i.type === 'goal') && (
                      <button
                        onClick={() => processQuery('Hedeflerime ne kadar yakinim?')}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                                   bg-violet-500/15 text-violet-300 border border-violet-500/20
                                   hover:bg-violet-500/25 transition-all active:scale-95"
                      >
                        <Target size={10} />
                        Hedefleri Gor
                      </button>
                    )}
                    {message.insights.some((i) => i.type === 'health') && (
                      <button
                        onClick={() => processQuery('Butce saglik puanim kac?')}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                                   bg-amber-500/15 text-amber-300 border border-amber-500/20
                                   hover:bg-amber-500/25 transition-all active:scale-95"
                      >
                        <Activity size={10} />
                        Saglik Analizi
                      </button>
                    )}
                  </div>
                )}
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

        {/* Contextual Pill Chips — always visible */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {/* Ana Menu chip — accent style, always visible unless home */}
            {suggestionCtx !== 'home' && (
              <motion.button
                onClick={handleResetContext}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold
                           bg-accent-500/15 text-accent-300 border border-accent-500/25
                           backdrop-blur-sm transition-all hover:bg-accent-500/25 hover:border-accent-400/40"
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <RotateCcw size={11} strokeWidth={2.5} />
                Ana Menu
              </motion.button>
            )}

            {/* Analiz Et chip — contextual quick action */}
            {suggestionCtx !== 'home' && (
              <motion.button
                onClick={() => handleSuggestedAction('Detayli analiz goster')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold
                           bg-emerald-500/15 text-emerald-300 border border-emerald-500/25
                           backdrop-blur-sm transition-all hover:bg-emerald-500/25 hover:border-emerald-400/40"
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 }}
              >
                <TrendingUp size={11} strokeWidth={2.5} />
                Analiz Et
              </motion.button>
            )}

            {/* Suggestion pills */}
            {currentSuggestions.map((action, i) => (
              <motion.button
                key={action}
                onClick={() => handleSuggestedAction(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
                           bg-zinc-900/60 text-slate-300 border border-white/8
                           backdrop-blur-sm transition-all
                           hover:bg-zinc-800/80 hover:border-white/15 hover:text-white"
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <ContextIcon size={11} strokeWidth={2} className="text-accent-400/70" />
                {action}
              </motion.button>
            ))}
          </div>
        </div>

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
