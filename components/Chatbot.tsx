"use client";

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, ShoppingBag, MessageCircle } from 'lucide-react';
import Image from 'next/image';

// Product Card Component
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  formattedPrice: string;
  whatsappLink: string;
  category?: string;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200 shadow-sm">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image 
            src={product.imageUrl || '/images/bakpia_original.jpg'} 
            alt={product.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/bakpia_original.jpg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm truncate">{product.name}</h4>
          <p className="text-amber-600 font-semibold text-sm">{product.formattedPrice}</p>
          <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">{product.description}</p>
        </div>
      </div>
      <a
        href={product.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <MessageCircle size={14} />
        Pesan via WhatsApp
      </a>
    </div>
  );
}

// Product Grid Component
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="space-y-2 mt-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage({ text: inputValue });
      setInputValue('');
    }
  };

  // Parse message to extract text and tool results
  const parseMessage = (message: {
    parts?: Array<{ type: string; text?: string; toolInvocation?: { toolName: string; result?: unknown } }>;
    content?: string;
  }) => {
    const textParts: string[] = [];
    const products: Product[] = [];

    if (message.content && typeof message.content === 'string') {
      textParts.push(message.content);
    }

    if (message.parts && Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type === 'text' && part.text) {
          textParts.push(part.text);
        }
        if (part.type === 'tool-invocation' && part.toolInvocation?.result) {
          const result = part.toolInvocation.result as { products?: Product[]; recommendations?: Product[] };
          if (result.products) {
            products.push(...result.products);
          }
          if (result.recommendations) {
            products.push(...result.recommendations);
          }
        }
      }
    }

    return { text: textParts.join(''), products };
  };

  // Show welcome message if no messages yet
  const showWelcome = messages.length === 0;

  return (
    <>
      {/* Chat Toggle Button - Single Bot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-0' 
            : 'bg-gradient-to-br from-bakpia-green to-green-600 hover:from-green-600 hover:to-green-700'
        }`}
        style={{ animation: isOpen ? 'none' : 'bounce 2s infinite' }}
        aria-label={isOpen ? 'Tutup Chat' : 'Chat dengan Asisten'}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Bot size={24} className="text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-bakpia-green to-green-600 text-white p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">Bakpia Bumurto</h3>
              <p className="text-xs text-white/90 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                Online • Siap melayani
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {/* Welcome message */}
            {showWelcome && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl px-4 py-3 bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md">
                  <div className="flex items-start gap-2">
                    <Bot size={18} className="text-bakpia-green mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">
                        <span className="text-lg">👋</span> Halo, Kakak! Selamat datang di <strong>Bakpia Bumurto</strong> asli Kebumen!
                      </p>
                      <p className="text-sm mt-2 leading-relaxed">
                        Mau cari oleh-oleh khas Kebumen yang lembut dan nikmat? Tanya aja ya, Kak! 😊
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setInputValue('Lihat menu bakpia');
                          }}
                          className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          🍰 Lihat Menu
                        </button>
                        <button
                          onClick={() => {
                            setInputValue('Mau yang manis');
                          }}
                          className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          🍫 Rasa Manis
                        </button>
                        <button
                          onClick={() => {
                            setInputValue('Ada promo tidak?');
                          }}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full transition-colors"
                        >
                          🎁 Cek Promo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const { text, products } = parseMessage(message);
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-gradient-to-br from-bakpia-green to-green-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!isUser && (
                        <Bot size={18} className="text-bakpia-green mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        {text && (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
                        )}
                        {products.length > 0 && (
                          <ProductGrid products={products} />
                        )}
                      </div>
                      {isUser && (
                        <User size={16} className="text-white/80 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-bakpia-green" />
                    <span className="text-sm text-gray-500">Sedang mengetik...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan ke Bakpia Bumurto..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-bakpia-green/20 focus:border-bakpia-green text-sm bg-gray-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-br from-bakpia-green to-green-600 text-white p-2.5 rounded-full hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              🏠 UMKM Asli Kebumen • Bakpia Bumurto
            </p>
          </form>
        </div>
      )}
    </>
  );
}
