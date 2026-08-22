'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Star, MapPin, ShoppingCart, ChevronRight, Filter, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/categories';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export default function CategoryPage() {
  const params = useParams();
  const { items, addToCart, removeFromCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const slug = typeof params.slug === 'string' ? params.slug : '';
  const categoryData = MARKETPLACE_CATEGORIES.find((c) => c.slug === slug) || MARKETPLACE_CATEGORIES[0];

  // Filter products by parent category
  const parentCategoryProducts = MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === categoryData.name.toLowerCase() || p.category.toLowerCase().includes(slug)
  );

  // Filter category products by selected subcategory
  const categoryProducts = parentCategoryProducts.filter((p) => {
    if (selectedSubcategory !== 'all') {
      const subObject = categoryData.subcategories.find(s => s.id === selectedSubcategory);
      if (subObject) {
        const pSub = p.subcategory?.toLowerCase() || '';
        const sId = subObject.id.toLowerCase();
        const sName = subObject.name.toLowerCase();
        const sSlug = subObject.slug.toLowerCase();
        
        return pSub === sId || pSub === sName || pSub === sSlug ||
               pSub.includes(sId) || sName.includes(pSub) || sSlug.includes(pSub);
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-emerald-600">Categorias</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">{categoryData.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 space-y-3 shadow-xl">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Departamento
          </span>
          <h1 className="text-3xl font-extrabold">{categoryData.name}</h1>
          <p className="text-xs text-slate-300 max-w-lg">{categoryData.description}</p>
        </div>

        {/* Subcategories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="font-bold text-slate-400 shrink-0">Subcategorias:</span>
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-all border ${
              selectedSubcategory === 'all'
                ? 'bg-emerald-650 border-emerald-600 text-white bg-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
            }`}
          >
            Todas
          </button>
          {categoryData.subcategories.map((sub) => {
            const isSelected = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(isSelected ? 'all' : sub.id)}
                className={`px-3.5 py-1.5 rounded-xl shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-emerald-650 border-emerald-600 text-white bg-emerald-600 shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold">Nenhum produto nesta subcategoria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              De momento não temos anúncios registados sob esta subcategoria nesta província. Brevemente teremos novas ofertas!
            </p>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow"
            >
              Ver todas as ofertas de {categoryData.name}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((prod) => {
              const isInCart = items.some((item) => item.product.id === prod.id);
              return (
                <div
                  key={prod.id}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group ${
                    isInCart
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/15'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                      <Image
                        src={prod.images[0]}
                        alt={prod.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {prod.is_verified_seller && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </span>
                      )}

                      {/* Photo area color overlay when selected */}
                      {isInCart && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[0.5px] flex items-center justify-center transition-all z-10">
                          <span className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-white" /> Selecionado
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{prod.seller.store_name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500" /> {prod.rating_avg}
                        </span>
                      </div>

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
                      onClick={() => isInCart ? removeFromCart(prod.id) : addToCart(prod)}
                      className={`font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow flex items-center gap-1 group/btn ${
                        isInCart
                          ? 'bg-emerald-100 hover:bg-red-50 dark:bg-emerald-950 dark:hover:bg-red-950/40 text-emerald-800 hover:text-red-650 dark:text-emerald-350 dark:hover:text-red-400 border border-emerald-250 dark:border-emerald-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 group-hover/btn:hidden" />
                          <span className="group-hover/btn:hidden">No Carrinho</span>
                          <span className="hidden group-hover/btn:inline">Remover</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Comprar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
