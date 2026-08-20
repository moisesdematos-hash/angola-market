'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Building2, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function SellerSettingsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [iban, setIban] = useState('AO06.0040.0000.5410.9481.2014.1');
  const [bankName, setBankName] = useState('Banco Angolano de Investimentos (BAI)');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/seller">Seller Center</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Configurações da Loja</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Configurações de Conta e IBAN de Liquidação</h1>
              <p className="text-xs text-slate-400">Gerir conta bancária para recebimento automático de vendas em Escrow.</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Dados bancários atualizados!'); }} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Banco de Liquidação *</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none font-bold"
              >
                <option value="Banco Angolano de Investimentos (BAI)">Banco Angolano de Investimentos (BAI)</option>
                <option value="Banco de Fomento Angola (BFA)">Banco de Fomento Angola (BFA)</option>
                <option value="Banco BIC">Banco BIC</option>
                <option value="Banco Millennium Atlântico (BMA)">Banco Millennium Atlântico (BMA)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">IBAN de Recebimento *</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-mono text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow"
            >
              Guardar Alterações
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
