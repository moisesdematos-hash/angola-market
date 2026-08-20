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
  Wallet
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

// ─── Provincial Breakdown (all 18 provinces representation) ─────────────────
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

// ─── Top Sellers ───────────────────────────────────────────────────────────
const TOP_SELLERS = [
  { name: 'Luanda Tech Center', province: 'Luanda', sales_kz: 18_400_000, orders: 47, score: 98.2, verified: true },
  { name: 'Benguela Electro', province: 'Benguela', sales_kz: 12_100_000, orders: 31, score: 95.1, verified: true },
  { name: 'Moda Angola Premium', province: 'Luanda', sales_kz: 9_870_000, orders: 83, score: 97.4, verified: true },
  { name: 'Huambo Fresh Market', province: 'Huambo', sales_kz: 7_240_000, orders: 28, score: 91.8, verified: true },
  { name: 'Cabinda Oil & Gas Shop', province: 'Cabinda', sales_kz: 5_990_000, orders: 19, score: 88.3, verified: false },
];

// ─── Active Disputes Console ────────────────────────────────────────────────
const INITIAL_DISPUTES = [
  { id: 'DSP-104', orderId: 'ORD-AO-849201', buyer: 'Moisés de Matos', seller: 'Luanda Tech Center', amount_kz: 1_250_000, reason: 'Produto com riscos no ecrã', date: 'Hoje' },
  { id: 'DSP-103', orderId: 'ORD-AO-748102', buyer: 'Carlos Domingos', seller: 'Benguela Electro', amount_kz: 340_000, reason: 'Atraso na entrega KargaGO', date: 'Ontem' },
  { id: 'DSP-102', orderId: 'ORD-AO-619204', buyer: 'Ana Rebelo', seller: 'Moda Angola Premium', amount_kz: 45_000, reason: 'Tamanho do vestido incorreto', date: 'Há 2 dias' },
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
  const [liveOrders, setLiveOrders] = useState(INITIAL_METRICS.orders_today);
  const [liveSessions, setLiveSessions] = useState(INITIAL_METRICS.active_sessions);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [resolvedDisputesCount, setResolvedDisputesCount] = useState(0);

  // Simulated live update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOrders(prev => prev + Math.floor(Math.random() * 2));
      setLiveSessions(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLastUpdated(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveDispute = (id: string, action: 'refund_buyer' | 'release_seller') => {
    setDisputes(prev => prev.filter(d => d.id !== id));
    setResolvedDisputesCount(prev => prev + 1);
    alert(action === 'refund_buyer'
      ? '🔒 Reembolso efetuado com sucesso para a conta bancária/MCX do comprador.'
      : '🔓 Fundos libertados com sucesso em Escrow para a carteira do vendedor.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-[1500px] mx-auto px-4 py-8 w-full space-y-8">
        
        {/* Header Section with Live Status Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-900 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-amber-500" />
              Painel de Administração do ANGOLA MARKET
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Super Admin
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Monitorização em tempo real das 18 províncias · Atualizado às {lastUpdated.toLocaleTimeString('pt-AO')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400">
              <Globe className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '4s' }} />
              {liveSessions} Utilizadores Online
            </div>
            <button
              onClick={() => setLastUpdated(new Date())}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

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
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Volume de Pedidos (Live)</span>
            <div className="text-3xl font-black text-white">{liveOrders}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">{INITIAL_METRICS.orders_pending} pendentes</span>
              <span>·</span>
              <span className="text-red-400 font-bold">{disputes.length} disputas ativas</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/20 rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Fundos Sob Custódia (Escrow)</span>
            <div className="text-3xl font-black text-white">{formatKz(INITIAL_METRICS.escrow_locked_kz)}</div>
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Pagamentos 100% protegidos
            </div>
          </div>
        </div>

        {/* Advanced Statistics Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Provincial Distribution (Angola Map Heatmap mock) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Map className="w-4.5 h-4.5 text-amber-500" /> Distribuição de Vendas por Províncias
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

          {/* Category Performance Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Grid className="w-4.5 h-4.5 text-blue-500" /> Vendas por Categorias do Catálogo
            </h3>
            <div className="divide-y divide-slate-800">
              {CATEGORY_PERFORMANCE.map((cat) => (
                <div key={cat.name} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{cat.name}</span>
                    <span className="text-[10px] text-slate-500">{cat.items_sold} artigos vendidos</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">{formatKz(cat.sales_kz)}</span>
                    <span className="text-[10px] text-amber-500 font-bold">Comissão: {formatKz(cat.commission_kz)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Custody Ledger & Loyalty demographics */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2 pb-3">
                <Wallet className="w-4.5 h-4.5 text-purple-500" /> Detalhes Contabilísticos (Custódia)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Aguardando Envio</span>
                  <span className="font-extrabold text-white">{formatKz(ESCROW_LEDGER.awaiting_delivery_kz)}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Em Disputa</span>
                  <span className="font-extrabold text-red-400">{formatKz(ESCROW_LEDGER.in_dispute_kz)}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Libertados Hoje</span>
                  <span className="font-extrabold text-emerald-400">{formatKz(ESCROW_LEDGER.released_today_kz)}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Retenção Taxa</span>
                  <span className="font-extrabold text-amber-400">{formatKz(ESCROW_LEDGER.platform_commissions_held_kz)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2 pb-2">
                <Award className="w-4.5 h-4.5 text-amber-500" /> Fidelização Clientes (Tiers KwanzaBack)
              </h3>
              <div className="space-y-2 text-xs">
                {LOYALTY_TIERS.map((tier) => (
                  <div key={tier.name} className="flex justify-between items-center text-[11px] bg-slate-950/50 p-2 rounded-lg">
                    <span className="font-bold text-white">{tier.name}</span>
                    <span className="text-slate-400">{tier.count} utilizadores</span>
                    <span className="font-extrabold text-emerald-400">{formatKz(tier.cashback_issued_kz)} total</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Resolution Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <h3 className="font-extrabold text-sm flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4.5 h-4.5" /> Consola de Resolução de Disputas do Administrador
            </h3>
            {resolvedDisputesCount > 0 && (
              <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                {resolvedDisputesCount} resolvidas nesta sessão
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            {disputes.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs font-bold space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>Excelente! Não há disputas pendentes no ANGOLA MARKET de momento.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-900/60">
                    <th className="text-left px-4 py-2.5">ID Disputa</th>
                    <th className="text-left px-4 py-2.5">Pedido</th>
                    <th className="text-left px-4 py-2.5">Comprador</th>
                    <th className="text-left px-4 py-2.5">Vendedor</th>
                    <th className="text-left px-4 py-2.5">Valor em Custódia</th>
                    <th className="text-left px-4 py-2.5">Motivo Alegado</th>
                    <th className="text-center px-4 py-2.5">Ações do Administrador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {disputes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-850 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-amber-500">{d.id}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-300">{d.orderId}</td>
                      <td className="px-4 py-3 text-white font-medium">{d.buyer}</td>
                      <td className="px-4 py-3 text-slate-400">{d.seller}</td>
                      <td className="px-4 py-3 font-extrabold text-red-400">{formatKz(d.amount_kz)}</td>
                      <td className="px-4 py-3 text-slate-300 italic">"{d.reason}"</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleResolveDispute(d.id, 'refund_buyer')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <X className="w-3 h-3" /> Reembolsar Comprador
                          </button>
                          <button
                            onClick={() => handleResolveDispute(d.id, 'release_seller')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Check className="w-3 h-3" /> Libertar ao Vendedor
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
      </main>
      
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
