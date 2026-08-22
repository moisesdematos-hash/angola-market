'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShieldCheck,
  Truck,
  CreditCard,
  Store,
  Sparkles,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle2,
  Check,
  Lock,
  Headphones,
  ShoppingBag,
  TrendingUp,
  Award
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { ProductTicker } from '@/components/product-ticker';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/categories';
import { MOCK_PRODUCTS, MOCK_STORES, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export default function LandingPage() {
  const router = useRouter();
  const { items, addToCart, removeFromCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 space-y-16 pb-20">
        {/* ========================================================
            1. HERO SECTION
           ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-20 px-4">
          {/* Background Decorative Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>O Primeiro Marketplace Digital Integrado de Angola</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                O marketplace onde Angola <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">compra, vende e cresce.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Descubra produtos de milhares de vendedores de todo o país, compre com segurança garantida e receba onde estiver.
              </p>

              {/* Instant Search Box directly in Hero */}
              <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto lg:mx-0 flex items-center bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Pesquisar telemóveis, geradores, moda, frigoríficos..."
                  className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <span>Pesquisar</span>
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Comprar Agora</span>
                </Link>

                <Link
                  href="/seller"
                  className="bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Vender no ANGOLA MARKET</span>
                </Link>

                <button
                  onClick={() => setAiModalOpen(true)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs px-4 py-3.5 rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>IA de Compras</span>
                </button>
              </div>
            </div>

            {/* Right Card Mockup Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Marketplace Vivo</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">18 Províncias</span>
                </div>

                <div className="space-y-3">
                  {MOCK_PRODUCTS.slice(0, 2).map((prod) => (
                    <div key={prod.id} className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-between gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                        <Image src={prod.images[0]} alt={prod.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{prod.title}</h4>
                        <p className="text-[10px] text-slate-400">{prod.seller.store_name} ({prod.province})</p>
                        <span className="text-xs font-extrabold text-emerald-400">{formatKwanza(prod.promotional_price || prod.price)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(prod)}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Pagamento Protegido MCX
                  </div>
                  <span className="text-emerald-400 font-bold">100% Garantido</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Ticker Tape */}
        <ProductTicker />

        {/* ========================================================
            2. BENEFÍCIOS
           ======================================================== */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Porquê comprar e vender no ANGOLA MARKET?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Construído para resolver os desafios reais do comércio eletrónico em Angola.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Milhares de Produtos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Catálogo vasto de telemóveis a eletrodomésticos.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Vendedores Verificados</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Verificação rigorosa de NIF e documentos.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pagamentos Seguros</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Multicaixa Express e IBAN retido até entrega.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Entregas Integradas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Entregadores independentes em todas as zonas.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Proteção do Comprador</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Devolução garantida em caso de inconformidade.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rastreamento</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Código de rastreio em tempo real com PIN de confirmação.</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. CATEGORIAS
           ======================================================== */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Categorias em Destaque</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore o mercado por departamentos</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center font-bold text-sm">
                  {cat.name.charAt(0)}
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================
            4. PRODUTOS EM DESTAQUE (DO BANCO DE DADOS)
           ======================================================== */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Produtos em Destaque</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Provenientes de vendedores verificados em Angola</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((prod) => {
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
                      {prod.promotional_price && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full shadow">
                          Oferta
                        </span>
                      )}
                      {prod.is_verified_seller && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </span>
                      )}

                      {/* Photo area color overlay when selected */}
                      {isInCart && (
                        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[0.5px] flex items-center justify-center transition-all">
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
                        <span>Comprar</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            5. COMO FUNCIONA
           ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-12 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Como Funciona o ANGOLA MARKET</h2>
              <p className="text-xs sm:text-sm text-slate-400">Simples, seguro e sem intermediários desnecessários.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Para Compradores */}
              <div className="space-y-6 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Para Compradores
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Pesquisar</h4>
                      <p className="text-xs text-slate-400">Pesquise por nome, categoria ou utilize a IA de Compras.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Comprar & Pagar</h4>
                      <p className="text-xs text-slate-400">Adicione ao carrinho e pague via Multicaixa Express ou IBAN.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Receber com PIN</h4>
                      <p className="text-xs text-slate-400">Acompanhe a entrega e confirme a receção com o seu PIN de segurança.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Para Vendedores */}
              <div className="space-y-6 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Store className="w-5 h-5" /> Para Vendedores
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Criar Loja</h4>
                      <p className="text-xs text-slate-400">Registe a sua loja, submeta o NIF e seja verificado.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Publicar com IA Copilot</h4>
                      <p className="text-xs text-slate-400">Publique produtos em segundos com auxílio da IA para descrições e SEO.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Receber Liquidação</h4>
                      <p className="text-xs text-slate-400">O pagamento em Escrow é libertado diretamente para o seu IBAN.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. SEGURANÇA & TRUST LAYER
           ======================================================== */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-emerald-900 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" /> Camada de Confiança Garantida
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Compra 100% Protegida em Angola</h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                O ANGOLA MARKET opera um sistema de retenção temporária (Escrow). O seu dinheiro só é entregue ao vendedor depois de inspecionar e confirmar a receção do produto em perfeitas condições.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-amber-300 pt-2">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Vendedor Verificado</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Rastreio PIN</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Disputa Justa</span>
              </div>
            </div>

            <div className="shrink-0 text-center md:text-right">
              <Link
                href="/seller"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 inline-block"
              >
                Transforme o seu negócio numa loja online
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Assistant Modal */}
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
