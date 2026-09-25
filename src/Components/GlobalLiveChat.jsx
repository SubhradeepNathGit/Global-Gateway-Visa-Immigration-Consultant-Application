import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, MessageCircle, ArrowLeft, ArrowRight, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSmartLocalReply, isPureGreetingOnly, isWeakGenericReply } from '../util/chat/smartChatReply';
import { sendVisaSupportChat } from '../util/chat/visaSupportChat';

const WELCOME_TEXT =
  "Hello! I'm your visa support assistant. How can I help you today?";

const NAVBAR_HEIGHT = 60;

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
  const [chatMinimized, setChatMinimized] = useState(false);
  const [lastReplySource, setLastReplySource] = useState('local');
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
      return { text: getSmartLocalReply(apiMessages), source: 'local' };
    }

    // 2) Try API first for substantive questions
    try {
      const api = await sendVisaSupportChat(apiMessages);
      if (api.ok && api.reply && typeof api.reply === 'string') {
        const engineSource =
          api.engine === 'gemini' ? 'gemini' : api.engine === 'groq' ? 'groq' : api.engine || 'groq';

        // 3) Check if API gave a weak/generic response
        if (isWeakGenericReply(api.reply)) {
          const smartLocal = getSmartLocalReply(apiMessages);
          if (!isWeakGenericReply(smartLocal)) {
            return { text: smartLocal, source: engineSource };
          }
        }

        return { text: api.reply, source: engineSource };
      }
    } catch {
      // API failed — fall through to local
    }

    // 4) Smart local fallback
    return {
      text: getSmartLocalReply(apiMessages),
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
          text: replyText,
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
      {!showChat && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3.5 px-4.5 py-3 rounded-full cursor-pointer group transition-all duration-400"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.65) 100%)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.85)',

          }}
          aria-label="Open visa support chat"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white  transition-transform duration-300 group-hover:scale-108">
            <Headphones className="w-4 h-4 text-white" />

          </div>
          <div className="flex flex-col text-left pr-1.5">
            <span className="text-xs font-bold text-[#0f172a] leading-tight tracking-wide">
              Visa Support
            </span>
            <span className="text-[10.5px] font-semibold text-[#64748b] leading-none flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online 24/7
            </span>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed right-6 w-[400px] max-w-[calc(100vw-32px)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 overflow-hidden flex flex-col"
            style={{
              top: `${NAVBAR_HEIGHT + 12}px`,
              bottom: '24px',
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.52) 100%)',
              backdropFilter: 'blur(10px) saturate(180%) contrast(95%)',
              WebkitBackdropFilter: 'blur(10px) saturate(180%) contrast(95%)',
              isolation: 'isolate',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)',
              WebkitBackfropVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              border: 'none',
              outline: 'none',
            }}
          >
            <div className="bg-gradient-to-r from-[#FF5252] to-[#E63946] p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Visa Support</h3>
                  <p className="text-white/90 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={chatMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  {chatMinimized ? (
                    <ArrowRight className="w-5 h-5 text-white rotate-90" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-white rotate-90" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {!chatMinimized && (
              <>
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4 glass-scrollbar min-h-0"
                  style={{
                    background: 'rgba(248, 250, 252, 0.35)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${message.sender === 'user'
                            ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white'
                            : 'text-slate-900 shadow-sm'
                          }`}
                        style={
                          message.sender !== 'user'
                            ? {
                              background: 'rgba(255, 255, 255, 0.82)',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                              border: 'none',
                            }
                            : {}
                        }
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
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

                  {isTyping && (
                    <div className="flex justify-start">
                      <div
                        className="text-slate-900 rounded-2xl p-3 shadow-sm"
                        style={{
                          background: 'rgba(255, 255, 255, 0.82)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: 'none',
                        }}
                      >
                        <div className="flex gap-1.5 items-center h-5" aria-hidden="true">
                          <span className="gg-splash-loader__dot w-2 h-2 bg-slate-500 rounded-full" />
                          <span className="gg-splash-loader__dot w-2 h-2 bg-slate-500 rounded-full [animation-delay:0.2s]" />
                          <span className="gg-splash-loader__dot w-2 h-2 bg-slate-500 rounded-full [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {showQuickReplies && (
                  <div
                    className="px-4 py-3 border-t border-slate-200/50 flex-shrink-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.50)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <p className="text-xs text-slate-600 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          type="button"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-white/70 hover:bg-white text-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-200/80 shadow-xs cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="p-4 border-t border-slate-200/50 flex-shrink-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.60)',
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
                      placeholder="Type your message..."
                      disabled={isTyping}
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5252] focus:border-transparent text-sm disabled:opacity-60"
                      style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        WebkitAppearance: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${inputMessage.trim() && !isTyping
                          ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white hover:shadow-lg cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    {lastReplySource === 'groq'
                      ? 'Powered by Groq AI'
                      : lastReplySource === 'gemini'
                        ? 'Powered by Gemini AI'
                        : 'Global Gateway Expert Guide'}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalLiveChat;
