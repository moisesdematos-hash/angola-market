'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, Headphones, Store, Send, Paperclip, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { ChatService, ChatConversation, ChatMessage } from '@/lib/chat/chat-service';

export default function FullscreenChatPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [conversations] = useState<ChatConversation[]>(ChatService.getInitialConversations());
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'conv-1': ChatService.getInitialMessages('conv-1'),
    'conv-2': ChatService.getInitialMessages('conv-2')
  });

  const [inputMessage, setInputMessage] = useState('');
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = messages[selectedConvId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const { safeText, isBlocked, warningMsg } = ChatService.sanitizeChatMessage(inputMessage);

    if (isBlocked && warningMsg) {
      setSecurityWarning(warningMsg);
      setTimeout(() => setSecurityWarning(null), 5000);
    }

    const newMessage: ChatMessage = {
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

    setInputMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Centro de Mensagens & Chat</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 h-[600px]">
          {/* Left Panel: Conversations List */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-extrabold text-sm flex items-center justify-between">
              <span>Conversas do Marketplace</span>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {conversations.length} ativas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`p-4 cursor-pointer transition-colors space-y-1 ${
                    selectedConvId === c.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {c.participantRole === 'support' ? <Headphones className="w-3.5 h-3.5 text-amber-500" /> : <Store className="w-3.5 h-3.5 text-emerald-600" />}
                      {c.participantName}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{c.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Messages Stream */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {activeConv.participantRole === 'support' ? <Headphones className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{activeConv.participantName}</h3>
                  <span className="text-[10px] text-slate-400">{activeConv.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl">
                <ShieldCheck className="w-4 h-4" /> Escrow Protegido
              </div>
            </div>

            {securityWarning && (
              <div className="bg-amber-500/20 text-amber-300 text-xs p-2 text-center font-medium">
                {securityWarning}
              </div>
            )}

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
              {activeMessages.map((msg) => {
                const isMe = msg.senderRole === 'customer';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                    <span className="text-[10px] text-slate-400">{msg.senderName} • {msg.timestamp}</span>
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Anexar ficheiro...')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
