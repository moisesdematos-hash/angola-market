'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Truck, Copy, Download, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { LogisticsEngine } from '@/lib/logistics/delivery-engine';
import { formatKwanza } from '@/lib/mock-data';

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const orderId = typeof params.id === 'string' ? params.id : 'ORD-AO-849201';
  const mcxRef = searchParams.get('ref') || '849 201 104';

  const trackingInfo = LogisticsEngine.getTrackingInfo('AO-DEL-948120');

  // Escrow / PIN states
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'completed'>('pending');
  const [voucherUploaded, setVoucherUploaded] = useState(searchParams.get('voucher') === 'true');
  const [shippingFee, setShippingFee] = useState(Number(searchParams.get('shipping') || 3500));
  const [totalAmount, setTotalAmount] = useState(Number(searchParams.get('total') || 1253500));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const currentTimeline = trackingInfo.timeline.map((step, idx) => {
    if (idx === 4) { // Final step (Entregue)
      return {
        ...step,
        done: orderStatus === 'completed',
        timestamp: orderStatus === 'completed' ? 'Agora' : 'Pendente',
        description: orderStatus === 'completed' 
          ? 'Confirmado com PIN pelo comprador. Custódia terminada.' 
          : 'Confirmação final mediante apresentação do código PIN ao estafeta.'
      };
    }
    return step;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Pedido Registado com Sucesso!
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Pedido #{orderId}</h1>
            <p className="text-xs text-emerald-100 max-w-md">
              O seu pagamento está seguro em Escrow. Acompanhe a entrega abaixo.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-200">PIN de Confirmação</span>
            <div className="text-2xl font-extrabold tracking-widest text-amber-300 font-mono">
              {trackingInfo.pinVerificationCode}
            </div>
            <span className="text-[10px] text-emerald-100">Apresentar ao estafeta na entrega</span>
          </div>
        </div>

        {/* MCX Reference Pay Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Estado do Pagamento (Garantia de Custódia)
            </h3>
            {orderStatus === 'completed' ? (
              <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg">
                Garantia Concluída (Pago ao Vendedor)
              </span>
            ) : voucherUploaded ? (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Pago (Retido em Escrow)
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-2.5 py-1 rounded-lg">
                Aguardando Pagamento
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            {!mcxRef.startsWith('PP-') && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 font-bold uppercase">Entidade</span>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">00124</div>
              </div>
            )}

            <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 relative ${
              mcxRef.startsWith('PP-') ? 'sm:col-span-2' : ''
            }`}>
              <span className="text-slate-400 font-bold uppercase">
                {mcxRef.startsWith('PP-') ? 'Referência PayPay Angola' : 'Referência de Pagamento'}
              </span>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {mcxRef}
              </div>
              {!voucherUploaded && orderStatus !== 'completed' && (
                <button
                  onClick={() => copyToClipboard(mcxRef)}
                  className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 mx-auto mt-1"
                >
                  <Copy className="w-3 h-3" /> {copiedRef ? 'Copiado!' : 'Copiar'}
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold uppercase">Valor Total</span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                {formatKwanza(totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* PIN Verification Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500 animate-pulse" /> Confirmar Receção da Compra (PIN)
            </h3>
            <span className={`font-bold text-xs px-2.5 py-1 rounded-lg ${
              orderStatus === 'completed' 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {orderStatus === 'completed' ? 'Entregue & Pago' : 'Aguardando Entrega'}
            </span>
          </div>

          {orderStatus === 'completed' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300 space-y-1 text-center animate-scale-in">
              <p className="font-extrabold text-sm">🎉 Transação Concluída!</p>
              <p>O seu PIN foi validado. O valor foi creditado de forma segura no IBAN do vendedor.</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Obrigado por utilizar o sistema de custódia do ANGOLA MARKET.</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Ao receber a mercadoria física e certificar-se de que está em bom estado, introduza o seu **PIN de Confirmação** para libertar o pagamento em Escrow ao vendedor.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">PIN de Confirmação (Digite {trackingInfo.pinVerificationCode} para testar)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Ex: 8492"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest outline-none dark:text-white ${
                      pinError 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (enteredPin === trackingInfo.pinVerificationCode) {
                      setOrderStatus('completed');
                    } else {
                      setPinError(true);
                      alert('PIN incorreto. Use o código ' + trackingInfo.pinVerificationCode + ' para prosseguir.');
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow"
                >
                  Confirmar Receção
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" /> Rastreamento em Tempo Real ({trackingInfo.trackingCode})
            </h3>
            <a
              href={LogisticsEngine.buildWhatsAppAlertUrl('+244923112233', trackingInfo.trackingCode, orderId)}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-emerald-500/20"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Receber Alertas WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            {currentTimeline.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  {idx < currentTimeline.length - 1 && (
                    <div
                      className={`w-0.5 h-10 ${
                        step.done ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-850'
                      }`}
                    />
                  )}
                </div>

                <div className="space-y-0.5 pt-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h4>
                    <span className="text-[10px] font-semibold text-slate-400">{step.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Generator Action */}
        <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl">
          <div>
            <h4 className="font-bold text-sm">Fatura / Recibo Digital com NIF</h4>
            <p className="text-xs text-slate-400">Emissão automática para efeitos fiscais e garantia do produto.</p>
          </div>
          <button
            onClick={() => alert('A descarregar Fatura/Recibo PDF com NIF...')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4" /> Descarregar PDF
          </button>
        </div>

        {/* Back navigation */}
        <div className="flex justify-center pt-2">
          <Link
            href="/shop"
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-6 py-3.5 rounded-2xl transition-all"
          >
            ← Voltar para a Loja
          </Link>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
