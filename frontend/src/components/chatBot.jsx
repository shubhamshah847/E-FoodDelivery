import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import { serverURI } from '../App';
import { useSelector } from 'react-redux';
// Icons
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

function YumzoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {userData} = useSelector(state=>state.user)
 
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! 👋 How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };


    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
   
    try {
      let message = userMsg.text
      
      const botReplyText = await axios.post(serverURI+'/api/chat', {
         message
      })
      const fromAIMsg = botReplyText.data.answer
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: fromAIMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          aria-label="Open Chat"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="fixed z-50 bottom-5 right-5 w-[360px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-sm">Yumzo AI</h2>
            
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition text-white"
              aria-label="Close Chat"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          <div> <h1 className="text-2xl font-bold"> Hi, {userData?.user?.name || "there"} 👋 </h1> </div>
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {isAI && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <SparklesIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[80%]`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${isAI
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-tr-xs'
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                    <span className={`text-[9px] text-slate-400 mt-0.5 block ${isAI ? 'text-left' : 'text-right'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <SparklesIcon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 text-slate-800 text-xs rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition ${inputValue.trim() && !isLoading
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default YumzoChatbot;