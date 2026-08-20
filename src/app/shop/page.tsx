'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Filter,
  Search,
  MapPin,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/categories';
import { ANGOLA_PROVINCES } from '@/lib/constants/angola-data';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export default function ShopPage() {
  const { addToCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [onlyVerifiedSellers, setOnlyVerifiedSellers] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance');

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

      return true;
    }).sort((a, b) => {
      const priceA = a.promotional_price || a.price;
      const priceB = b.promotional_price || b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
      return 0; // relevance
    });
  }, [searchQuery, selectedCategory, selectedProvince, onlyVerifiedSellers, maxPrice, sortBy]);

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

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" /> Filtros de Pesquisa
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedProvince('all');
                    setOnlyVerifiedSellers(false);
                    setMaxPrice(2000000);
                    setSearchQuery('');
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  Limpar
                </button>
              </div>

              {/* Text Search filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Palavra-chave</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: iPhone, LG, Nike..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {MARKETPLACE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Province Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Província do Vendedor</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="all">Todas as 18 Províncias</option>
                  {ANGOLA_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Preço Máximo</label>
                  <span className="font-extrabold text-emerald-600">{formatKwanza(maxPrice)}</span>
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
                  }}
                  className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Restaurar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
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
                        {prod.is_verified_seller && (
                          <span className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <ShieldCheck className="w-3 h-3" /> Verificado
                          </span>
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
            )}
          </section>
        </div>
      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
