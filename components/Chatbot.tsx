"use client";

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X, MessageCircle } from 'lucide-react';
import Image from 'next/image';

// Product interface
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

// Tool result interface
interface ToolResult {
  products?: Product[];
  recommendations?: Product[];
  message?: string;
  error?: boolean;
  whatsappLink?: string;
}

// Product Card - Visual card for bakpia
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0">
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
          <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
          <p className="text-amber-600 font-bold text-base">{product.formattedPrice}</p>
          <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
        </div>
      </div>
      <a
        href={product.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <MessageCircle size={14} />
        Pesan via WhatsApp
      </a>
    </div>
  );
}

// Product Grid
function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="space-y-2 mt-3">
      {products.map((product, idx) => (
        <ProductCard key={product.id || idx} product={product} />
      ))}
    </div>
  );
}

// Error/Fallback Card
function ErrorCard({ message, whatsappLink }: { message: string; whatsappLink?: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
      <p className="text-sm text-amber-800 mb-2">{message}</p>
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2"
        >
          <MessageCircle size={14} />
          Chat WhatsApp
        </a>
      )}
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage({ text: inputValue });
      setInputValue('');
    }
  };

  // Parse message - extract text and tool results
  const parseMessage = (msg: Record<string, unknown>) => {
    const textParts: string[] = [];
    const allProducts: Product[] = [];
    let errorInfo: { message: string; whatsappLink?: string } | null = null;

    // Direct content string
    if (typeof msg.content === 'string') {
      textParts.push(msg.content);
    }

    // Parts array (AI SDK v6 format)
    if (Array.isArray(msg.parts)) {
      for (const part of msg.parts as Array<Record<string, unknown>>) {
        // Text part
        if (part.type === 'text' && typeof part.text === 'string') {
          textParts.push(part.text);
        }

        // Tool invocation with result
        if (part.type === 'tool-invocation') {
          const invocation = part.toolInvocation as Record<string, unknown> | undefined;
          const result = (invocation?.result || part.result) as ToolResult | undefined;
          
          if (result) {
            if (result.error && result.message) {
              errorInfo = { message: result.message, whatsappLink: result.whatsappLink };
            }
            if (Array.isArray(result.products)) {
              allProducts.push(...result.products);
            }
            if (Array.isArray(result.recommendations)) {
              allProducts.push(...result.recommendations);
            }
          }
        }

        // Tool result part
        if (part.type === 'tool-result') {
          const result = part.result as ToolResult | undefined;
          if (result) {
            if (result.error && result.message) {
              errorInfo = { message: result.message, whatsappLink: result.whatsappLink };
            }
            if (Array.isArray(result.products)) {
              allProducts.push(...result.products);
            }
            if (Array.isArray(result.recommendations)) {
              allProducts.push(...result.recommendations);
            }
          }
        }
      }
    }

    // Legacy toolInvocations array
    if (Array.isArray(msg.toolInvocations)) {
      for (const inv of msg.toolInvocations as Array<Record<string, unknown>>) {
        const result = inv.result as ToolResult | undefined;
        if (result) {
          if (result.error && result.message) {
            errorInfo = { message: result.message, whatsappLink: result.whatsappLink };
          }
          if (Array.isArray(result.products)) {
            allProducts.push(...result.products);
          }
          if (Array.isArray(result.recommendations)) {
            allProducts.push(...result.recommendations);
          }
        }
      }
    }

    return { 
      text: textParts.join('').trim(), 
      products: allProducts,
      errorInfo
    };
  };

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
        }`}
        style={{ animation: isOpen ? 'none' : 'bounce 2s infinite' }}
      >
        {isOpen ? <X size={24} className="text-white" /> : <Bot size={24} className="text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">Bakpia Bumurto</h3>
              <p className="text-xs text-white/90">Online • Siap melayani, Lur!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Welcome */}
            {showWelcome && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
                  <div className="flex items-start gap-2">
                    <Bot size={18} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm"><span className="text-lg">👋</span> <strong>Monggo Kak!</strong> Selamat datang di Bakpia Bumurto asli Kebumen!</p>
                      <p className="text-sm mt-1 text-gray-600">Mau lihat menu bakpia kami? Langsung klik di bawah ya! 😊</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => sendMessage({ text: 'Lihat menu bakpia' })}
                          className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-full font-medium"
                        >
                          🍰 Lihat Menu
                        </button>
                        <button
                          onClick={() => sendMessage({ text: 'Mau yang manis' })}
                          className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1.5 rounded-full font-medium"
                        >
                          🍫 Rasa Manis
                        </button>
                        <button
                          onClick={() => sendMessage({ text: 'Ada promo apa?' })}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium"
                        >
                          🎁 Cek Promo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const { text, products, errorInfo } = parseMessage(message as unknown as Record<string, unknown>);
              
              // Skip empty messages
              if (!isUser && !text && products.length === 0 && !errorInfo) return null;
              
              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                    isUser
                      ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border rounded-bl-sm'
                  }`}>
                    <div className="flex items-start gap-2">
                      {!isUser && <Bot size={18} className="text-green-600 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
                        {products.length > 0 && <ProductGrid products={products} />}
                        {errorInfo && <ErrorCard message={errorInfo.message} whatsappLink={errorInfo.whatsappLink} />}
                      </div>
                      {isUser && <User size={16} className="text-white/80 mt-0.5 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-green-600" />
                    <span className="text-sm text-gray-500">Nyiapke katalog...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">🏠 Bakpia Bumurto • Asli Kebumen</p>
          </form>
        </div>
      )}
    </>
  );
}
