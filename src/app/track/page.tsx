'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { LogisticsEngine, TrackingDetails } from '@/lib/logistics/delivery-engine';
import { DeliveryMap } from '@/components/delivery/delivery-map';

export default function TrackOrderPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingDetails | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSearched(true);
    setTrackingInfo(LogisticsEngine.getTrackingInfo(inputCode));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Track My Order</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl font-extrabold tracking-tight">Rastrear Encomenda no ANGOLA MARKET</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Introduza o código de rastreamento (Ex: AO-DEL-948120) para ver a localização e estado do estafeta.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Ex: AO-DEL-948120"
              className="w-full px-3 py-2 text-sm bg-transparent outline-none font-mono text-slate-900 dark:text-white uppercase"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              Pesquisar
            </button>
          </form>
        </div>

        {searched && trackingInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Map tracker */}
            <DeliveryMap
              buyerProvince="Luanda"
              buyerMunicipality="Talatona"
              trackingCode={trackingInfo.trackingCode}
            />

            {/* Right: Timeline status */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base">Código: {trackingInfo.trackingCode}</h3>
                  <p className="text-xs text-slate-400">Estafeta: {trackingInfo.courierName} ({trackingInfo.vehicleType})</p>
                </div>
                <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                  Em Trânsito
                </span>
              </div>

              <div className="space-y-4">
                {trackingInfo.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{step.title}</h4>
                      <p className="text-[11px] text-slate-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
