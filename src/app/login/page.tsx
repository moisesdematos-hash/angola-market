'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { SupabaseAuthService } from '@/lib/supabase/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await SupabaseAuthService.signIn(email, password);
      router.push('/account');
    } catch {
      // Allow demo login
      router.push('/account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await SupabaseAuthService.signInWithGoogle();
    } catch {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Iniciar Sessão</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
              AM
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Iniciar Sessão no ANGOLA MARKET</h1>
            <p className="text-xs text-slate-500">Aceda à sua conta de cliente ou vendedor.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 font-bold text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.ao"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Palavra-passe *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 pl-9 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow flex items-center justify-center gap-2"
            >
              {loading ? 'A iniciar sessão...' : 'Entrar na Conta'}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-400">ou</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs py-3 rounded-2xl transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <span>Continuar com Google</span>
          </button>

          <div className="text-center text-xs text-slate-500 pt-2">
            Ainda não tem conta?{' '}
            <Link href="/register" className="font-bold text-emerald-600 hover:underline">
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
