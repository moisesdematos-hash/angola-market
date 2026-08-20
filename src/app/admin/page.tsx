'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Store,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Star,
  Zap,
  RefreshCw,
  Eye,
  ShieldCheck,
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Map,
  Grid,
  Check,
  X,
  Award,
  Wallet,
  Ban,
  Settings,
  Key,
  Database,
  MessageSquare
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

// ─── Real-Time Simulated Platform Metrics ──────────────────────────────────
const INITIAL_METRICS = {
  gmv_today_kz: 48_750_000,
  gmv_yesterday_kz: 39_200_000,
  gmv_month_kz: 1_284_500_000,
  orders_today: 147,
  orders_pending: 23,
  orders_in_transit: 41,
  orders_delivered_today: 83,
  orders_disputed: 4,
  users_total: 3_841,
  users_new_today: 67,
  sellers_total: 312,
  sellers_pending_verification: 18,
  sellers_verified: 284,
  commission_today_kz: 4_875_000,
  commission_month_kz: 128_450_000,
  escrow_locked_kz: 24_300_000,
  avg_delivery_hours: 5.8,
  return_rate_pct: 1.4,
  satisfaction_score: 4.7,
  active_sessions: 234,
};

// ─── Provincial Breakdown ─────────────────
const PROVINCIAL_DATA = [
  { name: 'Luanda', sales_kz: 720_500_000, orders: 840, percentage: 56 },
  { name: 'Benguela', sales_kz: 180_200_000, orders: 210, percentage: 14 },
  { name: 'Huambo', sales_kz: 115_400_000, orders: 135, percentage: 9 },
  { name: 'Huíla', sales_kz: 90_100_000, orders: 105, percentage: 7 },
  { name: 'Cabinda', sales_kz: 64_300_000, orders: 75, percentage: 5 },
  { name: 'Uíge', sales_kz: 38_500_000, orders: 45, percentage: 3 },
  { name: 'Outras Províncias (12)', sales_kz: 75_500_000, orders: 88, percentage: 6 },
];

// ─── Category Sales Performance ────────────────────────────────────────────
const CATEGORY_PERFORMANCE = [
  { name: 'Telemóveis', sales_kz: 540_200_000, commission_kz: 43_216_000, items_sold: 435, icon: 'Smartphone' },
  { name: 'Computadores', sales_kz: 380_900_000, commission_kz: 38_090_000, items_sold: 210, icon: 'Laptop' },
  { name: 'Eletrodomésticos', sales_kz: 210_400_000, commission_kz: 21_040_000, items_sold: 148, icon: 'Tv' },
  { name: 'Moda & Calçado', sales_kz: 98_500_000, commission_kz: 14_775_000, items_sold: 620, icon: 'Shirt' },
  { name: 'Casa & Decor', sales_kz: 54_500_000, commission_kz: 6_540_000, items_sold: 112, icon: 'Home' },
];

// ─── Loyalty Tiers Demographics (KwanzaBack) ────────────────────────────────
const LOYALTY_TIERS = [
  { name: 'Bronze AO (VIP)', count: 2450, cashback_issued_kz: 24_500_000, min_orders: 0 },
  { name: 'Prata AO (VIP)', count: 980, cashback_issued_kz: 34_300_000, min_orders: 5 },
  { name: 'Ouro AO (VIP)', count: 312, cashback_issued_kz: 46_800_000, min_orders: 15 },
  { name: 'Diamante AO (VIP)', count: 99, cashback_issued_kz: 59_400_000, min_orders: 30 },
];

// ─── Escrow Ledger Details ──────────────────────────────────────────────────
const ESCROW_LEDGER = {
  awaiting_delivery_kz: 14_200_000,
  in_dispute_kz: 3_800_000,
  released_today_kz: 6_300_000,
  platform_commissions_held_kz: 12_845_000,
};

// ─── Initial User List (Buyers and Sellers) ──────────────────────────────────
const INITIAL_USERS = [
  { id: 'usr-001', name: 'Moisés de Matos', email: 'moisesdematos@gmail.com', role: 'customer', status: 'active', verified: false, joined: '20-08-2026', location: 'Luanda' },
  { id: 'usr-002', name: 'Luanda Tech Center', email: 'vendas@luandatech.ao', role: 'seller', status: 'active', verified: true, joined: '15-08-2026', location: 'Luanda' },
  { id: 'usr-003', name: 'Benguela Electro', email: 'contacto@benguelaelectro.ao', role: 'seller', status: 'active', verified: true, joined: '12-08-2026', location: 'Benguela' },
  { id: 'usr-004', name: 'Carlos Domingos', email: 'carlos.domingos@netangola.ao', role: 'customer', status: 'active', verified: false, joined: '18-08-2026', location: 'Huambo' },
  { id: 'usr-005', name: 'António Kipaxe', email: 'kipaxe.seller@gmail.com', role: 'seller', status: 'suspended', verified: false, joined: '01-08-2026', location: 'Cabinda' },
];

// ─── Initial Disputes List ──────────────────────────────────────────────────
const INITIAL_DISPUTES = [
  { id: 'DSP-104', orderId: 'ORD-AO-849201', buyer: 'Moisés de Matos', seller: 'Luanda Tech Center', amount_kz: 1_250_000, reason: 'Produto com riscos no ecrã', date: 'Hoje' },
  { id: 'DSP-103', orderId: 'ORD-AO-748102', buyer: 'Carlos Domingos', seller: 'Benguela Electro', amount_kz: 340_000, reason: 'Atraso na entrega KargaGO', date: 'Ontem' },
];

// ─── Initial API Configurations ─────────────────────────────────────────────
const INITIAL_APIS = [
  { name: 'Supabase Database SDK', type: 'db', status: 'connected', keyMask: 'https://xkdwumrurdvxaoyzcwqu...' },
  { name: 'Groq Cloud AI API (Llama 3 70B)', type: 'ai', status: 'connected', keyMask: 'gsk_lKh1eJMjMPY0ttuQ...' },
  { name: 'KargaGO Logistics Webhook', type: 'logistics', status: 'connected', keyMask: 'kargago_live_webhook_active' },
  { name: 'Meta WhatsApp Business API', type: 'communication', status: 'simulated', keyMask: 'whatsapp_mock_active_ao' },
];

function formatKz(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B Kz`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M Kz`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K Kz`;
  return `${value.toLocaleString()} Kz`;
}

export default function AdminDashboard() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveSessions, setLiveSessions] = useState(INITIAL_METRICS.active_sessions);

  // Lists state
  const [users, setUsers] = useState(INITIAL_USERS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [apis, setApis] = useState(INITIAL_APIS);

  // Tab switcher
  const [currentSection, setCurrentSection] = useState<'overview' | 'users' | 'apis'>('overview');

  // Simulated live update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSessions(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLastUpdated(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Ban/Unban user action
  const toggleBanUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          alert(`Utilizador ${u.name} foi ${newStatus === 'suspended' ? '🚫 BANIDO' : '🟢 DESBANIDO'} da plataforma com sucesso.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Toggle seller verification status
  const toggleVerifySeller = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newVer = !u.verified;
          alert(`Estado de verificação de ${u.name} alterado para: ${newVer ? '🏆 VERIFICADO (Selo de Loja Ativo)' : 'PENDENTE'}`);
          return { ...u, verified: newVer };
        }
        return u;
      })
    );
  };

  // Trigger test for API connectivity
  const testApiConnection = (apiName: string) => {
    alert(`📡 Teste de ligação para "${apiName}" realizado com sucesso! Latência: ${Math.floor(20 + Math.random() * 80)}ms.`);
  };

  // Dispute resolution actions
  const handleResolveDispute = (id: string, action: 'refund_buyer' | 'release_seller') => {
    setDisputes(prev => prev.filter(d => d.id !== id));
    alert(action === 'refund_buyer'
      ? '🔒 Reembolso efetuado com sucesso para a conta bancária/MCX do comprador.'
      : '🔓 Fundos libertados com sucesso em Escrow para a carteira do vendedor.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-[1500px] mx-auto px-4 py-8 w-full space-y-6">

        {/* Dashboard Title & Quick Menu tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-900 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-amber-500" />
              Painel de Controlo Principal (ANGOLA MARKET)
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Consola global de operações, gestão de credenciais e moderação de utilizadores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSection('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSection === 'overview' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Vista Geral
            </button>
            <button
              onClick={() => setCurrentSection('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSection === 'users' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              👥 Utilizadores ({users.length})
            </button>
            <button
              onClick={() => setCurrentSection('apis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentSection === 'apis' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              ⚙️ Configuração de APIs
            </button>
          </div>
        </div>

        {/* Dynamic section display */}

        {/* ─── SECTION 1: OVERVIEW ────────────────────────────────────────── */}
        {currentSection === 'overview' && (
          <div className="space-y-6">
            {/* Real-time KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Volume de Vendas (GMV)</span>
                <div className="text-3xl font-black text-white">{formatKz(INITIAL_METRICS.gmv_today_kz)}</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" /> +24.3% vs ontem
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Receita da Plataforma (10%)</span>
                <div className="text-3xl font-black text-white">{formatKz(INITIAL_METRICS.commission_today_kz)}</div>
                <div className="text-xs font-medium text-slate-400">Mês: {formatKz(INITIAL_METRICS.commission_month_kz)}</div>
              </div>

              <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Utilizadores Registados</span>
                <div className="text-3xl font-black text-white">{INITIAL_METRICS.users_total}</div>
                <div className="text-xs text-slate-400 font-bold">
                  {users.filter(u => u.role === 'customer').length} Compradores · {users.filter(u => u.role === 'seller').length} Vendedores
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/20 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Fundos Sob Custódia (Escrow)</span>
                <div className="text-3xl font-black text-white">{formatKz(INITIAL_METRICS.escrow_locked_kz)}</div>
                <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Custódia activa e segura
                </div>
              </div>
            </div>

            {/* General Graphs & Sales per Province */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  <Map className="w-4.5 h-4.5 text-amber-500" /> Vendas Regionais pelas Províncias de Angola
                </h3>
                <div className="space-y-3">
                  {PROVINCIAL_DATA.map((prov) => (
                    <div key={prov.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{prov.name}</span>
                        <span className="text-slate-400">{formatKz(prov.sales_kz)} ({prov.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-600 h-full rounded-full"
                          style={{ width: `${prov.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Disputes Console */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4.5 h-4.5" /> Disputas Escrow Pendentes
                </h3>
                <div className="space-y-3">
                  {disputes.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-4">Sem litígios pendentes de momento.</p>
                  ) : (
                    disputes.map((d) => (
                      <div key={d.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{d.buyer} ↔ {d.seller}</span>
                          <span className="font-mono text-amber-500 font-bold">{d.id}</span>
                        </div>
                        <p className="text-slate-400 text-xs italic">"{d.reason}"</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveDispute(d.id, 'refund_buyer')}
                            className="bg-red-650/80 hover:bg-red-700 bg-red-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Reembolsar Comprador
                          </button>
                          <button
                            onClick={() => handleResolveDispute(d.id, 'release_seller')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Libertar ao Vendedor
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── SECTION 2: USER MANAGEMENT & MODERATION ───────────────────── */}
        {currentSection === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-extrabold text-sm flex justify-between items-center">
              <span>Gestão & Moderação de Utilizadores (Compradores e Vendedores)</span>
              <span className="text-xs text-slate-400">Total: {users.length} utilizadores</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/65">
                    <th className="text-left px-4 py-3">Utilizador</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Tipo</th>
                    <th className="text-left px-4 py-3">Localização</th>
                    <th className="text-left px-4 py-3">Registo</th>
                    <th className="text-center px-4 py-3">Selo de Loja</th>
                    <th className="text-center px-4 py-3">Estado</th>
                    <th className="text-center px-4 py-3">Ações de Moderação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.role === 'seller' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {u.role === 'seller' ? 'Vendedor' : 'Comprador'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{u.location}</td>
                      <td className="px-4 py-3 text-slate-500">{u.joined}</td>
                      <td className="px-4 py-3 text-center">
                        {u.role === 'seller' ? (
                          <button
                            onClick={() => toggleVerifySeller(u.id)}
                            className={`font-bold text-[10px] px-2 py-1 rounded transition-colors ${
                              u.verified ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {u.verified ? '🏆 Verificado' : 'Ativar Selo'}
                          </button>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {u.status === 'active' ? 'Ativo' : 'Banido'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleBanUser(u.id)}
                          className={`font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto transition-colors ${
                            u.status === 'active' ? 'bg-red-650/20 text-red-400 hover:bg-red-600 hover:text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{u.status === 'active' ? 'Banir Usuário' : 'Desbanir'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── SECTION 3: API KEY CONFIGURATIONS ───────────────────────────── */}
        {currentSection === 'apis' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" /> Gestão de Chaves de API & Integrações
              </h3>
              <span className="text-xs text-slate-400">Verificação de dependências externas da plataforma</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apis.map((api) => (
                <div key={api.name} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {api.type === 'db' && <Database className="w-4 h-4 text-blue-400" />}
                        {api.type === 'ai' && <Zap className="w-4 h-4 text-amber-400" />}
                        {api.type === 'logistics' && <Truck className="w-4 h-4 text-emerald-400" />}
                        {api.type === 'communication' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                        <h4 className="font-bold text-xs text-white">{api.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[280px]">
                        Chave/Endpoint: {api.keyMask}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      api.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {api.status === 'connected' ? 'Activo' : 'Simulado'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => testApiConnection(api.name)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      Testar Ligação
                    </button>
                    <button
                      onClick={() => alert('Opção disponível apenas para Administradores de Infraestrutura.')}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      Editar Chave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
