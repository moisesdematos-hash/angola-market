'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Send, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function DisputesPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && reason) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Resolução de Disputas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Resolution Center (Centro de Disputas)</h1>
              <p className="text-xs text-slate-400">Mediação imparcial entre comprador e vendedor para proteção Escrow.</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-2">
              <h3 className="font-extrabold text-emerald-800 dark:text-emerald-300">✓ Disputa Aberta com Sucesso!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                O pagamento Escrow para a encomenda #{orderNumber} foi congelado. A equipa de mediação responderá em menos de 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Número do Pedido *</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: ORD-AO-849201"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Motivo da Disputa *</label>
                <textarea
                  rows={4}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Descreva o problema com o produto recebido ou atraso grave..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Abrir Disputa com Congelamento Escrow</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
