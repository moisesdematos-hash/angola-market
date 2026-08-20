'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { formatKwanza } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatarInitials: string;
    location: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilizador';
          const email = user.email || '';
          
          // Generate avatar initials from name
          const initials = fullName
            .split(' ')
            .map((n: string) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

          setUserData({
            name: fullName,
            email: email,
            avatarInitials: initials,
            location: user.user_metadata?.province || 'Luanda, Angola',
          });
        } else {
          // If no user session found, redirect to login
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100">
        <Header onOpenAIShopping={() => setAiModalOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">A Minha Conta</span>
        </div>

        {/* Profile Card */}
        {userData && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {userData.avatarInitials}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{userData.name}</h1>
                <p className="text-xs text-slate-400">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Sessão Activa (Google)
                  </span>
                  <span className="text-xs text-slate-400">{userData.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-655 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-350 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        )}

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
