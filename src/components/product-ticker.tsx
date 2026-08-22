'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export function ProductTicker() {
  // Combine multiple copies of products to ensure the scrolling list is long enough for an infinite scroll effect
  const tickerProducts = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS, ...MOCK_PRODUCTS];

  return (
    <div className="w-full bg-white dark:bg-[#0f1524] border-y border-slate-200 dark:border-slate-800/80 py-3.5 overflow-hidden relative group">
      {/* CSS for infinite marquee scrolling and hover effects */}
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .ticker-container {
          display: flex;
          width: max-content;
          animation: ticker-scroll 35s linear infinite;
        }
        .ticker-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ticker title or badge */}
      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Ofertas em Tempo Real • Angola Market Tape</span>
        </div>
        <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Sem Filtros, Sem Fronteiras
        </span>
      </div>

      {/* Sliding Marquee Track */}
      <div className="relative flex overflow-hidden">
        {/* Gradient overlays to fade out content at the edges */}
        <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#0f1524] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#0f1524] to-transparent z-10 pointer-events-none" />

        <div className="ticker-container py-1.5">
          {tickerProducts.map((prod, index) => {
            const displayPrice = prod.promotional_price || prod.price;
            return (
              <Link
                key={`${prod.id}-${index}`}
                href={`/product/${prod.slug}`}
                className="flex items-center gap-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-2xl px-4 py-2 mx-2.5 transition-all duration-200 hover:shadow-md shrink-0 hover:-translate-y-0.5"
              >
                {/* Product Thumbnail */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-950 shrink-0">
                  <Image
                    src={prod.images[0]}
                    alt={prod.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                {/* Product Title and Price Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 max-w-[150px] truncate">
                      {prod.title}
                    </span>
                    {prod.is_verified_seller && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatKwanza(displayPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">
                      {prod.province}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
