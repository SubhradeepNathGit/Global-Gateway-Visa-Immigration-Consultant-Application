import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MessageCircle, ArrowLeft, ArrowRight, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLiveChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your visa support assistant. How can I help you today?",
      sender: 'agent',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const response = generateAutoResponse(inputMessage);
      const agentMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'agent',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAutoResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('visa') || msg.includes('study')) {
      return "I'd be happy to help with visa applications! We offer comprehensive study visa consultation including document preparation, interview guidance, and application tracking. Would you like more details about our services?";
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('fee')) {
      return "Our services range from ₹8,000 to ₹18,000 depending on the complexity. We currently have special offers - use code SAVE20 for 20% off! Would you like to know about a specific service?";
    } else if (msg.includes('ielts') || msg.includes('test') || msg.includes('exam')) {
      return "Our IELTS preparation course guarantees Band 7+ scores! It includes mock tests, speaking practice sessions, and personalized feedback. The course is ₹12,000 with instant access. Interested?";
    } else if (msg.includes('payment') || msg.includes('pay')) {
      return "We accept all major payment methods: Credit/Debit Cards, UPI, Net Banking, and Digital Wallets. All transactions are 100% secure with SSL encryption. You'll get instant access after payment!";
    } else if (msg.includes('refund') || msg.includes('money back')) {
      return "We offer a 30-day money-back guarantee on all our services! If you're not satisfied, you can request a full refund within 30 days of purchase. No questions asked.";
    } else if (msg.includes('time') || msg.includes('duration') || msg.includes('long')) {
      return "Most of our courses provide lifetime access! Consultation sessions can be scheduled within 24 hours of purchase. Course durations vary from 6-10 hours of content. What specific timeline are you looking for?";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! Welcome to our visa support chat. I'm here to help you with any questions about our services, pricing, or the visa application process. What would you like to know?";
    } else if (msg.includes('thank') || msg.includes('thanks')) {
      return "You're very welcome! Is there anything else I can help you with today? I'm here to make your visa journey smooth and successful! 😊";
    } else {
      return "That's a great question! For detailed information about this, I'd recommend speaking with one of our visa experts. You can call us at +91 1800-000-000 or email support@visaexpert.com. Is there anything specific about our services I can help clarify?";
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const quickReplies = [
    "What visa services do you offer?",
    "How much does it cost?",
    "Tell me about IELTS prep",
    "What's your refund policy?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-all cursor-pointer"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>
        </motion.button>
      )}

      {/* Live Chat Window */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-200"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#FF5252] to-[#E63946] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Visa Support</h3>
                  <p className="text-white/90 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChatMinimized(!chatMinimized)}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {chatMinimized ? (
                    <ArrowRight className="w-5 h-5 text-white rotate-90" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-white rotate-90" />
                  )}
                </button>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {!chatMinimized && (
              <>
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-4 bg-slate-50 space-y-4 glass-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white'
                            : 'bg-white text-slate-900 border border-slate-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="px-4 py-3 bg-white border-t border-slate-200">
                    <p className="text-xs text-slate-600 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-300"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5252] focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        inputMessage.trim()
                          ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white hover:shadow-lg'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Powered by AI • Instant responses
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