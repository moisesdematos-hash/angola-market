'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  Star,
  Store,
  MapPin,
  CheckCircle2,
  ShoppingCart,
  Award,
  ChevronRight,
  Share2,
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [pechinchaModalOpen, setPechinchaModalOpen] = useState(false);

  const slug = typeof params.slug === 'string' ? params.slug : '';
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const finalPrice = selectedVariant ? selectedVariant.price : (product.promotional_price || product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant?.id, selectedVariant?.name);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant?.id, selectedVariant?.name);
    router.push('/checkout');
  };

  // Pechincha IA states
  const [pechinchaMessages, setPechinchaMessages] = useState<Array<{ sender: 'user' | 'ia'; text: string }>>([
    { sender: 'ia', text: `Olá! Sou o assistente de negociação do ${product.seller.store_name}. Tens boa lábia? Quanto gostarias de oferecer por este artigo?` }
  ]);
  const [offerInput, setOfferInput] = useState('');
  const [negotiatedPrice, setNegotiatedPrice] = useState<number | null>(null);
  const [bargainCompleted, setBargainCompleted] = useState(false);
  const [negotiationAttempts, setNegotiationAttempts] = useState(0);

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offerValue = Number(offerInput.replace(/[^0-9]/g, ''));
    if (isNaN(offerValue) || offerValue <= 0) {
      alert('Por favor introduza um valor numérico válido.');
      return;
    }

    const updatedMessages = [...pechinchaMessages, { sender: 'user' as const, text: `Ofereço ${formatKwanza(offerValue)}.` }];
    setPechinchaMessages(updatedMessages);
    setOfferInput('');

    setTimeout(() => {
      const minAcceptable = finalPrice * 0.8;
      const fastAccept = finalPrice * 0.95;
      
      let reply = '';
      if (offerValue < minAcceptable) {
        if (negotiationAttempts === 0) {
          reply = `Eia mano! ${formatKwanza(offerValue)} é muito baixo. Queres me falir? A praça está difícil! Sobe mais um bocado para fazermos negócio.`;
          setNegotiationAttempts(1);
        } else {
          reply = `Ainda está muito curto, chefe. O preço mínimo que posso fazer para não ter prejuízo é ${formatKwanza(Math.floor(finalPrice * 0.88))}. O que achas?`;
        }
      } else if (offerValue >= fastAccept) {
        reply = `Negócio fechado! Gostei da tua seriedade. Faço por ${formatKwanza(offerValue)}. Adiciona já ao carrinho!`;
        setNegotiatedPrice(offerValue);
        setBargainCompleted(true);
      } else {
        if (negotiationAttempts === 0) {
          const counterOffer = Math.floor(finalPrice * 0.9);
          reply = `Olha, tens boa lábia. Que tal dividirmos a diferença? Aceito fazer por ${formatKwanza(counterOffer)}. O que me diz?`;
          setNegotiatedPrice(counterOffer);
          setNegotiationAttempts(1);
        } else {
          reply = `Pronto, está bem! Aceito a tua oferta de ${formatKwanza(offerValue)}. Fechado por ti. Adiciona ao carrinho!`;
          setNegotiatedPrice(offerValue);
          setBargainCompleted(true);
        }
      }

      setPechinchaMessages(prev => [...prev, { sender: 'ia' as const, text: reply }]);
    }, 1000);
  };

  const handleAddNegotiatedToCart = () => {
    if (negotiatedPrice) {
      addToCart(product, quantity, selectedVariant?.id, selectedVariant?.name, negotiatedPrice);
      setAddedToast(true);
      setPechinchaModalOpen(false);
      setTimeout(() => setAddedToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-emerald-600">Catálogo</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{product.title}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.is_verified_seller && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-4 h-4" /> Vendedor Verificado
                </span>
              )}
            </div>

            {/* Thumbnail previews */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Price, Seller Score & Purchase */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Brand */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="bg-slate-100 dark:bg-slate-800 font-bold px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                  {product.category}
                </span>
                <span>SKU: {selectedVariant?.sku || 'AO-PROD-9481'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-500 font-bold gap-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating_avg}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">{product.reviews_count} avaliações verificadas</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{product.sales_count} vendidos</span>
              </div>

              {/* Price Tag */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">Preço com Retenção Protegida</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatKwanza(finalPrice)}
                  </span>
                  {product.promotional_price && !selectedVariant && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatKwanza(product.price)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Impostos e taxa de retenção em Escrow incluídos.
                </p>
              </div>

              {/* Variants Selector */}
              {product.variants && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Selecione a Opção / Variante:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {v.name} ({formatKwanza(v.price)})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Angola Seller Score Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <Link href={`/store/${product.seller.store_slug}`} className="font-bold text-sm text-slate-900 dark:text-white hover:underline">
                      {product.seller.store_name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{product.province}, {product.municipality}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow">
                    <Award className="w-3.5 h-3.5" />
                    <span>{product.seller.score}/100</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Angola Seller Score: {product.seller.score_tier}
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    Stock Disponível: <strong className="text-slate-900 dark:text-white">{product.stock_quantity} unidades</strong>
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Adicionar ao Carrinho</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <span>Comprar Agora</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPechinchaModalOpen(true)}
                    className="w-full bg-amber-500 hover:bg-amber-650 text-slate-950 font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                    <span>💬 Pechinchar (IA) — Negociar Desconto</span>
                  </button>
                </div>

                {addedToast && (
                  <div className="p-3 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center animate-fade-in shadow-md">
                    ✓ Produto adicionado ao carrinho com sucesso!
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Guarantee Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600" /> Entrega Rápida em {product.province}
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Escrow Protegido MCX
              </span>
            </div>
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Descrição do Produto</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </main>

      {pechinchaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] animate-scale-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Pechinchar IA</h3>
                  <p className="text-[10px] text-slate-500">{product.seller.store_name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPechinchaModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[45vh] bg-slate-50 dark:bg-slate-950/40 text-xs">
              {pechinchaMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Price reference info */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-850/60 border-t border-slate-200/10 text-[10px] text-slate-500 flex justify-between">
              <span>Preço Original: <strong>{formatKwanza(finalPrice)}</strong></span>
              {negotiatedPrice && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Preço Acordado: {formatKwanza(negotiatedPrice)}
                </span>
              )}
            </div>

            {/* Footer Form */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl">
              {bargainCompleted ? (
                <button
                  type="button"
                  onClick={handleAddNegotiatedToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 animate-pulse"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Adicionar com Desconto ({formatKwanza(negotiatedPrice!)})</span>
                </button>
              ) : (
                <form onSubmit={handleSendOffer} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={offerInput}
                    onChange={(e) => setOfferInput(e.target.value)}
                    placeholder="Escreva a sua oferta (ex: 850000)"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow"
                  >
                    Propor
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
