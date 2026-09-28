import React, { useState, useRef, useEffect } from 'react';

// Reusable SVG Icons for standard zero-dependency React compatibility
const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const MicIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const StarIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PlusIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const DEFAULT_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hi! 👋 I'm Yumzo AI. How can I help you today?",
    time: "12:30 PM"
  },
  {
    id: 2,
    sender: 'user',
    text: "I want something spicy under ₹200.",
    time: "12:31 PM"
  },
  {
    id: 3,
    sender: 'ai',
    text: "Sure! I can help you find something spicy under ₹200.",
    time: "12:31 PM",
    recommendation: {
      title: "Fiery Schezwan Paneer Tikka",
      restaurant: "Spice Junction",
      price: "₹180",
      rating: 4.8,
      prepTime: "20 min",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80",
      badge: "Top Pick"
    }
  }
];

const SUGGESTED_PROMPTS = [
  { icon: "🍕", label: "Find food for me" },
  { icon: "📦", label: "Track my order" },
  { icon: "💰", label: "Today's offers" },
  { icon: "🌱", label: "Vegetarian picks" },
];

export default function YumzoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping, isStreaming]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const handleSend = (textToSend = inputValue) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // UI-only typing simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Searching Yumzo for delicious choices matching "${textToSend}"...`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  const handleReset = () => {
    setMessages(DEFAULT_MESSAGES);
    setIsTyping(false);
    setIsStreaming(true);
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-100 min-h-screen p-4 sm:p-8">
      
      {/* Developer Demo Toolbar */}
      <div className="w-full max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Yumzo AI Chatbot UI Kit
          </h1>
          <p className="text-xs text-slate-500">Frontend UI Preview & Developer Playground</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
          >
            {isOpen ? 'Close Chat' : 'Open Chat'}
          </button>
          
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              isStreaming 
                ? 'bg-orange-500 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Streaming Cursor: {isStreaming ? 'ON ▌' : 'OFF'}
          </button>

          <button
            onClick={() => setIsTyping(!isTyping)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              isTyping 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Typing Dots: {isTyping ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title="Reset Chat"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-200 group"
          aria-label="Open Yumzo AI Chat"
          title="Ask Yumzo AI"
        >
          <SparklesIcon className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
          
          {/* Subtle notification dot or pulse */}
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      )}

      {}
      {isOpen && (
        <div 
          className="fixed z-50 transition-all duration-300 ease-out
            /* Mobile styles */
            inset-2 bottom-2 top-auto h-[88vh] max-h-[620px] w-[calc(100%-1rem)] sm:inset-auto sm:bottom-5 sm:right-5
            /* Desktop compact fixed bounds */
            sm:w-[390px] sm:h-[580px] sm:max-h-[85vh]
            /* Card design */
            bg-white rounded-[22px] shadow-2xl shadow-slate-900/15 border border-slate-100 flex flex-col overflow-hidden"
        >
          
          {}
          <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-4 py-3 text-white flex items-center justify-between shadow-xs select-none shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Compact AI Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-orange-500 rounded-full"></span>
              </div>
              
              {/* Header Title & Subtitle */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm leading-tight tracking-wide">Yumzo AI</h2>
                  <span className="text-[9px] bg-white/20 backdrop-blur-xs px-1.5 py-0.2 rounded-full font-semibold text-orange-100 uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-orange-100 opacity-90 font-light leading-none mt-0.5">Your personal food assistant</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 text-orange-100 hover:text-white transition"
                title="Reset conversation"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 text-orange-100 hover:text-white transition"
                aria-label="Close Chat"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
            
            {/* Suggestion Chips */}
            <div className="py-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Suggested prompts</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt.label)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-medium text-slate-700 hover:border-orange-300 hover:bg-orange-50/60 hover:text-orange-600 transition shadow-2xs active:scale-95"
                  >
                    <span className="text-xs">{prompt.icon}</span>
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Render Messages */}
            {messages.map((msg, index) => {
              const isAI = msg.sender === 'ai';
              const isLastMessage = index === messages.length - 1;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {/* AI Avatar */}
                  {isAI && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                      <SparklesIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`max-w-[82%] sm:max-w-[80%] ${isAI ? '' : 'items-end'}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAI
                          ? 'bg-white text-slate-800 border border-slate-200/70 shadow-2xs rounded-tl-xs'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xs rounded-tr-xs font-normal'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                        
                        {/* Visual Streaming Cursor */}
                        {isAI && isLastMessage && isStreaming && (
                          <span className="inline-block ml-0.5 text-orange-500 animate-pulse font-bold align-middle">
                            ▌
                          </span>
                        )}
                      </p>

                      {/* Interactive Food Recommendation Card */}
                      {msg.recommendation && (
                        <div className="mt-2.5 bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                          <div className="relative h-24 bg-slate-200">
                            <img
                              src={msg.recommendation.image}
                              alt={msg.recommendation.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                              {msg.recommendation.badge}
                            </span>
                          </div>
                          <div className="p-2.5">
                            <h4 className="font-bold text-slate-900 text-xs">{msg.recommendation.title}</h4>
                            <p className="text-[11px] text-slate-500">{msg.recommendation.restaurant}</p>
                            
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs">{msg.recommendation.price}</span>
                                <span className="flex items-center text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                                  <StarIcon className="w-3 h-3 text-amber-500 mr-0.5" />
                                  {msg.recommendation.rating}
                                </span>
                              </div>
                              <button
                                onClick={() => alert(`Added ${msg.recommendation.title} to your cart!`)}
                                className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-semibold px-2 py-1 rounded-md transition active:scale-95 shadow-2xs"
                              >
                                <PlusIcon className="w-3 h-3" /> Add
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[9px] text-slate-400 mt-0.5 px-1 block ${isAI ? 'text-left' : 'text-right'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                  <SparklesIcon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200/70 shadow-2xs rounded-2xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {}
          <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Yumzo anything..."
                  className="w-full bg-slate-100/80 text-slate-800 text-xs sm:text-sm rounded-full pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition border border-transparent focus:border-orange-200 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="absolute right-2.5 text-slate-400 hover:text-orange-500 transition p-0.5"
                  title="Voice input (Demo)"
                >
                  <MicIcon />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 shrink-0 ${
                  inputValue.trim()
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>
            
            <p className="text-[9px] text-center text-slate-400 mt-1.5">
              Yumzo AI helps you discover dishes, offers & track orders.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}