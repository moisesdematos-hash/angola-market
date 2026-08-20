'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Sparkles, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { formatKwanza } from '@/lib/mock-data';

export default function SellerAdsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/seller">Seller Center</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">ANGOLA MARKET ADS</span>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <span className="bg-slate-950 text-amber-400 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
              Promover no Topo
            </span>
            <h1 className="text-2xl font-extrabold">ANGOLA MARKET ADS Manager</h1>
            <p className="text-xs text-slate-950/80">
              Aumente as vendas da sua loja com produtos patrocinados e banners em destaque.
            </p>
          </div>

          <button
            onClick={() => alert('Criar nova campanha de anúncio patrocinado...')}
            className="bg-slate-950 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow hover:bg-slate-900 transition-all"
          >
            Criar Campanha
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Impressões</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">42,890</div>
            <span className="text-[11px] font-bold text-emerald-600">Visualizações no Hero</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Cliques (CTR)</span>
            <div className="text-2xl font-extrabold text-amber-500">8.4%</div>
            <span className="text-[11px] font-bold text-slate-400">3,602 visitantes</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">ROAS (Retorno)</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">5.2x</div>
            <span className="text-[11px] font-bold text-emerald-600">Vendas geradas por publicidade</span>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
