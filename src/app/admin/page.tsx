'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Store,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  XCircle,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { formatKwanza } from '@/lib/mock-data';

export default function AdminPanelPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Mock moderation sellers
  const [pendingSellers, setPendingSellers] = useState([
    { id: 's1', name: 'Benguela Tech Soluções', nif: '5410948199', province: 'Benguela', doc: 'NIF_Empresa.pdf' },
    { id: 's2', name: 'Malanje Eletro Store', nif: '5410881920', province: 'Malanje', doc: 'Alvara_Comercial.pdf' }
  ]);

  const approveSeller = (id: string) => {
    setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    alert('Vendedor aprovado com sucesso! Selo Verified Seller atribuído.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Super Admin Access
              </span>
              <span className="text-xs text-slate-400">ANGOLA MARKET Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Painel Administrativo da Plataforma</h1>
            <p className="text-xs text-slate-400">
              Gestão global de GMV, aprovação de NIF, disputas e comissões do marketplace.
            </p>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">GMV Total Plataforma</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatKwanza(482900000)}
            </div>
            <span className="text-[11px] font-bold text-emerald-600">Volume acumulado</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Receita de Comissões</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatKwanza(48290000)}
            </div>
            <span className="text-[11px] font-bold text-slate-400">Take-rate médio: 10.0%</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Vendedores Ativos</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">348</div>
            <span className="text-[11px] font-bold text-emerald-600">Nas 18 Províncias</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Disputas Abertas</span>
            <div className="text-2xl font-extrabold text-amber-500">2</div>
            <span className="text-[11px] font-bold text-amber-600">Requer mediação</span>
          </div>
        </div>

        {/* Seller Approval Queue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Fila de Aprovação de Vendedores (Verified Seller)
            </h3>
            <span className="text-xs font-bold text-slate-400">{pendingSellers.length} pendentes</span>
          </div>

          {pendingSellers.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Nenhum vendedor pendente de aprovação de momento.</p>
          ) : (
            <div className="space-y-3">
              {pendingSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{seller.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>NIF: {seller.nif}</span>
                      <span>•</span>
                      <span>Província: {seller.province}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium underline cursor-pointer">{seller.doc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveSeller(seller.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Aprovar
                    </button>

                    <button
                      onClick={() => setPendingSellers((prev) => prev.filter((s) => s.id !== seller.id))}
                      className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
