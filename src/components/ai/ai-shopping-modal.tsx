'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, X, Send, ShoppingCart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GroqAIService, ShoppingAssistantResponse } from '@/lib/ai/groq-service';
import { formatKwanza } from '@/lib/mock-data';
import { useCart } from '@/context/cart-context';

export function AIShoppingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addToCart } = useCart();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<ShoppingAssistantResponse | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setLoading(true);
    try {
      const res = await GroqAIService.processShoppingQuery(inputQuery);
      setAiResponse(res);
    } catch {
      // Handled internally by service fallback
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputQuery(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-4 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-none">ANGOLA AI SHOPPING ASSISTANT</h3>
              <p className="text-xs font-semibold text-slate-950/80 mt-0.5">
                Diga o que procura e a IA encontrará os produtos reais disponíveis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 text-slate-950 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick prompt suggestions */}
          {!aiResponse && !loading && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-slate-400">Sugestões Rápidas:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickPrompt('Quero um telefone até 250 mil kwanzas para tirar boas fotografias')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium transition-all"
                >
                  📱 &quot;Quero um telefone até 250 mil kwanzas para fotos&quot;
                </button>

                <button
                  onClick={() => handleQuickPrompt('Preciso de um MacBook ou portátil rápido para trabalho')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium transition-all"
                >
                  💻 &quot;Preciso de um MacBook ou portátil rápido&quot;
                </button>

                <button
                  onClick={() => handleQuickPrompt('Mostra-me geradores a gasolina com entrega em Luanda')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium transition-all"
                >
                  ⚡ &quot;Mostra-me geradores com entrega em Luanda&quot;
                </button>

                <button
                  onClick={() => handleQuickPrompt('Sapatilhas Nike originais tamanho 42')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium transition-all"
                >
                  👟 &quot;Sapatilhas Nike originais tamanho 42&quot;
                </button>
              </div>
            </div>
          )}

          {/* AI Response Display */}
          {aiResponse && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed">
                🤖 {aiResponse.message}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">
                  Produtos Recomendados do Catálogo:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiResponse.recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 bg-white dark:bg-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                          <Image
                            src={prod.images[0]}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                          {prod.is_verified_seller && (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <ShieldCheck className="w-3 h-3" /> Verificado
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/product/${prod.slug}`}
                          onClick={onClose}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 line-clamp-2"
                        >
                          {prod.title}
                        </Link>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Vendido por: <span className="font-semibold text-slate-700 dark:text-slate-200">{prod.seller.store_name}</span> ({prod.province})
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatKwanza(prod.promotional_price || prod.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(prod)}
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Comprar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ex: Quero um frigorífico até 900 mil kwanzas..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              {loading ? (
                <span className="text-xs">A analisar...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Perguntar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
