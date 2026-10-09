import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, UserCheck, ArrowRight, Anchor } from 'lucide-react';
import { ChatMessage, Yacht } from '../types/yacht';
import { FLEET } from '../data/yachtData';

interface ConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectYachtToBook?: (yacht: Yacht) => void;
}

export const ConciergeDrawer: React.FC<ConciergeDrawerProps> = ({
  isOpen,
  onClose,
  onSelectYachtToBook,
}) => {
  const [mode, setMode] = useState<'ai' | 'live_agent'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Ahoy! I am Captain Louis, your AI Maritime Concierge at The Yacht Club Singapore. How may I assist your voyage today? Ask me about vessel recommendations, Lazarus Island anchorages, BBQ catering, or sunset skyline routes.',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleToggleMode = (newMode: 'ai' | 'live_agent') => {
    if (newMode === mode) return;
    setMode(newMode);

    if (newMode === 'live_agent') {
      const handoverMsg: ChatMessage = {
        id: `handover-${Date.now()}`,
        sender: 'system',
        text: 'Handover complete. Connected with Sarah Lin (Senior Charter Director, ONE°15 Marina Operations).',
        timestamp: 'Just now',
      };
      const agentGreeting: ChatMessage = {
        id: `agent-greet-${Date.now()}`,
        sender: 'agent',
        agentName: 'Sarah Lin',
        text: 'Hello! Sarah here. I have your chat transcript in front of me. Whether you need a customised corporate invoice, bespoke catering menu, or a specific boarding gate arrangement, I am here to help.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, handoverMsg, agentGreeting]);
    } else {
      const switchBackMsg: ChatMessage = {
        id: `switch-ai-${Date.now()}`,
        sender: 'system',
        text: 'Switched back to Captain Louis (AI Concierge powered by Gemini).',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, switchBackMsg]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (mode === 'ai') {
      try {
        const response = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-5),
          }),
        });

        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || 'I am pleased to assist you with any questions about our Singapore yacht fleet.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedYachtId: data.suggestedYachtId,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error(err);
        const fallbackMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Our fleet sails daily from ONE°15 Marina Sentosa Cove to Lazarus Island. Standard inclusions cover captain, crew, fuel, and water toys.',
          timestamp: 'Just now',
          suggestedYachtId: 'lagoon-400-s2',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsTyping(false);
      }
    } else {
      setTimeout(() => {
        setIsTyping(false);
        const liveReply: ChatMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          agentName: 'Sarah Lin',
          text: `Thank you for the message. I will personally review this charter request. You can also reach our direct operations desk on WhatsApp at +65 9123 4567 with your preferred dates, or let me know if you would like me to lock in a reservation for you right now.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, liveReply]);
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl text-neutral-900">
      {/* Top Bar with Mode Switcher */}
      <div className="flex flex-col border-b border-neutral-200 bg-neutral-50/90 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-900">
              <Anchor className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-maritime text-sm font-bold text-neutral-900 uppercase">
                Charter Concierge Desk
              </h3>
              <p className="text-[10px] text-neutral-500 font-light">
                The Yacht Club Singapore Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Agent / AI Mode Switcher Tabs */}
        <div className="mt-3 flex rounded-xl border border-neutral-200 bg-neutral-100 p-1">
          <button
            onClick={() => handleToggleMode('ai')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'ai'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Concierge</span>
          </button>

          <button
            onClick={() => handleToggleMode('live_agent')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'live_agent'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Live Specialist</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block rounded-md bg-neutral-100 border border-neutral-200 px-3 py-1 text-[11px] text-neutral-600">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          const suggestedYacht = msg.suggestedYachtId
            ? FLEET.find((y) => y.id === msg.suggestedYachtId)
            : null;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-400 font-mono">
                <span>{isUser ? 'You' : msg.sender === 'agent' ? msg.agentName || 'Sarah Lin' : 'Captain Louis'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                  isUser
                    ? 'bg-neutral-900 text-white font-normal'
                    : msg.sender === 'agent'
                    ? 'bg-neutral-50 border border-neutral-200 text-neutral-800'
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-800'
                }`}
              >
                {msg.text}

                {/* Suggested Yacht Card preview in chat */}
                {suggestedYacht && onSelectYachtToBook && (
                  <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3 text-left shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={suggestedYacht.image}
                        alt={suggestedYacht.name}
                        className="h-9 w-9 rounded-md object-cover border border-neutral-200"
                      />
                      <div className="flex-1">
                        <div className="font-maritime text-xs font-bold text-neutral-900 uppercase">
                          {suggestedYacht.name}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Max {suggestedYacht.maxGuests} Guests · {suggestedYacht.homeMarina}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectYachtToBook(suggestedYacht);
                        onClose();
                      }}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 py-1.5 text-[11px] font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span>Check Live Availability</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 pl-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 animate-ping" />
            <span>{mode === 'ai' ? 'Captain Louis is typing...' : 'Sarah Lin is drafting a response...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <button
            onClick={() => handleSendMessage('Can we bring our own alcohol and food?')}
            className="whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer shadow-xs"
          >
            BYO Alcohol Policy?
          </button>
          <button
            onClick={() => handleSendMessage('What is the best route for sunset & skyline?')}
            className="whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer shadow-xs"
          >
            Sunset & Skyline Route
          </button>
          <button
            onClick={() => handleSendMessage('Which catamaran has BBQ grill for 20 pax?')}
            className="whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer shadow-xs"
          >
            BBQ Catamaran for 20 pax
          </button>
          <button
            onClick={() => handleSendMessage('What happens in case of rain?')}
            className="whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 cursor-pointer shadow-xs"
          >
            Weather Policy
          </button>
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-neutral-200 bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              mode === 'ai'
                ? 'Ask Captain Louis about yachts, rates, food...'
                : 'Direct message to Sarah Lin (Live Specialist)...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
