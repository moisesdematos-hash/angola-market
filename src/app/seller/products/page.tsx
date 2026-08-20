'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Sparkles, ShieldCheck, Trash2, Edit, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';

export default function SellerProductsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [productList, setProductList] = useState(MOCK_PRODUCTS.slice(0, 3));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/seller">Seller Center</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Meus Produtos & Anúncios</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Catálogo da Minha Loja</h1>
            <p className="text-xs text-slate-400">A gerir {productList.length} produtos ativos no ANGOLA MARKET.</p>
          </div>

          <button
            onClick={() => alert('Abrir modal de novo produto com AI Seller Copilot...')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Produto</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="space-y-3">
            {productList.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-900 overflow-hidden relative shrink-0">
                    <img src={prod.images[0]} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{prod.title}</h4>
                    <p className="text-xs text-slate-400">SKU: AO-PROD-841 • Stock: {prod.stock_quantity} unidades</p>
                    <div className="text-xs font-extrabold text-emerald-600 mt-0.5">{formatKwanza(prod.price)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductList(productList.filter((p) => p.id !== prod.id))}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
