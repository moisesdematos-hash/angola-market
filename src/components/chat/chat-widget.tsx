'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Paperclip,
  ShieldCheck,
  Store,
  Headphones,
  Zap,
  Mic,
  ShoppingCart,
  Copy,
  Truck,
  Sparkles,
  Search,
  CreditCard,
  Key,
  Award,
  CheckCircle2
} from 'lucide-react';
import { ChatService, ChatConversation } from '@/lib/chat/chat-service';
import { SuperChatEngine, SuperChatMessage } from '@/lib/chat/super-chat-engine';
import { useCart } from '@/context/cart-context';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';

export function ChatWidget() {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations] = useState<ChatConversation[]>(ChatService.getInitialConversations());
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');

  const [messages, setMessages] = useState<Record<string, SuperChatMessage[]>>({
    'conv-1': [
      {
        id: 'm1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Manuel Domingos',
        senderRole: 'customer',
        text: 'Boa tarde! O iPhone 15 Pro Max está selado na caixa original?',
        timestamp: '14:15'
      },
      {
        id: 'm2',
        conversationId: 'conv-1',
        senderId: 'seller-1',
        senderName: 'Luanda Tech Center',
        senderRole: 'seller',
        text: 'Olá! Sim, temos o produto disponível selado para entrega imediata em Talatona.',
        timestamp: '14:20'
      }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = messages[selectedConvId] || [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const { safeText, isBlocked, warningMsg } = ChatService.sanitizeChatMessage(inputMessage);

    if (isBlocked && warningMsg) {
      setSecurityWarning(warningMsg);
      setTimeout(() => setSecurityWarning(null), 5000);
    }

    const newMessage: SuperChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: selectedConvId,
      senderId: 'user-1',
      senderName: 'Eu (Comprador)',
      senderRole: 'customer',
      text: safeText,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      isBlocked
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMessage]
    }));

    const currentInput = inputMessage;
    setInputMessage('');

    let superResponse = null;
    try {
      const apiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, conversationId: selectedConvId })
      });
      const data = await apiRes.json();
      if (data.success) {
        superResponse = data.response;
      }
    } catch (err) {
      console.error('Error sending message to Super Chat API:', err);
    }

    if (superResponse) {
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [selectedConvId]: [...(prev[selectedConvId] || []), superResponse]
        }));
      }, 500);
    }
  };

  const triggerGoldenKey = () => {
    const goldMessage = SuperChatEngine.generateGoldenKeyCheckout(MOCK_PRODUCTS[0]);
    setMessages((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), goldMessage]
    }));
  };

  const executeCommand = (cmd: string) => {
    setInputMessage(cmd);
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <>
      {/* Floating SUPER CHAT Trigger Button with Golden Key Accent */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 dark:text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-110 group border-2 border-amber-300 shadow-amber-500/20"
        aria-label="Abrir SUPER CHAT CHAVE DE OURO"
      >
        <Key className="w-6 h-6 text-amber-300 animate-pulse fill-amber-300" />
        <span className="text-xs font-extrabold hidden group-hover:inline pr-1">🔑 CHAVE DE OURO CHAT</span>
      </button>

      {/* Floating SUPER CHAT Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] animate-fade-in">
          {/* Super Chat Golden Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-amber-500/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-md">
                  🔑
                </div>
                {activeConv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  {activeConv.participantName}
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow">
                    🔑 CHAVE DE OURO VIP
                  </span>
                </h4>
                <span className="text-[10px] text-amber-300/90 font-medium">
                  Comprar em 1-Clique diretamente no Chat
                </span>
              </div>
            </div>

            {/* Quick Trigger Button for Chave de Ouro */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerGoldenKey}
                className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-[10px] font-extrabold px-3 py-1.5 rounded-xl shadow transition-all hover:scale-105 flex items-center gap-1"
                title="Ativar Checkout 1-Clique Chave de Ouro"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Chave de Ouro</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Slash Commands Bar */}
          <div className="flex items-center gap-1 bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto text-[11px]">
            <button
              onClick={triggerGoldenKey}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 shadow-sm"
            >
              <Key className="w-3 h-3" /> 🔑 /ouro
            </button>

            <button
              onClick={() => executeCommand('/pesquisar telemóveis')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg shrink-0 font-medium border border-slate-700 flex items-center gap-1"
            >
              <Search className="w-3 h-3 text-emerald-400" /> /pesquisar
            </button>

            <button
              onClick={() => executeCommand('/rastrear AO-DEL-948120')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg shrink-0 font-medium border border-slate-700 flex items-center gap-1"
            >
              <Truck className="w-3 h-3 text-amber-400" /> /rastrear
            </button>

            <button
              onClick={() => executeCommand('/mcx')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg shrink-0 font-medium border border-slate-700 flex items-center gap-1"
            >
              <CreditCard className="w-3 h-3 text-emerald-400" /> /mcx
            </button>
          </div>

          {/* Security Alert Banner */}
          <div className="bg-emerald-950 text-emerald-100 px-3 py-1.5 text-[10px] flex items-center justify-between border-b border-emerald-900">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantia Chave de Ouro: Escrow + Dev. em 24h
            </span>
          </div>

          {securityWarning && (
            <div className="bg-amber-500/20 text-amber-300 text-[11px] p-2 text-center border-b border-amber-500/30 animate-pulse font-medium">
              {securityWarning}
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {activeMessages.map((msg) => {
              const isMe = msg.senderRole === 'customer';
              const isSuperAI = msg.senderRole === 'super_ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1">
                    {isSuperAI && <Zap className="w-3 h-3 text-amber-400" />}
                    <span>{msg.senderName} • {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : isSuperAI
                        ? 'bg-slate-950 text-white border border-amber-500/50 rounded-bl-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Interactive Action Cards */}
                    {msg.actionCard && (
                      <>
                        {/* CHAVE DE OURO IN-CHAT CHECKOUT CARD */}
                        {msg.actionCard.type === 'golden_key_checkout' && (
                          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 space-y-3 text-slate-100 shadow-xl">
                            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                              <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1">
                                <Award className="w-4 h-4 text-amber-400" /> Pedido VIP #{msg.actionCard.data.orderNumber}
                              </span>
                              <span className="bg-amber-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                                10% Desconto Ouro
                              </span>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div className="font-bold text-white line-clamp-1">{msg.actionCard.data.productTitle}</div>
                              <div className="flex items-center justify-between text-[11px] text-slate-300">
                                <span>Preço Original:</span>
                                <span className="line-through">{formatKwanza(msg.actionCard.data.originalPriceKz)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs font-extrabold text-amber-400">
                                <span>Total Final VIP (com frete):</span>
                                <span className="text-sm">{formatKwanza(msg.actionCard.data.finalTotalKz)}</span>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1 font-mono text-xs">
                              <span className="text-[10px] text-amber-400 font-bold block">PAGAR VIA MULTICAIXA EXPRESS (MCX)</span>
                              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg text-xs">
                                <span>ENTIDADE: <strong className="text-white">00124</strong></span>
                                <span>REF: <strong className="text-amber-400">{msg.actionCard.data.mcxReference}</strong></span>
                              </div>
                              <button
                                onClick={() => copyRef(msg.actionCard?.data.mcxReference || '849 201 104')}
                                className="text-[10px] font-bold text-amber-400 hover:underline flex items-center justify-center gap-1 mx-auto mt-1"
                              >
                                <Copy className="w-3 h-3" /> {copiedRef ? 'Referência Copiada!' : 'Copiar Referência MCX'}
                              </button>
                            </div>

                            <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-between">
                              <span>Logística: {msg.actionCard.data.courier}</span>
                              <span>PIN de Entrega: <strong className="text-amber-300">{msg.actionCard.data.deliveryPin}</strong></span>
                            </div>
                          </div>
                        )}

                        {msg.actionCard.type === 'product_recommendation' && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                                <Image src={msg.actionCard.data.images[0]} alt="" fill className="object-cover" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs line-clamp-1">{msg.actionCard.data.title}</h5>
                                <span className="text-emerald-400 font-extrabold text-xs">
                                  {formatKwanza(msg.actionCard.data.promotional_price || msg.actionCard.data.price)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => msg.actionCard && addToCart(msg.actionCard.data)}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Adicionar ao Carrinho no Chat</span>
                            </button>
                          </div>
                        )}

                        {msg.actionCard.type === 'payment_reference' && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 text-slate-100">
                            <div className="text-[10px] font-bold text-amber-400 uppercase">Referência Multicaixa Express (MCX)</div>
                            <div className="grid grid-cols-2 gap-2 text-center font-mono">
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-[9px] text-slate-400 block">ENTIDADE</span>
                                <span className="font-extrabold text-white text-xs">{msg.actionCard.data.entity}</span>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg">
                                <span className="text-[9px] text-slate-400 block">REFERÊNCIA</span>
                                <span className="font-extrabold text-amber-400 text-xs">{msg.actionCard.data.reference}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.actionCard.type === 'tracking_timeline' && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 text-slate-100">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-400">Estafeta: KargaGO Express</span>
                              <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[9px]">Em Trânsito</span>
                            </div>
                            <p className="text-[10px] text-slate-300">PIN de Confirmação: 8492</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={triggerGoldenKey}
              className="p-2 text-amber-500 hover:text-amber-400 rounded-xl transition-colors bg-amber-500/10 border border-amber-500/20"
              title="Ativar Chave de Ouro"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => alert('Gravando mensagem de voz...')}
              className="p-2 text-slate-400 hover:text-amber-500 rounded-xl transition-colors"
              title="Mensagem de Voz"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite mensagem ou clique na Chave de Ouro 🔑..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-extrabold p-2 rounded-xl transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
