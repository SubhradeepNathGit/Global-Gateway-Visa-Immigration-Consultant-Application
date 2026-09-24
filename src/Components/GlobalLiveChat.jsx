import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, MessageCircle, ArrowLeft, ArrowRight, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getBestEffortLocalReply,
  SORRY_NO_ANSWER,
} from '../util/chat/siteAssistantEngine';
import { sendVisaSupportChat } from '../util/chat/visaSupportChat';

const WELCOME_TEXT =
  "Hello! I'm your visa support assistant. How can I help you today?";

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

  const requestAssistantReply = useCallback(async (historyMessages) => {
    const apiMessages = toApiMessages(historyMessages);

    const groq = await sendVisaSupportChat(apiMessages);
    if (groq.ok && groq.reply) {
      return { text: groq.reply, source: 'groq' };
    }

    const localReply = getBestEffortLocalReply(apiMessages);
    if (localReply) {
      return { text: localReply, source: 'local' };
    }

    return { text: SORRY_NO_ANSWER, source: 'none' };
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
          text: 'Something went wrong. Please try again or visit /contact for help.',
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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-all cursor-pointer"
          aria-label="Open visa support chat"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-32px)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.52) 100%)',
              backdropFilter: 'blur(20px) saturate(180%) contrast(95%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%) contrast(95%)',
              isolation: 'isolate',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              border: 'none',
              outline: 'none',
            }}
          >
            <div className="bg-gradient-to-r from-[#FF5252] to-[#E63946] p-4 flex items-center justify-between">
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
                  className="h-96 overflow-y-auto p-4 space-y-4 glass-scrollbar min-h-0"
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
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.sender === 'user'
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
                          className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
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
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <span
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          />
                          <span
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {showQuickReplies && (
                  <div
                    className="px-4 py-3 border-t border-slate-200/50"
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
                  className="p-4 border-t border-slate-200/50"
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
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        inputMessage.trim() && !isTyping
                          ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white hover:shadow-lg cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    {lastReplySource === 'groq'
                      ? 'Powered by Groq AI • Site-trained guide'
                      : lastReplySource === 'none'
                        ? 'Limited mode — contact us for more help'
                        : 'Site guide backup (Groq unavailable)'}
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
