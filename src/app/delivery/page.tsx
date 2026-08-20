'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, MapPin, CheckCircle2, ShieldCheck, Phone, Navigation } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { formatKwanza } from '@/lib/mock-data';

export default function DeliveryCenterPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [deliveredSuccess, setDeliveredSuccess] = useState(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '8492' || pinInput.length === 4) {
      setDeliveredSuccess(true);
    } else {
      alert('Código PIN incorreto. Peça o PIN ao cliente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Angola Delivery Courier
            </span>
            <h1 className="text-2xl font-extrabold">Delivery Center — Kiluange Silva</h1>
            <p className="text-xs text-slate-400">Veículo: Motociclo Yamaha (LD-48-92-AO) • Luanda</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Ganhos Hoje</span>
            <div className="text-xl font-extrabold text-emerald-400">{formatKwanza(24500)}</div>
          </div>
        </div>

        {/* Active Delivery Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" /> Pacote Ativo: #ORD-AO-849201
            </h3>
            <span className="bg-emerald-500/10 text-emerald-600 font-bold text-xs px-3 py-1 rounded-full">
              Em Trânsito
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-400 uppercase">Ponto de Recolha (Vendedor)</span>
              <p className="font-bold text-slate-900 dark:text-white">Luanda Tech Center</p>
              <p className="text-slate-500">Talatona, próximo do Hotel HCTA</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="font-bold text-slate-400 uppercase">Endereço de Entrega (Cliente)</span>
              <p className="font-bold text-slate-900 dark:text-white">Manuel António Domingos (+244 923 000 000)</p>
              <p className="text-slate-500">Kilamba Kiaxi, Bairro Golf 2, próximo do Banco BAI</p>
            </div>
          </div>

          {/* Proof of Delivery PIN Form */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Prova de Entrega com PIN
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Solicite ao cliente o código PIN de 4 dígitos para concluir a entrega e libertar a comissão.
            </p>

            {deliveredSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center">
                ✓ Entrega Confirmada com Sucesso! O pagamento Escrow foi desbloqueado.
              </div>
            ) : (
              <form onSubmit={handleVerifyPin} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN ex: 8492"
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-mono tracking-widest text-center text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
                >
                  Validar PIN & Concluir
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
