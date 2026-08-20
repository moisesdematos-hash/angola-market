'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Store, ShieldCheck, Award, MapPin, Star, Phone, ShoppingCart, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MOCK_STORES, MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export default function StorefrontPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const slug = typeof params.slug === 'string' ? params.slug : '';
  const store = MOCK_STORES.find((s) => s.slug === slug) || MOCK_STORES[0];

  const storeProducts = MOCK_PRODUCTS.filter((p) => p.seller.id === store.id || p.seller.store_slug === store.slug);
  const displayProducts = storeProducts.length > 0 ? storeProducts : MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-emerald-600">Lojas</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">{store.name}</span>
        </div>

        {/* Store Banner & Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="relative w-full h-48 bg-slate-800">
            <Image src={store.banner_url} alt={store.name} fill className="object-cover" />
          </div>

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 -mt-12 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-lg">
                <Image src={store.logo_url} alt="" fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{store.name}</h1>
                  {store.verified && (
                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Store
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">{store.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {store.province}, {store.municipality}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {store.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-right shrink-0">
              <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow">
                <Award className="w-3.5 h-3.5" /> {store.score}/100
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                Score: {store.score_tier}
              </div>
              <span className="text-[10px] text-slate-400">{store.total_sales} vendas concluídas</span>
            </div>
          </div>
        </div>

        {/* Store Catalog */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold tracking-tight">Produtos da Loja</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <Image
                      src={prod.images[0]}
                      alt={prod.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <Link href={`/product/${prod.slug}`} className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-600 line-clamp-2">
                      {prod.title}
                    </Link>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{prod.province}, {prod.municipality}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-2 flex items-center justify-between">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatKwanza(prod.promotional_price || prod.price)}
                  </span>

                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Comprar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
