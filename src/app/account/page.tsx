'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, ShieldCheck, Clock, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { formatKwanza } from '@/lib/mock-data';

export default function AccountDashboardPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              MA
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Manuel António Domingos</h1>
              <p className="text-xs text-slate-400">manuel.domingos@email.ao • +244 923 000 000</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Cliente Verificado
                </span>
                <span className="text-xs text-slate-400">Luanda, Talatona</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" /> Meus Pedidos Recentes
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">#ORD-AO-849201</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Em Trânsito
                  </span>
                </div>
                <p className="text-xs text-slate-500">iPhone 15 Pro Max 256GB • Vendido por Luanda Tech Center</p>
                <div className="text-xs font-bold text-emerald-600">{formatKwanza(1253500)}</div>
              </div>

              <Link
                href="/order/ORD-AO-849201"
                className="bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Rastrear & Ver PIN
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
