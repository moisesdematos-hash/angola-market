'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
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
  Ban,
  ShieldCheck,
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

// ─── Mock Real-Time Metrics ────────────────────────────────────────────────
const REALTIME_METRICS = {
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

const TOP_SELLERS = [
  { name: 'Luanda Tech Center', province: 'Luanda', sales_kz: 18_400_000, orders: 47, score: 98.2, verified: true },
  { name: 'Benguela Electro', province: 'Benguela', sales_kz: 12_100_000, orders: 31, score: 95.1, verified: true },
  { name: 'Moda Angola Premium', province: 'Luanda', sales_kz: 9_870_000, orders: 83, score: 97.4, verified: true },
  { name: 'Huambo Fresh Market', province: 'Huambo', sales_kz: 7_240_000, orders: 28, score: 91.8, verified: true },
  { name: 'Cabinda Oil & Gas Shop', province: 'Cabinda', sales_kz: 5_990_000, orders: 19, score: 88.3, verified: false },
];

const RECENT_ORDERS = [
  { id: 'ORD-AO-184721', buyer: 'Carlos M.', seller: 'Luanda Tech', product: 'iPhone 15 Pro Max', amount_kz: 1_250_000, status: 'paid', province: 'Luanda', time: '2 min' },
  { id: 'ORD-AO-184720', buyer: 'Ana S.', seller: 'Moda Angola', product: 'Vestido Premium', amount_kz: 85_000, status: 'shipped', province: 'Benguela', time: '8 min' },
  { id: 'ORD-AO-184719', buyer: 'João P.', seller: 'Benguela Electro', product: 'Gerador 5kW', amount_kz: 780_000, status: 'processing', province: 'Benguela', time: '15 min' },
  { id: 'ORD-AO-184718', buyer: 'Maria L.', seller: 'Huambo Fresh', product: 'Frigorífico LG', amount_kz: 420_000, status: 'disputed', province: 'Huambo', time: '32 min' },
  { id: 'ORD-AO-184717', buyer: 'Pedro R.', seller: 'Luanda Tech', product: 'Samsung S24 Ultra', amount_kz: 980_000, status: 'delivered', province: 'Luanda', time: '1h' },
];

const WEEKLY_REVENUE = [
  { day: 'Seg', gmv: 38.2, commission: 3.82 },
  { day: 'Ter', gmv: 42.1, commission: 4.21 },
  { day: 'Qua', gmv: 35.8, commission: 3.58 },
  { day: 'Qui', gmv: 51.3, commission: 5.13 },
  { day: 'Sex', gmv: 68.9, commission: 6.89 },
  { day: 'Sáb', gmv: 74.5, commission: 7.45 },
  { day: 'Dom', gmv: 48.75, commission: 4.875 },
];

function formatKz(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B Kz`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M Kz`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K Kz`;
  return `${value.toLocaleString()} Kz`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    processing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    disputed: 'bg-red-500/20 text-red-400 border-red-500/30',
    delivered: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };
  const labels: Record<string, string> = {
    paid: 'Pago', shipped: 'Enviado', processing: 'A Processar',
    disputed: 'Disputado', delivered: 'Entregue',
  };
  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${map[status] || ''}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AdminDashboard() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveOrders, setLiveOrders] = useState(REALTIME_METRICS.orders_today);
  const [liveSessions, setLiveSessions] = useState(REALTIME_METRICS.active_sessions);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'sellers' | 'finance'>('overview');

  const gmv_growth = ((REALTIME_METRICS.gmv_today_kz - REALTIME_METRICS.gmv_yesterday_kz) / REALTIME_METRICS.gmv_yesterday_kz * 100).toFixed(1);
  const maxGmv = Math.max(...WEEKLY_REVENUE.map(d => d.gmv));

  // Simulate real-time counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOrders(prev => prev + Math.floor(Math.random() * 2));
      setLiveSessions(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLastUpdated(new Date());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 py-6 w-full space-y-6">

        {/* Top Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-amber-400" />
              Admin Dashboard
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Super Admin</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              Dados em tempo real — Atualizado às {lastUpdated.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              {liveSessions} Sessões Activas
            </div>
            <button
              onClick={() => setLastUpdated(new Date())}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* GMV Today */}
          <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-950/80 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase">GMV Hoje</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{formatKz(REALTIME_METRICS.gmv_today_kz)}</div>
            <div className={`flex items-center gap-1 text-[11px] font-bold ${parseFloat(gmv_growth) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {parseFloat(gmv_growth) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {gmv_growth}% vs ontem
            </div>
          </div>

          {/* Comissão Hoje */}
          <div className="bg-gradient-to-br from-amber-900/60 to-amber-950/80 border border-amber-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase">Comissão Hoje</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{formatKz(REALTIME_METRICS.commission_today_kz)}</div>
            <div className="text-[11px] font-bold text-amber-400">
              Mês: {formatKz(REALTIME_METRICS.commission_month_kz)}
            </div>
          </div>

          {/* Pedidos Hoje */}
          <div className="bg-gradient-to-br from-blue-900/60 to-blue-950/80 border border-blue-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 uppercase">Pedidos Hoje</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{liveOrders}</div>
            <div className="text-[11px] font-bold text-blue-400 flex items-center gap-2">
              <span className="text-amber-400">{REALTIME_METRICS.orders_pending} pendentes</span>
              <span>·</span>
              <span className="text-red-400">{REALTIME_METRICS.orders_disputed} disputas</span>
            </div>
          </div>

          {/* Escrow Bloqueado */}
          <div className="bg-gradient-to-br from-purple-900/60 to-purple-950/80 border border-purple-500/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase">Escrow Bloqueado</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">{formatKz(REALTIME_METRICS.escrow_locked_kz)}</div>
            <div className="text-[11px] font-bold text-purple-400">
              Pagamentos em custódia segura
            </div>
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'Utilizadores', value: REALTIME_METRICS.users_total.toLocaleString(), sub: `+${REALTIME_METRICS.users_new_today} hoje`, icon: Users, color: 'text-emerald-400' },
            { label: 'Vendedores', value: REALTIME_METRICS.sellers_total, sub: `${REALTIME_METRICS.sellers_pending_verification} pendentes`, icon: Store, color: 'text-amber-400' },
            { label: 'Em Trânsito', value: REALTIME_METRICS.orders_in_transit, sub: 'via KargaGO', icon: Truck, color: 'text-blue-400' },
            { label: 'Entregues Hoje', value: REALTIME_METRICS.orders_delivered_today, sub: `${REALTIME_METRICS.avg_delivery_hours}h média`, icon: CheckCircle2, color: 'text-teal-400' },
            { label: 'Satisfação', value: `${REALTIME_METRICS.satisfaction_score}/5`, sub: 'média das avaliações', icon: Star, color: 'text-yellow-400' },
            { label: 'Taxa Retorno', value: `${REALTIME_METRICS.return_rate_pct}%`, sub: 'meta: <2%', icon: RefreshCw, color: 'text-rose-400' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{kpi.label}</span>
                <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
              <div className={`text-xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-slate-500">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue Bar Chart + Top Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly Revenue Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" /> Receita Semanal (M Kz)
              </h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> GMV</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Comissão</span>
              </div>
            </div>

            <div className="flex items-end gap-2 h-36">
              {WEEKLY_REVENUE.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-emerald-600 rounded-t-md transition-all duration-500 hover:bg-emerald-500"
                      style={{ height: `${(d.gmv / maxGmv) * 100}px` }}
                      title={`GMV: ${d.gmv}M Kz`}
                    />
                    <div
                      className="w-full bg-amber-500 rounded-t-md"
                      style={{ height: `${(d.commission / maxGmv) * 100}px` }}
                      title={`Comissão: ${d.commission}M Kz`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-center text-xs">
              <div>
                <div className="font-extrabold text-emerald-400">{formatKz(REALTIME_METRICS.gmv_month_kz)}</div>
                <div className="text-slate-500 text-[10px]">GMV do Mês</div>
              </div>
              <div>
                <div className="font-extrabold text-amber-400">{formatKz(REALTIME_METRICS.commission_month_kz)}</div>
                <div className="text-slate-500 text-[10px]">Comissão do Mês</div>
              </div>
              <div>
                <div className="font-extrabold text-purple-400">{formatKz(REALTIME_METRICS.escrow_locked_kz)}</div>
                <div className="text-slate-500 text-[10px]">Em Escrow</div>
              </div>
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Top Vendedores
            </h3>
            <div className="space-y-2">
              {TOP_SELLERS.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                    i === 0 ? 'bg-amber-500 text-slate-950' :
                    i === 1 ? 'bg-slate-400 text-slate-950' :
                    i === 2 ? 'bg-amber-800 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">{s.name}</span>
                      {s.verified && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400">{s.province} · Score: {s.score}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-emerald-400">{formatKz(s.sales_kz)}</div>
                    <div className="text-[10px] text-slate-500">{s.orders} pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Orders Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Pedidos em Tempo Real
            </h3>
            <Link href="/admin/orders" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="text-left px-4 py-2.5">Pedido</th>
                  <th className="text-left px-4 py-2.5">Comprador</th>
                  <th className="text-left px-4 py-2.5">Produto</th>
                  <th className="text-left px-4 py-2.5">Valor</th>
                  <th className="text-left px-4 py-2.5">Província</th>
                  <th className="text-left px-4 py-2.5">Estado</th>
                  <th className="text-left px-4 py-2.5">Há</th>
                  <th className="text-left px-4 py-2.5">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{order.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{order.buyer}</td>
                    <td className="px-4 py-3 text-slate-300 truncate max-w-[140px]">{order.product}</td>
                    <td className="px-4 py-3 font-extrabold text-amber-400">{formatKz(order.amount_kz)}</td>
                    <td className="px-4 py-3 text-slate-400">{order.province}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{order.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white" title="Ver">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {order.status === 'disputed' && (
                          <button className="p-1 rounded-lg hover:bg-red-900/40 text-red-400" title="Resolver Disputa">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Alerts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-xs text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Disputas Abertas ({REALTIME_METRICS.orders_disputed})
            </h4>
            <p className="text-[11px] text-slate-400">4 pedidos com disputa activa aguardam resolução da equipa.</p>
            <button className="text-xs font-bold text-red-400 hover:underline">Resolver disputas →</button>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Verificação de Lojas ({REALTIME_METRICS.sellers_pending_verification})
            </h4>
            <p className="text-[11px] text-slate-400">18 lojas aguardam análise de documentos para selo Verified.</p>
            <button className="text-xs font-bold text-amber-400 hover:underline">Verificar lojas →</button>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <h4 className="font-extrabold text-xs text-emerald-400 flex items-center gap-1.5">
              <Package className="w-4 h-4" /> Entregas KargaGO ({REALTIME_METRICS.orders_in_transit})
            </h4>
            <p className="text-[11px] text-slate-400">41 pedidos em trânsito com rastreio KargaGO activo.</p>
            <button className="text-xs font-bold text-emerald-400 hover:underline">Ver mapa de entregas →</button>
          </div>
        </div>

      </main>

      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
