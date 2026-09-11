import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Check, 
  Copy
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to GymFlow Banani! I'm **Coach Flow**, your dedicated AI Performance Coach & Club Concierge. 

Whether you need a custom strength split for our Eleiko platforms, Dhaka-friendly meal prep advice (with local protein sources), or details about our 8°C Scandinavian cold plunge, I'm here to guide you.

How can I elevate your training today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInput(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to server
      const payload = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendChatMessage(payload);

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: res.reply || res.fallback || 'Coach Flow has completed your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${err.message || 'Coach Flow is temporarily unavailable.'} You can try again in a moment or rephrase your request.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Session refreshed! Coach Flow is ready for your next workout plan, form check, or recovery questions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '🏋️ 4-Day Push/Pull Split', prompt: 'Create an optimal 4-day Push-Pull-Legs workout routine taking full advantage of the Eleiko platforms and Technogym equipment at GymFlow Banani.' },
    { label: '🥗 Dhaka High-Protein Diet', prompt: 'Give me a high-protein daily meal plan (140g protein) using accessible local ingredients in Dhaka (eggs, chicken, daal, chana, tok doi).' },
    { label: '🧊 Scandinavian Cold Plunge', prompt: 'Explain the scientific recovery benefits of the Finnish sauna and 8°C cold plunge bath in Zone 03.' },
    { label: '📱 30s Dynamic QR Pass', prompt: 'How does the digital RFID turnstile QR pass work and why does it rotate every 30 seconds?' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#1a1b21] border border-white/15 shadow-2xl text-[#e3e1e9] flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#121318]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#10b981] to-[#4cd7f6] flex items-center justify-center shadow-lg shadow-[#10b981]/20">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Coach Flow</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#4edea3] text-[10px] font-bold border border-[#10b981]/30">
                  AI Concierge
                </span>
              </div>
              <p className="text-[11px] text-[#bbcabf]">
                Banani Flagship Club • Powered by Google Gemini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-2 rounded-xl bg-[#292a2f] text-[#bbcabf] hover:text-white hover:bg-[#34353b] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#292a2f] text-[#bbcabf] hover:text-white hover:bg-[#34353b] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#4edea3]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-[#10b981] text-[#003824] font-medium rounded-tr-sm shadow-md'
                      : 'bg-[#24252c] text-[#e3e1e9] border border-white/[0.08] rounded-tl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {msg.content}
                  </div>

                  {/* Copy Button for Assistant */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-[#1a1b21]/80 text-[#bbcabf] hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-[#4edea3]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[#8e9099]">
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#292a2f] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#e3e1e9]">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#4edea3]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#24252c] border border-white/[0.08] rounded-tl-sm flex items-center gap-2">
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[11px] text-[#bbcabf] font-medium ml-1">
                  Coach Flow is formulating your protocol...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#15161b] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(item.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-[#24252c] hover:bg-[#2e3038] text-[11px] text-[#bbcabf] hover:text-white border border-white/[0.06] whitespace-nowrap transition-all shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-[#121318] border-t border-white/[0.08] flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Coach Flow about workout routines, nutrition, or Banani club amenities..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#24252c] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-[#757780] focus:outline-none focus:border-[#10b981] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-[#10b981] text-[#003824] hover:bg-[#4edea3] disabled:opacity-40 disabled:hover:bg-[#10b981] transition-all shadow-md font-bold flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
