'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function TermsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Termos de Serviço</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Termos e Condições de Uso</h1>
          <p>
            O ANGOLA MARKET opera como uma infraestrutura de comércio digital marketplace em Angola. A plataforma conecta vendedores independentes a compradores, fornecendo liquidação financeira em retenção temporária (Escrow), catálogo e gestão logística.
          </p>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Modelo de Negócio e Isenção de Stock</h3>
          <p>
            O ANGOLA MARKET não mantém stock próprio nem adquire mercadorias antecipadamente. Os vendedores verificados são inteiramente responsáveis pela guarda, qualidade e especificações dos produtos listados.
          </p>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. Pagamentos e Retenção Escrow</h3>
          <p>
            Todos os pagamentos realizados via Multicaixa Express (MCX) ou transferência bancária ficam retidos até que o comprador confirme a receção dos produtos ou expire o prazo regulamentar.
          </p>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
