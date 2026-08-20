'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Store, ArrowRight, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { useCart } from '@/context/cart-context';
import { formatKwanza } from '@/lib/mock-data';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, subtotalAmount, groupedBySeller } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const estimatedShipping = items.length > 0 ? 3500 : 0;
  const grandTotal = subtotalAmount + estimatedShipping;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Carrinho de Compras</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Meu Carrinho</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar Carrinho
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold text-3xl">
              <ShoppingCart className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">O seu carrinho está vazio</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Navegue pelo ANGOLA MARKET e adicione produtos de milhares de vendedores verificados.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all shadow"
            >
              <span>Explorar Produtos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items Grouped by Seller */}
            <div className="lg:col-span-8 space-y-6">
              {Object.entries(groupedBySeller).map(([sellerId, group]) => (
                <div
                  key={sellerId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm"
                >
                  {/* Seller Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Vendedor: {group.storeName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Divisão Automática de Pedido</span>
                  </div>

                  {/* Seller Items */}
                  <div className="space-y-4">
                    {group.items.map((item) => {
                      const itemPrice = item.product.promotional_price || item.product.price;
                      return (
                        <div
                          key={`${item.product.id}-${item.variantId}`}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 shrink-0">
                              <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-600 truncate block"
                              >
                                {item.product.title}
                              </Link>
                              {item.variantName && (
                                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium">
                                  {item.variantName}
                                </span>
                              )}
                              <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                {formatKwanza(itemPrice)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                                className="px-2.5 py-1 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                                className="px-2.5 py-1 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id, item.variantId)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm sticky top-24">
                <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  Resumo da Encomenda
                </h3>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal de Produtos</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatKwanza(subtotalAmount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxa Estimada de Entrega</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatKwanza(estimatedShipping)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Total Final</span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatKwanza(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <span>Avançar para Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push('/shop')}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <span>← Continuar a Comprar</span>
                </button>

                <div className="pt-2 text-[11px] text-slate-450">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pagamento com Retenção Protegida em Escrow
                  </div>
                  <p>Multicaixa Express, IBAN ou Pagamento na Entrega disponível no próximo passo.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
