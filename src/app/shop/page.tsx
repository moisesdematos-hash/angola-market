'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  ChevronRight,
  ShoppingCart,
  Check
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/categories';
import { ANGOLA_PROVINCES } from '@/lib/constants/angola-data';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

function ShopContent() {
  const { items, addToCart, removeFromCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const searchParams = useSearchParams();

  const qParam = searchParams.get('q') || '';
  const provinceParam = searchParams.get('province') || 'all';

  // Filters state
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>(provinceParam);
  const [onlyVerifiedSellers, setOnlyVerifiedSellers] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance');
  const [selectedConditionTab, setSelectedConditionTab] = useState<'all' | 'novo' | 'reciclado_usado'>('all');

  // Synchronize state when URL query params change
  useEffect(() => {
    setSearchQuery(qParam);
    setSelectedProvince(provinceParam);
  }, [qParam, provinceParam]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        const matchesBrand = prod.brand?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesBrand) return false;
      }

      // Category
      if (selectedCategory !== 'all' && prod.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Province
      if (selectedProvince !== 'all' && prod.province.toLowerCase() !== selectedProvince.toLowerCase()) {
        return false;
      }

      // Verified seller
      if (onlyVerifiedSellers && !prod.is_verified_seller) {
        return false;
      }

      // Price
      const finalPrice = prod.promotional_price || prod.price;
      if (finalPrice > maxPrice) {
        return false;
      }

      // Condition Tab Filter
      const cond = prod.condition || 'novo';
      if (selectedConditionTab === 'novo' && cond !== 'novo') {
        return false;
      }
      if (selectedConditionTab === 'reciclado_usado' && cond !== 'usado' && cond !== 'reciclado') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.promotional_price || a.price;
      const priceB = b.promotional_price || b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
      return 0; // relevance
    });
  }, [searchQuery, selectedCategory, selectedProvince, onlyVerifiedSellers, maxPrice, sortBy, selectedConditionTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Marketplace</span>
        </div>

        {/* Title & Sorting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Catálogo Geral do Marketplace</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A mostrar {filteredProducts.length} produtos de vendedores em Angola
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto">
            <span className="text-slate-500 shrink-0">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-850 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-xl text-xs font-bold outline-none text-slate-700 dark:text-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <option value="relevance">Relevância</option>
              <option value="price_asc">Preço: Baixo para Alto</option>
              <option value="price_desc">Preço: Alto para Baixo</option>
              <option value="rating">Melhor Avaliação</option>
            </select>
          </div>
        </div>

        {/* Tabs for Condition (Recycled / Used / New) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedConditionTab('all')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              selectedConditionTab === 'all'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>Todos os Artigos</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
              {MOCK_PRODUCTS.length}
            </span>
          </button>
          
          <button
            onClick={() => setSelectedConditionTab('novo')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              selectedConditionTab === 'novo'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>Novos (Selados)</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
              {MOCK_PRODUCTS.filter(p => !p.condition || p.condition === 'novo').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedConditionTab('reciclado_usado')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              selectedConditionTab === 'reciclado_usado'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>Reciclados & Usados</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              {MOCK_PRODUCTS.filter(p => p.condition === 'usado' || p.condition === 'reciclado').length}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filtros de Busca
                </h3>
              </div>

              {/* Text Search inside filters */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Procurar palavra-chave</label>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-500/5 px-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Samsung, Gerador..."
                    className="w-full py-2 bg-transparent border-none outline-none text-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-3 py-2.5 rounded-xl text-xs outline-none cursor-pointer text-slate-700 dark:text-slate-350"
                >
                  <option value="all">Todas as Categorias</option>
                  {MARKETPLACE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Província de Origem</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-3 py-2.5 rounded-xl text-xs outline-none cursor-pointer text-slate-700 dark:text-slate-355"
                >
                  <option value="all">Todas as Províncias</option>
                  {ANGOLA_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Preço Máximo</label>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatKwanza(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={2000000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Verified Seller Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={onlyVerifiedSellers}
                    onChange={(e) => setOnlyVerifiedSellers(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Apenas Vendedores Verificados</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <section className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold">Nenhum produto encontrado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tente ajustar os seus filtros de pesquisa ou província para encontrar mais produtos.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedProvince('all');
                    setOnlyVerifiedSellers(false);
                    setMaxPrice(2000000);
                    setSearchQuery('');
                    setSelectedConditionTab('all');
                  }}
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Restaurar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
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
                          {prod.condition && prod.condition !== 'novo' && (
                            <span className={`absolute top-3 left-3 font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow z-10 ${
                              prod.condition === 'reciclado'
                                ? 'bg-teal-600 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}>
                              {prod.condition === 'reciclado' ? '♻️ Reciclado' : '🏷️ Usado'}
                            </span>
                          )}
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
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{prod.seller.store_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-500" /> {prod.rating_avg}
                            </span>
                          </div>

                          <Link href={`/product/${prod.slug}`} className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 leading-snug">
                            {prod.title}
                          </Link>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span>{prod.province}, {prod.municipality}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-2 flex items-center justify-between">
                        <div>
                          {prod.promotional_price ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 line-through">
                                {formatKwanza(prod.price)}
                              </span>
                              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                                {formatKwanza(prod.promotional_price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                              {formatKwanza(prod.price)}
                            </span>
                          )}
                        </div>

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
          </section>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f17]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
