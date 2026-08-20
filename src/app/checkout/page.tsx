'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, MapPin, CreditCard, Building2, Smartphone, Banknote, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { useCart } from '@/context/cart-context';
import { ANGOLA_PROVINCES, PAYMENT_METHODS } from '@/lib/constants/angola-data';
import { PaymentAdapter, PaymentMethodType } from '@/lib/payments/payment-adapter';
import { formatKwanza } from '@/lib/mock-data';
import { WhatsAppService } from '@/lib/whatsapp/whatsapp-service';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalAmount, clearCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Luanda');
  const [municipality, setMunicipality] = useState('Talatona');
  const [bairro, setBairro] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mcx');

  const [loading, setLoading] = useState(false);
  const [mcxPhoneInput, setMcxPhoneInput] = useState('');

  const shippingFee = 3500;
  const totalAmount = subtotalAmount + shippingFee;

  const currentProvinceData = ANGOLA_PROVINCES.find((p) => p.name === province) || ANGOLA_PROVINCES[0];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !bairro || !landmark) {
      alert('Por favor preencha todos os campos obrigatórios do endereço.');
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-AO-${Math.floor(100000 + Math.random() * 900000)}`;

      // Process with payment adapter
      const paymentResult = await PaymentAdapter.processPayment({
        orderId,
        amountKz: totalAmount,
        method: paymentMethod,
        customerPhone: phone
      });

      // Send WhatsApp Notification to Buyer (Multicaixa reference, Escrow details, and tracking link)
      await WhatsAppService.sendWhatsAppNotification(phone, 'order_placed_buyer', {
        buyerName: fullName,
        orderNumber: orderId,
        totalKz: formatKwanza(totalAmount),
        mcxReference: paymentResult.paymentDetails.mcxReference || 'N/A',
        trackingCode: orderId,
        courier: 'KargaGO (www.kargago.com)'
      });

      // Send WhatsApp Notification to Seller (if seller details are available)
      const sellerPhone = '+244923111222'; // Default mock seller contact
      await WhatsAppService.sendWhatsAppNotification(sellerPhone, 'order_placed_seller', {
        sellerName: 'Luanda Tech Center',
        orderNumber: orderId,
        productTitle: items[0]?.product.title || 'Artigo do Catálogo',
        totalKz: formatKwanza(subtotalAmount)
      });

      // Clear cart
      clearCart();

      // Redirect to Order Confirmation
      router.push(`/order/${orderId}?ref=${paymentResult.paymentDetails.mcxReference || 'direct'}`);
    } catch {
      alert('Erro ao processar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100">
        <Header onOpenAIShopping={() => setAiModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">Nenhum produto no carrinho</h2>
          <Link href="/shop" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
            Voltar à Loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-emerald-600">Carrinho</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Finalizar Compra</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Checkout Seguro</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Angola Delivery Address & Payment Method Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Address Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">1</div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Endereço de Entrega em Angola
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Manuel António Domingos"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Província *</label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      const pData = ANGOLA_PROVINCES.find((p) => p.name === e.target.value);
                      if (pData) setMunicipality(pData.municipalities[0]);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {ANGOLA_PROVINCES.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Município *</label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {currentProvinceData.municipalities.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Morro Bento, Vila Alice, Benfica..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Ponto de Referência / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Ex: próximo do Supermercado Kero, em frente ao Banco BAI..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">2</div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Método de Pagamento Protegido (Escrow)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as PaymentMethodType)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      paymentMethod === pm.id
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {pm.id === 'mcx' && <Smartphone className="w-6 h-6 text-emerald-600" />}
                      {pm.id === 'bank_transfer' && <Building2 className="w-6 h-6 text-emerald-600" />}
                      {pm.id === 'cod' && <Banknote className="w-6 h-6 text-amber-500" />}

                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as PaymentMethodType)}
                        className="accent-emerald-600"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{pm.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {pm.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {paymentMethod === 'mcx' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    Instrução Multicaixa Express (MCX):
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Ao confirmar o pedido, será gerada instantaneamente uma Entidade e Referência Multicaixa para pagar via aplicativo ou caixa eletrónico.
                  </p>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    Dados da Conta para Transferência (IBAN):
                  </p>
                  <p className="font-mono text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 select-all">
                    IBAN: AO06.0040.0000.1234.5678.1014.1 (BAI)
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Titular: ANGOLA MARKET RETENÇÃO DE SEGURANÇA
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout Summary & Submit */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm sticky top-24">
              <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                Resumo Final ({items.reduce((acc, i) => acc + i.quantity, 0)} itens)
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <span className="truncate max-w-[180px] text-slate-700 dark:text-slate-300">
                      {item.quantity}x {item.product.title}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatKwanza((item.product.promotional_price || item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatKwanza(subtotalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Entrega Estimada</span>
                  <span className="font-bold">{formatKwanza(shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold">Total a Pagar</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatKwanza(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>A processar pedido...</span>
                ) : (
                  <>
                    <span>Confirmar Pedido Protegido</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="w-full bg-slate-150 hover:bg-slate-200 bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 text-center"
              >
                ← Voltar ao Carrinho
              </Link>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Garantia ANGOLA MARKET
                </div>
                <p>O valor só é libertado ao vendedor após o seu código PIN confirmar a receção.</p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
