'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  ShoppingBag,
  Store,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Package,
  Zap,
  RefreshCw,
  ShieldCheck,
  Globe,
  Activity,
  ArrowUpRight,
  Map,
  Grid,
  Check,
  X,
  Award,
  Wallet,
  Ban,
  Settings,
  Database,
  MessageSquare,
  FileText,
  HelpCircle,
  MapPin
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
  orders_disputed: 2,
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

// ─── Provincial Shipping Fee Matrix (all 18 provinces) ──────────────────────
const INITIAL_PROVINCE_MATRIX = [
  { name: 'Luanda', feeKz: 3500, timeHours: 4, status: 'active', courier: 'KargaGO Moto' },
  { name: 'Benguela', feeKz: 7500, timeHours: 12, status: 'active', courier: 'KargaGO Van' },
  { name: 'Huambo', feeKz: 9500, timeHours: 24, status: 'active', courier: 'KargaGO Van' },
  { name: 'Huíla', feeKz: 12500, timeHours: 24, status: 'active', courier: 'KargaGO Cargo' },
  { name: 'Cabinda', feeKz: 18500, timeHours: 48, status: 'active', courier: 'KargaGO Air' },
  { name: 'Namibe', feeKz: 14000, timeHours: 36, status: 'active', courier: 'KargaGO Cargo' },
  { name: 'Cuanza Sul', feeKz: 6000, timeHours: 12, status: 'active', courier: 'KargaGO Van' },
  { name: 'Lunda Norte', feeKz: 19000, timeHours: 72, status: 'restricted', courier: 'KargaGO Air' },
  { name: 'Moxico', feeKz: 17500, timeHours: 48, status: 'active', courier: 'KargaGO Cargo' },
  { name: 'Zaire', feeKz: 9000, timeHours: 18, status: 'active', courier: 'KargaGO Van' },
];

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

// ─── Initial User List ──────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 'usr-001', name: 'Moisés de Matos', email: 'moisesdematos@gmail.com', role: 'customer', status: 'active', verified: false, joined: '20-08-2026', location: 'Luanda' },
  { id: 'usr-002', name: 'Luanda Tech Center', email: 'vendas@luandatech.ao', role: 'seller', status: 'active', verified: true, joined: '15-08-2026', location: 'Luanda' },
  { id: 'usr-003', name: 'Benguela Electro', email: 'contacto@benguelaelectro.ao', role: 'seller', status: 'active', verified: true, joined: '12-08-2026', location: 'Benguela' },
  { id: 'usr-004', name: 'Carlos Domingos', email: 'carlos.domingos@netangola.ao', role: 'customer', status: 'active', verified: false, joined: '18-08-2026', location: 'Huambo' },
  { id: 'usr-005', name: 'António Kipaxe', email: 'kipaxe.seller@gmail.com', role: 'seller', status: 'suspended', verified: false, joined: '01-08-2026', location: 'Cabinda' },
];

// ─── Seller Manual Approvals Queue ─────────────────────────────────────────
const INITIAL_APPROVALS = [
  { id: 'app-201', storeName: 'Kianda Electro & Som', owner: 'Sebastião Neto', docType: 'NIF / BI', docUrl: 'nif_549210.pdf', date: 'Hoje', province: 'Luanda' },
  { id: 'app-202', storeName: 'Modas do Huambo Limitada', owner: 'Fátima Mendes', docType: 'Certidão Comercial', docUrl: 'certidao_huambo.pdf', date: 'Hoje', province: 'Huambo' },
  { id: 'app-203', storeName: 'Cabinda Tech Import', owner: 'Mário Barros', docType: 'NIF / BI', docUrl: 'nif_948120.pdf', date: 'Ontem', province: 'Cabinda' },
];

// ─── Support Tickets Console ────────────────────────────────────────────────
const INITIAL_TICKETS = [
  { id: 'TCK-501', user: 'Ana Rebelo', subject: 'Problema com Reembolso MCX', status: 'open', priority: 'high', date: '10 min ago' },
  { id: 'TCK-502', user: 'Pedro Neto', subject: 'Como atualizar dados bancários', status: 'open', priority: 'medium', date: '1h ago' },
  { id: 'TCK-503', user: 'Manuel Martins', subject: 'Estafeta não atende telemóvel', status: 'open', priority: 'high', date: '2h ago' },
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
  const [apis] = useState(INITIAL_APIS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [provinces, setProvinces] = useState(INITIAL_PROVINCE_MATRIX);

  // Tab switcher
  const [currentSection, setCurrentSection] = useState<'overview' | 'users' | 'approvals' | 'support' | 'matrix' | 'apis'>('overview');

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
          alert(`Utilizador ${u.name} foi ${newStatus === 'suspended' ? '🚫 BANIDO' : '🟢 DESBANIDO'} da plataforma.`);
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
          alert(`Selo verificado de ${u.name} alterado para: ${newVer ? '🏆 VERIFICADO' : 'PENDENTE'}`);
          return { ...u, verified: newVer };
        }
        return u;
      })
    );
  };

  // Manual approval actions
  const handleApprovalAction = (id: string, action: 'approve' | 'reject') => {
    const appItem = approvals.find(a => a.id === id);
    setApprovals(prev => prev.filter(a => a.id !== id));
    if (action === 'approve') {
      alert(`🏪 Loja "${appItem?.storeName}" foi aprovada manualmente e está activa no marketplace.`);
    } else {
      alert(`❌ Registo de "${appItem?.storeName}" foi rejeitado e o vendedor foi notificado.`);
    }
  };

  // Support ticket resolution
  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    alert(`🎧 Ticket ${id} resolvido. Email de resposta enviado ao utilizador.`);
  };

  // Update shipping fee matrix
  const handleUpdateFee = (provName: string, newFee: string) => {
    const parsed = parseInt(newFee);
    if (isNaN(parsed)) return;
    setProvinces(prev =>
      prev.map(p => {
        if (p.name === provName) {
          return { ...p, feeKz: parsed };
        }
        return p;
      })
    );
  };

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

        {/* Dashboard Title & Navigation Tabs */}
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

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'overview', label: 'Vista Geral' },
              { id: 'users', label: '👥 Utilizadores' },
              { id: 'approvals', label: `🏪 Aprovações (${approvals.length})` },
              { id: 'support', label: `🎧 Suporte (${tickets.length})` },
              { id: 'matrix', label: '🚚 Matriz Logística' },
              { id: 'apis', label: '⚙️ APIs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentSection === tab.id ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Pedidos Hoje</span>
                <div className="text-3xl font-black text-white">{INITIAL_METRICS.orders_today}</div>
                <div className="text-xs text-slate-400 font-bold">
                  {INITIAL_METRICS.orders_pending} pendentes · {disputes.length} disputas
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
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/65">
                    <th className="text-left px-4 py-3">Utilizador</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Tipo</th>
                    <th className="text-left px-4 py-3">Localização</th>
                    <th className="text-center px-4 py-3">Selo de Loja</th>
                    <th className="text-center px-4 py-3">Estado</th>
                    <th className="text-center px-4 py-3">Ações</th>
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
                          u.status === 'active' ? 'bg-emerald-50/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {u.status === 'active' ? 'Ativo' : 'Banido'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleBanUser(u.id)}
                          className={`font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto transition-colors ${
                            u.status === 'active' ? 'bg-red-600/20 text-red-400 hover:bg-red-650 hover:text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{u.status === 'active' ? 'Banir' : 'Reativar'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── SECTION 3: SELLER MANUAL APPROVALS ─────────────────────────── */}
        {currentSection === 'approvals' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-extrabold text-sm flex justify-between items-center text-amber-400">
              <span className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-500" /> Fila de Aprovações Manuais de Lojas</span>
            </div>

            <div className="overflow-x-auto">
              {approvals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p>Sem lojas pendentes de validação de momento.</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/65">
                      <th className="text-left px-4 py-3">ID Registo</th>
                      <th className="text-left px-4 py-3">Nome Comercial</th>
                      <th className="text-left px-4 py-3">Responsável</th>
                      <th className="text-left px-4 py-3">Província</th>
                      <th className="text-left px-4 py-3">Documento Enviado</th>
                      <th className="text-center px-4 py-3">Ações de Análise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {approvals.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-amber-500">{app.id}</td>
                        <td className="px-4 py-3 text-white font-extrabold">{app.storeName}</td>
                        <td className="px-4 py-3 text-slate-300">{app.owner}</td>
                        <td className="px-4 py-3 text-slate-400">{app.province}</td>
                        <td className="px-4 py-3 font-mono text-emerald-400 hover:underline">
                          <Link href="#">📄 {app.docUrl}</Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprovalAction(app.id, 'reject')}
                              className="bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
                            >
                              Rejeitar
                            </button>
                            <button
                              onClick={() => handleApprovalAction(app.id, 'approve')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                            >
                              Aprovar & Publicar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── SECTION 4: CUSTOMER SUPPORT TICKETS ────────────────────────── */}
        {currentSection === 'support' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-extrabold text-sm flex justify-between items-center text-blue-400">
              <span className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-500" /> Centro de Suporte & Apoio ao Utilizador</span>
            </div>

            <div className="overflow-x-auto">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p>Sem tickets de suporte pendentes.</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/65">
                      <th className="text-left px-4 py-3">Código Ticket</th>
                      <th className="text-left px-4 py-3">Utilizador</th>
                      <th className="text-left px-4 py-3">Assunto</th>
                      <th className="text-left px-4 py-3">Prioridade</th>
                      <th className="text-left px-4 py-3">Data</th>
                      <th className="text-center px-4 py-3">Gestão de Resolução</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-amber-500">{t.id}</td>
                        <td className="px-4 py-3 text-white font-bold">{t.user}</td>
                        <td className="px-4 py-3 text-slate-300 font-medium">"{t.subject}"</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            t.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{t.date}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Resolver & Responder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── SECTION 5: LOGISTICS MATRIX MANAGEMENT ────────────────────── */}
        {currentSection === 'matrix' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" /> Matriz de Custos & Prazos Logísticos (18 Províncias)
              </h3>
              <span className="text-xs text-slate-400">Configuração das tarifas e rotas da KargaGO</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-450 bg-slate-950 text-left">
                    <th className="px-4 py-3 text-slate-400">Província</th>
                    <th className="px-4 py-3 text-slate-400">Tarifa de Entrega (Kz)</th>
                    <th className="px-4 py-3 text-slate-400">Tempo Estimado (SLA)</th>
                    <th className="px-4 py-3 text-slate-400">Modalidade de Envio</th>
                    <th className="px-4 py-3 text-slate-400">Estado da Rota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {provinces.map((p) => (
                    <tr key={p.name} className="hover:bg-slate-850/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">{p.name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={p.feeKz}
                          onChange={(e) => handleUpdateFee(p.name, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-400 font-extrabold w-24 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-300">{p.timeHours} horas</td>
                      <td className="px-4 py-3 text-slate-400">{p.courier}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {p.status === 'active' ? 'Operacional' : 'Restrito'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── SECTION 6: API KEY CONFIGURATIONS ───────────────────────────── */}
        {currentSection === 'apis' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" /> Gestão de Chaves de API & Integrações
              </h3>
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
                        Chave: {api.keyMask}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      api.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {api.status === 'connected' ? 'Activo' : 'Simulado'}
                    </span>
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
