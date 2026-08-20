'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function PrivacyPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Política de Privacidade</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Política de Privacidade e Proteção de Dados</h1>
          <p>
            A sua privacidade é fundamental para o ANGOLA MARKET. Cumprimos com a legislação de proteção de dados pessoais aplicável em Angola.
          </p>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Dados Recolhidos</h3>
          <p>
            Recolhemos informação necessária para o processamento de encomendas e verificação de vendedores (Nome, NIF, Telefone, Província/Município e IBAN para pagamentos).
          </p>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
