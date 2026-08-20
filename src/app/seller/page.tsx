'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Sparkles,
  Package,
  Plus,
  ShieldCheck,
  AlertCircle,
  Megaphone,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { GroqAIService } from '@/lib/ai/groq-service';
import { formatKwanza } from '@/lib/mock-data';

export default function SellerCenterPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [copilotModalOpen, setCopilotModalOpen] = useState(false);

  // Copilot Form
  const [copilotBrief, setCopilotBrief] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<any>(null);

  const handleRunCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotBrief.trim()) return;

    setCopilotLoading(true);
    try {
      const res = await GroqAIService.generateSellerListing(copilotBrief);
      setCopilotResult(res);
    } catch {
      // Handled
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Seller Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Seller
              </span>
              <span className="text-xs text-slate-400 font-medium">NIF: 5410948120</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Painel do Vendedor — Luanda Tech Center</h1>
            <p className="text-xs text-slate-400">
              Gestão de catálogo, stock, comissões e assistente AI Seller Copilot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCopilotModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>AI Seller Copilot</span>
            </button>

            <Link
              href="/seller/products"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Produto</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">Receita Bruta (GMV)</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatKwanza(14850000)}
            </div>
            <span className="text-[11px] font-bold text-emerald-600">+18% este mês</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">Pedidos Concluídos</span>
              <ShoppingBag className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">1,420</div>
            <span className="text-[11px] font-bold text-slate-400">Taxa de Cumprimento: 99.2%</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">Angola Seller Score</span>
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">98/100</span>
              <span className="text-xs font-bold text-slate-500">Excelente</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">Posição de destaque no catálogo</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">Comissão da Plataforma</span>
              <TrendingUp className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">8.0%</div>
            <span className="text-[11px] font-bold text-slate-400">Categoria Telemóveis</span>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/seller/products"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base group-hover:text-emerald-600">Gestão de Produtos & Stock</h4>
                <p className="text-xs text-slate-400">Cadastrar, alterar preços e alertas de stock baixo.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/seller/ads"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base group-hover:text-amber-600">ANGOLA MARKET ADS</h4>
                <p className="text-xs text-slate-400">Promover produtos patrocinados no topo das buscas.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/seller/settings"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base group-hover:text-emerald-600">Dados da Loja & IBAN</h4>
                <p className="text-xs text-slate-400">Configurar conta bancária BAI/BFA e documentos NIF.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* AI Seller Copilot Modal */}
      {copilotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2 text-amber-500">
                <Sparkles className="w-5 h-5" /> AI SELLER COPILOT
              </h3>
              <button onClick={() => setCopilotModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleRunCopilot} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Descreva resumidamente o seu produto:
                </label>
                <textarea
                  rows={3}
                  value={copilotBrief}
                  onChange={(e) => setCopilotBrief(e.target.value)}
                  placeholder="Ex: Tenho um iPhone 14 128GB usado em muito bom estado com caixa."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={copilotLoading || !copilotBrief.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all shadow"
              >
                {copilotLoading ? 'A gerar anúncio com IA...' : 'Gerar Título, Descrição, Tags e Preço'}
              </button>
            </form>

            {copilotResult && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div>
                  <span className="font-bold uppercase text-slate-400">Título Sugerido:</span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{copilotResult.title}</div>
                </div>

                <div>
                  <span className="font-bold uppercase text-slate-400">Descrição Gerada:</span>
                  <p className="text-slate-600 dark:text-slate-300">{copilotResult.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold">Preço Recomendado: {formatKwanza(copilotResult.recommendedPriceKz)}</span>
                  <button
                    onClick={() => {
                      alert('Anúncio pré-preenchido com sucesso!');
                      setCopilotModalOpen(false);
                    }}
                    className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                  >
                    Usar no Anúncio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
