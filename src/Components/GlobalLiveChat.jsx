import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, History, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ensureChatReply } from '../util/chat/ensureChatReply';
import { getSmartLocalReply, isPureGreetingOnly, isWeakGenericReply } from '../util/chat/smartChatReply';
import { sendVisaSupportChat } from '../util/chat/visaSupportChat';
import { GATEWAY_AI_ICON } from './gatewayAiIconData';

const WELCOME_TEXT =
  "Hello! I'm your visa support assistant. How can I help you today?";

const NAVBAR_HEIGHT = 60;

const THINKING_STAGES = [
  'Analyzing inquiry...',
  'Checking visa regulations...',
  'Synthesizing recommendation...',
];

const quickReplies = [
  'What visa services do you offer?',
  'How much does it cost?',
  'Tell me about IELTS prep',
  "What's your refund policy?",
];

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toApiMessages(messages) {
  return messages
    .filter((m) => m.sender === 'user' || (m.sender === 'agent' && m.id !== 'welcome'))
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
}

const GlobalLiveChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: WELCOME_TEXT,
      sender: 'agent',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingStageIndex, setThinkingStageIndex] = useState(0);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [lastReplySource, setLastReplySource] = useState('local');
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) {
      setThinkingStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStageIndex((prev) => (prev + 1) % THINKING_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isTyping]);

  /**
   * Smart reply chain:
   * 1. Pure greetings / thanks / bye → instant local (no API)
   * 2. Try Supabase edge function (Gemini/Groq AI)
   * 3. If API reply is weak/generic → replace with smart local
   * 4. If API fails entirely → smart local fallback
   */
  const requestAssistantReply = useCallback(async (historyMessages) => {
    const apiMessages = toApiMessages(historyMessages);
    const lastMsg = apiMessages[apiMessages.length - 1]?.content ?? '';

    // 1) Instant local for trivial messages (greetings, thanks, bye)
    if (isPureGreetingOnly(lastMsg)) {
      return { text: ensureChatReply(getSmartLocalReply(apiMessages)), source: 'local' };
    }

    // 2) Try API first for substantive questions
    try {
      const api = await sendVisaSupportChat(apiMessages);
      if (api.ok && typeof api.reply === 'string' && api.reply.trim()) {
        const engineSource = api.engine || 'openrouter';
        const replyText = ensureChatReply(api.reply);

        if (isWeakGenericReply(replyText)) {
          const smartLocal = ensureChatReply(getSmartLocalReply(apiMessages));
          if (!isWeakGenericReply(smartLocal)) {
            return { text: smartLocal, source: engineSource };
          }
        }

        return { text: replyText, source: engineSource };
      }
    } catch {
      // API failed — fall through to local
    }

    // 4) Smart local fallback
    return {
      text: ensureChatReply(getSmartLocalReply(apiMessages)),
      source: 'local',
    };
  }, []);

  const sendUserText = useCallback(
    async (text) => {
      const trimmed = String(text ?? '').trim();
      if (!trimmed || sendingRef.current) return;

      const userMessage = {
        id: nextId(),
        text: trimmed,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      let historyForApi = [];
      setMessages((prev) => {
        historyForApi = [...prev, userMessage];
        return historyForApi;
      });
      setInputMessage('');
      setIsTyping(true);
      sendingRef.current = true;

      try {
        const { text: replyText, source } = await requestAssistantReply(historyForApi);
        setLastReplySource(source ?? 'local');

        const agentMessage = {
          id: nextId(),
          text: ensureChatReply(replyText),
          sender: 'agent',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
      } catch {
        const agentMessage = {
          id: nextId(),
          text: 'Something went wrong. Please try again or visit the Contact us page for help.',
          sender: 'agent',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
      } finally {
        setIsTyping(false);
        sendingRef.current = false;
      }
    },
    [requestAssistantReply],
  );

  const handleSendMessage = () => {
    void sendUserText(inputMessage);
  };

  const handleQuickReply = (reply) => {
    void sendUserText(reply);
  };

  const showQuickReplies =
    messages.length === 1 && messages[0]?.id === 'welcome' && !isTyping;

  return (
    <>
      <AnimatePresence>
        {!showChat && (
          <motion.button
            key="chat-pill-button"
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              mass: 0.8,
            }}
            whileHover={{
              scale: 1.05,
              y: -3,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.16)] select-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(243, 246, 249, 0.88) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(203, 213, 225, 0.7)',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
            aria-label="Open visa support chat"
          >
            <div className="relative">
              <img
                src={GATEWAY_AI_ICON}
                alt="Gateway AI"
                width={30}
                height={30}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="w-7.5 h-7.5 object-contain rounded-full flex-shrink-0 drop-shadow-sm animate-spin"
              />
             
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-sm font-semibold text-slate-800 leading-tight tracking-wide group-hover:text-slate-950">
                Ask Gateway AI
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed left-4 right-4 sm:left-auto sm:right-6 mx-auto sm:mx-0 w-auto sm:w-[410px] max-w-[410px] sm:max-w-[calc(100vw-32px)] rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.22)] z-50 overflow-hidden flex flex-col"
            style={{
              top: `${NAVBAR_HEIGHT + 26}px`,
              bottom: '24px',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(246, 249, 252, 0.72) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              isolation: 'isolate',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 24px 60px -12px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.65)',
            }}
          >
            {/* Liquid-morphic Topbar */}
            <div
              className="p-4 flex items-center justify-between flex-shrink-0 relative border-b border-slate-200/50"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(246, 249, 252, 0.82) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-9 rounded-full p-0 bg-white flex items-center justify-center">
                    <img
                      src={GATEWAY_AI_ICON}
                      alt="Gateway AI Logo"
                      className="w-12 h-12 object-contain drop-shadow-xs"
                    />
                  </div>
                  
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-900 font-bold text-sm tracking-tight">Gateway AI</h3>
                   
                  </div>
                  <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    Your Intelligent Visa Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Chat history"
                  title="Chat history"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 glass-scrollbar min-h-0"
              style={{
                background: 'rgba(248, 250, 252, 0.40)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 transition-all ${
                      message.sender === 'user'
                        ? 'rounded-tr-xs text-white'
                        : 'rounded-tl-xs text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-white/80'
                    }`}
                    style={
                      message.sender === 'user'
                        ? {
                            background:
                              'linear-gradient(135deg, rgba(50, 132, 209, 0.97) 0%, rgba(40, 115, 190, 0.95) 50%, rgba(32, 100, 175, 0.97) 100%)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.30)',
                            boxShadow:
                              '0 6px 20px -4px rgba(50, 132, 209, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                          }
                        : {
                            background:
                              'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.82) 100%)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                          }
                    }
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`text-[10px] mt-1.5 font-medium ${
                        message.sender === 'user' ? 'text-white/80' : 'text-slate-400'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Liquid-morphic Production-Ready Thinking State */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-start"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div
                    className="relative rounded-2xl rounded-tl-xs px-4 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.04)] border border-white/90 overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 249, 252, 0.84) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                    
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 tracking-tight transition-all duration-300">
                            {THINKING_STAGES[thinkingStageIndex]}
                          </span>
                          <span className="flex gap-1 items-center h-3.5" aria-hidden="true">
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0s]" />
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </span>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {showQuickReplies && (
              <div
                className="px-4 py-2.5 border-t border-slate-200/50 flex-shrink-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <p className="text-[11px] text-slate-500 font-semibold mb-2 uppercase tracking-wider">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-full transition-all border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm cursor-pointer active:scale-95"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div
              className="p-3.5 border-t border-slate-200/50 flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(248, 250, 252, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about visas, eligibility, requirements..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 border border-slate-200/80 rounded-xl focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-300/40 text-sm disabled:opacity-60 placeholder:text-slate-400 transition-all duration-200 shadow-inner"
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    WebkitAppearance: 'none',
                  }}
                />
                <motion.button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  whileHover={inputMessage.trim() && !isTyping ? { scale: 1.02 } : {}}
                  whileTap={
                    inputMessage.trim() && !isTyping
                      ? {
                          scale: 0.92,
                          y: 1,
                          transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.7 },
                        }
                      : {}
                  }
                  className={`group relative overflow-hidden px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ease-out flex items-center gap-1.5 select-none ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-white text-slate-800 border border-slate-200/90 hover:border-slate-300/90 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1.5px_1px_rgba(255,255,255,1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1)] active:bg-slate-100 active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer'
                      : 'bg-white/60 text-slate-300 cursor-not-allowed border border-slate-200/50 shadow-none'
                  }`}
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Liquid gloss top reflection */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl opacity-90 group-active:opacity-30 transition-opacity" />
                  <Send
                    className={`w-3.5 h-3.5 relative z-10 transition-transform duration-150 group-active:translate-x-0.5 ${
                      inputMessage.trim() && !isTyping ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300'
                    }`}
                  />
                  <span className="relative z-10">{inputMessage.trim() && !isTyping ? 'Send' : 'Send'}</span>
                </motion.button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center font-medium">
                {lastReplySource === 'openapi' || lastReplySource === 'openrouter' || lastReplySource === 'openai'
                  ? 'Powered by Open AI'
                  : lastReplySource === 'groq'
                    ? 'Powered by Groq AI'
                    : lastReplySource === 'gemini'
                      ? 'Powered by Gemini AI'
                      : 'Powered by Global Gateway Pro'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalLiveChat;
