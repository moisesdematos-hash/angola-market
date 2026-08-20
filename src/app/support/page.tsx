'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Headphones, ShieldCheck, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

export default function SupportPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Centro de Suporte</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Apoio ao Cliente ANGOLA MARKET</h1>
              <p className="text-xs text-slate-400">Atendimento em português das 08h às 20h.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-200 dark:border-slate-700">
              <Phone className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Linha Direta</h4>
              <p className="text-xs text-slate-500">+244 923 000 111</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-200 dark:border-slate-700">
              <MessageSquare className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">WhatsApp Oficial</h4>
              <p className="text-xs text-slate-500">+244 912 000 222</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-200 dark:border-slate-700">
              <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Email Suporte</h4>
              <p className="text-xs text-slate-500">suporte@angolamarket.ao</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
