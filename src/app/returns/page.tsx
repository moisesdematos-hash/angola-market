'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function ReturnsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Devoluções</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Returns Center (Devoluções)</h1>
          <p>
            O ANGOLA MARKET garante a devolução do seu dinheiro ou troca de produto em caso de avaria, divergência de especificações ou não entrega no prazo estipulado.
          </p>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Etapas da Devolução:</h3>
          <ol className="list-decimal list-inside space-y-2 font-medium">
            <li>Submeter pedido de devolução com fotos da inconformidade.</li>
            <li>Aprovação pelo suporte técnico do ANGOLA MARKET.</li>
            <li>Recolha do artigo pelo estafeta no seu endereço.</li>
            <li>Reembolso imediato para a sua conta bancária/IBAN.</li>
          </ol>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
