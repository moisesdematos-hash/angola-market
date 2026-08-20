'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Paperclip, ShieldCheck, User, Store, Headphones, Circle } from 'lucide-react';
import { ChatService, ChatConversation, ChatMessage } from '@/lib/chat/chat-service';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>(ChatService.getInitialConversations());
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

    // Apply Anti-circumvention filter
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

    // Simulated Auto-response for demo
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        conversationId: selectedConvId,
        senderId: 'auto-reply',
        senderName: activeConv.participantName,
        senderRole: activeConv.participantRole,
        text: activeConv.participantRole === 'support'
          ? 'Obrigado por nos contactar! A nossa equipa de suporte está a processar a sua solicitação com garantia Escrow.'
          : 'Agradecemos a mensagem! A nossa loja responde em média em menos de 10 minutos.',
        timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => ({
        ...prev,
        [selectedConvId]: [...(prev[selectedConvId] || []), autoReply]
      }));
    }, 1200);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-110 group border-2 border-white dark:border-slate-800"
        aria-label="Abrir Chat"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-extrabold hidden group-hover:inline pr-1">Chat ANGOLA MARKET</span>
        {conversations.some((c) => c.unreadCount > 0) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
            1
          </span>
        )}
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px] animate-fade-in">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                  {activeConv.participantRole === 'support' ? <Headphones className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                </div>
                {activeConv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  {activeConv.participantName}
                  {activeConv.participantRole === 'support' && (
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                      Oficial
                    </span>
                  )}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {activeConv.isOnline ? 'Online agora' : 'Disponível'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Channels Selector Bar */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
                  selectedConvId === c.id
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c.participantRole === 'support' ? <Headphones className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                <span className="truncate max-w-[120px]">{c.participantName}</span>
              </button>
            ))}
          </div>

          {/* Security Alert Banner */}
          <div className="bg-emerald-950 text-emerald-100 px-3 py-1.5 text-[10px] flex items-center justify-between border-b border-emerald-900">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Chat Protegido contra Fraudes & Retenção Escrow
            </span>
          </div>

          {/* Anti-circumvention Warning Banner */}
          {securityWarning && (
            <div className="bg-amber-500/20 text-amber-300 text-[11px] p-2 text-center border-b border-amber-500/30 animate-pulse font-medium">
              {securityWarning}
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            {activeMessages.map((msg) => {
              const isMe = msg.senderRole === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="text-[10px] text-slate-400 font-medium px-1">
                    {msg.senderName} • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
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

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Anexar fotografia ou comprovativo...')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              title="Anexar Imagem"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escreva a sua mensagem..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
