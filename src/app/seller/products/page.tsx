'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Sparkles, ShieldCheck, Trash2, Edit, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIShoppingModal } from '@/components/ai/ai-shopping-modal';
import { MOCK_PRODUCTS, formatKwanza } from '@/lib/mock-data';

const PRESET_IMAGES = [
  { name: 'Telemóvel', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80' },
  { name: 'Computador', url: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=300&auto=format&fit=crop&q=80' },
  { name: 'Eletrodomésticos', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&auto=format&fit=crop&q=80' },
  { name: 'Calçado', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80' },
  { name: 'Gerador/Energia', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80' },
  { name: 'Casa/Móveis', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&auto=format&fit=crop&q=80' }
];

export default function SellerProductsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [productList, setProductList] = useState(MOCK_PRODUCTS.slice(0, 4)); // Using 4 products from mock catalog initially

  // AI Seller Copilot states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brief, setBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<{
    title: string;
    description: string;
    recommendedPriceKz: number;
    suggestedCategory: string;
    tags: string[];
  } | null>(null);

  // Form edit states
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editProvince, setEditProvince] = useState('Luanda');
  const [editMunicipality, setEditMunicipality] = useState('Talatona');
  const [editImage, setEditImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80');
  const [imageMethod, setImageMethod] = useState<'upload' | 'presets' | 'url'>('presets');

  // Edit mode tracking state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const handleGenerate = async () => {
    if (!brief.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief })
      });
      const data = await res.json();
      if (data.success) {
        setEditTitle(data.title);
        setEditPrice(data.recommendedPriceKz || 150000);
        setEditCategory(data.suggestedCategory);
        setEditDescription(data.description);
        setCopilotResult({
          title: data.title,
          description: data.description,
          recommendedPriceKz: data.recommendedPriceKz,
          suggestedCategory: data.suggestedCategory,
          tags: data.tags || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (prod: any) => {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditPrice(prod.price);
    setEditCategory(prod.category);
    setEditDescription(prod.description);
    setEditProvince(prod.province || 'Luanda');
    setEditMunicipality(prod.municipality || 'Talatona');
    setEditImage(prod.images[0]);
    
    // Set mock copilot result to show the editing fields layout
    setCopilotResult({
      title: prod.title,
      description: prod.description,
      recommendedPriceKz: prod.price,
      suggestedCategory: prod.category,
      tags: []
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      // Edit Mode
      const updatedList = productList.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title: editTitle,
            price: editPrice,
            category: editCategory || 'Geral',
            description: editDescription,
            province: editProvince,
            municipality: editMunicipality,
            images: [editImage]
          };
        }
        return p;
      });
      setProductList(updatedList);
    } else {
      // Create Mode
      const newProduct = {
        id: `prod-${Date.now()}`,
        slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: editTitle,
        description: editDescription,
        price: editPrice,
        category: editCategory || 'Geral',
        images: [editImage],
        stock_quantity: 5,
        province: editProvince,
        municipality: editMunicipality,
        rating_avg: 5.0,
        reviews_count: 0,
        sales_count: 0,
        is_sponsored: false,
        is_verified_seller: true,
        seller: {
          id: 'store-1',
          store_name: 'Luanda Tech Center',
          store_slug: 'luanda-tech-center',
          verified: true,
          score: 98,
          score_tier: 'Excelente'
        },
        condition: 'novo' as const
      };
      setProductList([newProduct, ...productList]);
    }

    // Reset modal state variables
    setIsModalOpen(false);
    setBrief('');
    setCopilotResult(null);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header onOpenAIShopping={() => setAiModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/seller">Seller Center</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Meus Produtos & Anúncios</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Catálogo da Minha Loja</h1>
            <p className="text-xs text-slate-400">A gerir {productList.length} produtos ativos no ANGOLA MARKET.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-2xl transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Produto</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="space-y-3">
            {productList.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-900 overflow-hidden relative shrink-0">
                    <img src={prod.images[0]} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{prod.title}</h4>
                    <p className="text-xs text-slate-400">SKU: AO-PROD-841 • Stock: {prod.stock_quantity} unidades</p>
                    <div className="text-xs font-extrabold text-emerald-600 mt-0.5">{formatKwanza(prod.price)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(prod)}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductList(productList.filter((p) => p.id !== prod.id))}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Seller Copilot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>{editingProduct ? 'Modo de Edição Ativo' : 'AI Seller Copilot Ativo'}</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {editingProduct ? 'Editar Anúncio do Produto' : 'Criar Novo Anúncio Inteligente'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setBrief('');
                  setCopilotResult(null);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Step 1: AI Prompt Input */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                {editingProduct ? 'Reescrever/Melhorar Anúncio com IA (Opcional)' : 'O que quer vender? (Descreva em português de Angola)'}
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Ex: Ar condicionado samsung 12000 btu, usado 6 meses, em Luanda por 190 mil kwanzas. Sem riscos."
                rows={3}
                className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-emerald-500 dark:text-white"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isLoading || !brief.trim()}
                  onClick={handleGenerate}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      <span>Processando IA em Luanda...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Gerar com Copilot IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Editor (visible after generation) */}
            {copilotResult && (
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Título do Anúncio</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-bold dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Preço Recomendado (Kz)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Categoria</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>

                {/* Multi-method Image Uploader */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Imagem do Produto (Carregar de várias formas)</label>
                  
                  {/* Tabs for Image Selection Method */}
                  <div className="flex gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageMethod('upload')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        imageMethod === 'upload' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      📁 Upload Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMethod('presets')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        imageMethod === 'presets' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      🖼️ Galeria Rápida
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMethod('url')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        imageMethod === 'url' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      🔗 Link URL
                    </button>
                  </div>

                  {/* Render based on selected method */}
                  {imageMethod === 'upload' && (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Clique para carregar foto</p>
                          <p className="text-[10px] text-slate-400">PNG, JPG ou WEBP (Max 2MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {imageMethod === 'presets' && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((preset) => {
                        const isActive = editImage === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setEditImage(preset.url)}
                            className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              isActive ? 'border-emerald-650 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="object-cover w-full h-full" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/65 text-[8px] text-white py-0.5 text-center font-medium truncate">
                              {preset.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {imageMethod === 'url' && (
                    <input
                      type="text"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="Insira o link da imagem (https://...)"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2.5 text-xs dark:text-white"
                    />
                  )}

                  {/* Preview of active image */}
                  {editImage && (
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-205 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img src={editImage} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                          Pré-visualização ativa
                        </span>
                        <span className="text-[9px] text-slate-400 truncate max-w-[250px]">
                          {editImage.startsWith('data:') ? 'Imagem carregada localmente (Base64)' : editImage}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Província</label>
                    <select
                      value={editProvince}
                      onChange={(e) => setEditProvince(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs outline-none dark:text-white"
                    >
                      <option value="Luanda">Luanda</option>
                      <option value="Benguela">Benguela</option>
                      <option value="Huambo">Huambo</option>
                      <option value="Cabinda">Cabinda</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Município</label>
                    <input
                      type="text"
                      value={editMunicipality}
                      onChange={(e) => setEditMunicipality(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Descrição de Venda (Gerada pela IA)</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs leading-relaxed dark:text-white"
                  />
                </div>

                {/* Tags preview */}
                {copilotResult.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {copilotResult.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Save Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-150 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setBrief('');
                      setCopilotResult(null);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    {editingProduct ? 'Guardar Alterações' : 'Publicar Anúncio em Angola'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <AIShoppingModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
}
