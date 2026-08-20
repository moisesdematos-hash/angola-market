'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, Store, Building2, FileText, ChevronRight, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { SupabaseAuthService } from '@/lib/supabase/auth-service';
import { ANGOLA_PROVINCES } from '@/lib/constants/angola-data';

export default function RegisterPage() {
  const router = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [accountType, setAccountType] = useState<'customer' | 'seller'>('customer');

  // Customer Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Seller Additional Fields
  const [storeName, setStoreName] = useState('');
  const [nif, setNif] = useState('');
  const [province, setProvince] = useState('Luanda');
  const [iban, setIban] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await SupabaseAuthService.signUp(email, password, fullName, phone);

      if (accountType === 'seller') {
        router.push('/seller');
      } else {
        router.push('/account');
      }
    } catch {
      if (accountType === 'seller') {
        router.push('/seller');
      } else {
        router.push('/account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-lg mx-auto px-4 py-12 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Registar Conta</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
          {/* Account Type Selector Tab */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Criar Conta no ANGOLA MARKET</h1>
            <p className="text-xs text-slate-500">Escolha o tipo de conta para começar:</p>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold pt-1">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'customer'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sou Comprador</span>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('seller')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  accountType === 'seller'
                    ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Quero Vender (Loja)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nome Completo *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Manuel António Domingos"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.ao"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Telemóvel (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+244 923 000 000"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Seller Specific Extra Fields */}
            {accountType === 'seller' && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dados para Obtenção do Selo Verified Seller</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Nome da Loja *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Luanda Electronics & Store"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">NIF da Empresa/BI *</label>
                    <input
                      type="text"
                      required
                      value={nif}
                      onChange={(e) => setNif(e.target.value)}
                      placeholder="Ex: 5410948120"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Província *</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none"
                    >
                      {ANGOLA_PROVINCES.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">IBAN para Recebimentos (BAI/BFA) *</label>
                  <input
                    type="text"
                    required
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="AO06.0040.0000.1234.5678.1014.1"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Palavra-passe *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow flex items-center justify-center gap-2 ${
                accountType === 'seller'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {loading
                ? 'A registar...'
                : accountType === 'seller'
                ? 'Criar Minha Loja & registar no Seller Center'
                : 'Criar Minha Conta de Comprador'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Já possui uma conta?{' '}
            <Link href="/login" className="font-bold text-emerald-600 hover:underline">
              Iniciar Sessão
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
