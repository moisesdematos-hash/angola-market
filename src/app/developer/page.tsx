'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Terminal,
  Cpu,
  BookOpen,
  Key,
  Layers,
  CheckCircle2,
  Copy,
  ChevronRight,
  Play,
  FileCode,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';

// ─── API Endpoints Specification ───────────────────────────────────────────
const API_ENDPOINTS = [
  {
    id: 'checkout',
    title: '1. API de Checkout & Escrow',
    method: 'POST',
    path: '/api/v1/checkout/create-intent',
    description: 'Inicia um pagamento seguro em Escrow via Multicaixa Express ou IBAN a partir de qualquer site parceiro externo.',
    payload: `{
  "partner_id": "part_bfa_9482",
  "amount_kz": 75000,
  "currency": "AOA",
  "buyer_phone": "+244923000000",
  "callback_url": "https://loja-parceira.ao/webhook"
}`,
    response: `{
  "success": true,
  "payment_intent_id": "pi_gold_849201",
  "mcx_entity": "00124",
  "mcx_reference": "849 201 104",
  "amount_kz": 75000,
  "status": "awaiting_escrow_payment",
  "expires_in_hours": 24
}`
  },
  {
    id: 'shipping',
    title: '2. API de Frete e Prazos (Logística)',
    method: 'POST',
    path: '/api/v1/shipping/calculate',
    description: 'Calcula em tempo real a tarifa de entrega da KargaGO e o tempo estimado de trânsito entre quaisquer províncias de Angola.',
    payload: `{
  "origin_province": "Luanda",
  "destination_province": "Benguela",
  "weight_kg": 2.5,
  "dimensions": { "width": 20, "height": 15, "depth": 10 }
}`,
    response: `{
  "success": true,
  "shipping_fee_kz": 7500,
  "sla_hours": 12,
  "courier_partner": "KargaGO Van",
  "origin": "Luanda",
  "destination": "Benguela"
}`
  },
  {
    id: 'catalog',
    title: '3. API de Consulta de Catálogo',
    method: 'GET',
    path: '/api/v1/products/search?q=iphone&province=Luanda',
    description: 'Pesquisa e filtra artigos disponíveis no Angola Market para exibição em blogs, comparadores ou redes de afiliados.',
    payload: 'Query string: q, province, limit',
    response: `{
  "success": true,
  "results_count": 1,
  "products": [
    {
      "id": "prod-101",
      "title": "iPhone 15 Pro Max 256GB Selado",
      "price_kz": 1250000,
      "promotional_price_kz": 1125000,
      "store": "Luanda Tech Center",
      "province": "Luanda",
      "in_stock": true,
      "affiliate_link": "https://angolamarket.ao/product/iphone-15?ref=partner_id"
    }
  ]
}`
  }
];

export default function DeveloperPortal() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeEndpointId, setActiveEndpointId] = useState('checkout');
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python'>('curl');
  
  // Sandbox API Key Generator states
  const [sandboxKey, setSandboxKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [consoleResult, setConsoleResult] = useState<string | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState(false);

  const activeEndpoint = API_ENDPOINTS.find(e => e.id === activeEndpointId) || API_ENDPOINTS[0];

  const handleGenerateSandboxKey = () => {
    const key = `pk_sandbox_ao_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setSandboxKey(key);
  };

  const handleDownloadPlugin = () => {
    const fileContent = `<?php
/**
 * Plugin Name: WooCommerce Angola Market Secure Escrow Gateway
 * Description: Aceite pagamentos por referência Multicaixa Express e garanta retenção segura em Escrow no Angola Market.
 * Version: 1.0.0
 * Author: Angola Market Dev Team
 */
// API Endpoint Configuration: https://api.angolamarket.ao/v1/checkout
`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'angola-market-woocommerce.php';
    link.click();
    URL.revokeObjectURL(url);
    alert('📥 Download do plugin "angola-market-woocommerce.php" iniciado com sucesso!');
  };

  const handleCopyKey = () => {
    if (sandboxKey) {
      navigator.clipboard.writeText(sandboxKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleTryItLive = () => {
    setTestingEndpoint(true);
    setTimeout(() => {
      setConsoleResult(activeEndpoint.response);
      setTestingEndpoint(false);
    }, 800);
  };

  // Generate code snippet based on active lang & endpoint
  const getCodeSnippet = () => {
    const host = 'https://api.angolamarket.ao';
    const authHeader = `Authorization: Bearer ${sandboxKey || 'pk_sandbox_your_key_here'}`;

    if (activeLang === 'curl') {
      if (activeEndpoint.method === 'GET') {
        return `curl -X GET "${host}${activeEndpoint.path}" \\\n  -H "${authHeader}"`;
      }
      return `curl -X POST "${host}${activeEndpoint.path}" \\\n  -H "${authHeader}" \\\n  -H "Content-Type: application/json" \\\n  -d '${activeEndpoint.payload}'`;
    }

    if (activeLang === 'js') {
      if (activeEndpoint.method === 'GET') {
        return `fetch('${host}${activeEndpoint.path}', {
  headers: {
    'Authorization': 'Bearer ${sandboxKey || 'pk_sandbox_your_key_here'}'
  }
})
.then(response => response.json())
.then(data => console.log(data));`;
      }
      return `fetch('${host}${activeEndpoint.path}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${sandboxKey || 'pk_sandbox_your_key_here'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${activeEndpoint.payload})
})
.then(response => response.json())
.then(data => console.log(data));`;
    }

    // Python snippet
    if (activeEndpoint.method === 'GET') {
      return `import requests

url = "${host}${activeEndpoint.path}"
headers = {
    "Authorization": "Bearer ${sandboxKey || 'pk_sandbox_your_key_here'}"
}

response = requests.get(url, headers=headers)
print(response.json())`;
    }
    return `import requests
import json

url = "${host}${activeEndpoint.path}"
headers = {
    "Authorization": "Bearer ${sandboxKey || 'pk_sandbox_your_key_here'}",
    "Content-Type": "application/json"
}
payload = ${activeEndpoint.payload}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Portal do Programador</span>
        </div>

        {/* Portal Jumbotron Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl space-y-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Portal do Programador (Angola Market API)
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Integre o Angola Market no seu Negócio 🇦🇴💻
          </h1>
          <p className="text-sm text-slate-350 max-w-2xl leading-relaxed">
            Exponha o maior catálogo de produtos de Angola, aceite pagamentos via referência Multicaixa Express (MCX) e automatize as suas entregas com a KargaGO usando a nossa API Pública robusta.
          </p>

          {/* Quick Sandbox Key Generator */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateSandboxKey}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Gerar Chave Sandbox (Gratuito)</span>
            </button>
            <button
              onClick={handleDownloadPlugin}
              className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Plugin WooCommerce</span>
            </button>
          </div>

          {sandboxKey && (
            <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl text-xs flex items-center justify-between font-mono max-w-xl animate-fade-in">
              <span className="text-emerald-400 truncate mr-2">{sandboxKey}</span>
              <button
                onClick={handleCopyKey}
                className="text-slate-400 hover:text-white shrink-0 flex items-center gap-1 font-sans font-bold"
              >
                <Copy className="w-4 h-4" /> {copiedKey ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>

        {/* API Doc Reference & Interactive Playground Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Documentation list */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Referência dos Endpoints
            </h3>

            <div className="space-y-3">
              {API_ENDPOINTS.map((endpoint) => (
                <div
                  key={endpoint.id}
                  onClick={() => {
                    setActiveEndpointId(endpoint.id);
                    setConsoleResult(null);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                    activeEndpointId === endpoint.id
                      ? 'border-emerald-600 bg-white dark:bg-slate-900 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:border-slate-350'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      endpoint.method === 'POST' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-850 dark:text-slate-200">{endpoint.path}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{endpoint.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{endpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Code playground */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-500" /> API Playground / Consola de Testes
              </h3>
              
              {/* Language switcher tab */}
              <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold">
                {['curl', 'js', 'python'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang as any)}
                    className={`px-3 py-1 rounded-md transition-all uppercase ${
                      activeLang === lang ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lang === 'js' ? 'Fetch API' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Request Playground Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col h-[520px]">
              
              {/* Code Snippet Display */}
              <div className="bg-slate-950 p-4 border-b border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
                <span className="font-mono">Request URL</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px]">HTTPS</span>
              </div>

              <div className="flex-1 p-5 overflow-auto font-mono text-[11px] text-slate-300 bg-slate-950/80 leading-relaxed select-all">
                <pre>{getCodeSnippet()}</pre>
              </div>

              {/* Console Output Result */}
              {consoleResult && (
                <div className="border-t border-slate-800 bg-slate-950 p-4 max-h-48 overflow-y-auto">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest pb-2">Response JSON:</div>
                  <pre className="font-mono text-[10px] text-emerald-300 leading-tight">{consoleResult}</pre>
                </div>
              )}

              {/* Action play buttons */}
              <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {sandboxKey ? 'Sandbox Activo' : 'Crie uma chave Sandbox para testar'}
                </span>

                <button
                  onClick={handleTryItLive}
                  disabled={testingEndpoint}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 text-slate-950" />
                  <span>{testingEndpoint ? 'A carregar...' : 'Testar Requisição'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
