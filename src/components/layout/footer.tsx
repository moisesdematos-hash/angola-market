import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Headphones, Store } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Value Proposition Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pagamento Protegido</h4>
              <p className="text-xs text-slate-400">O vendedor só recebe após confirmação de entrega.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Entregas em Angola</h4>
              <p className="text-xs text-slate-400">Cobertura em Luanda, Benguela, Huambo e províncias.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Multicaixa & IBAN</h4>
              <p className="text-xs text-slate-400">Pagamento fácil via MCX Express ou transferência.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Apoio ao Cliente</h4>
              <p className="text-xs text-slate-400">Suporte em português para resolução de disputas.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg">
                AM
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ANGOLA<span className="text-emerald-400">MARKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              &quot;Compre de milhares de vendedores. Sem fronteiras, sem complicação.&quot; A maior plataforma e-commerce de marketplace integrada em Angola.
            </p>
            <div className="pt-2">
              <Link
                href="/seller"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>Criar a sua Loja Online</span>
              </Link>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Comprar</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop" className="hover:text-emerald-400 transition-colors">Todos os Produtos</Link></li>
              <li><Link href="/category/telemoveis" className="hover:text-emerald-400 transition-colors">Telemóveis & Gadgets</Link></li>
              <li><Link href="/category/computadores" className="hover:text-emerald-400 transition-colors">Computadores & Portáteis</Link></li>
              <li><Link href="/category/eletrodomesticos" className="hover:text-emerald-400 transition-colors">Eletrodomésticos</Link></li>
              <li><Link href="/track" className="hover:text-emerald-400 transition-colors">Rastreamento de Encomendas</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Vendedores</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/seller" className="hover:text-emerald-400 transition-colors">Seller Center</Link></li>
              <li><Link href="/seller/products" className="hover:text-emerald-400 transition-colors">Publicar Produtos com IA</Link></li>
              <li><Link href="/seller/settings" className="hover:text-emerald-400 transition-colors">Angola Seller Score</Link></li>
              <li><Link href="/seller/ads" className="hover:text-emerald-400 transition-colors">Promover Anúncios</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-3">Ajuda & Legal</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/support" className="hover:text-emerald-400 transition-colors">Centro de Suporte</Link></li>
              <li><Link href="/disputes" className="hover:text-emerald-400 transition-colors">Resolução de Disputas</Link></li>
              <li><Link href="/returns" className="hover:text-emerald-400 transition-colors">Política de Devolução</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Termos de Serviço</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 ANGOLA MARKET. Todos os direitos reservados. Plataforma de Comércio Digital para Angola.</p>
          <div className="flex gap-4">
            <span>Luanda</span>
            <span>•</span>
            <span>Benguela</span>
            <span>•</span>
            <span>Huambo</span>
            <span>•</span>
            <span>Cabinda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
