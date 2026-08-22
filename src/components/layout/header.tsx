'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Sparkles,
  MapPin,
  Store,
  Menu,
  X,
  ChevronDown,
  LogIn,
  Bell,
  ShieldCheck,
  Zap,
  LogOut,
  Settings,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/context/cart-context';
import { ANGOLA_PROVINCES } from '@/lib/constants/angola-data';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/categories';
import { PushNotificationService, PushNotificationPayload } from '@/lib/notifications/push-service';
import { createClient } from '@/lib/supabase/client';

export function Header({ onOpenAIShopping }: { onOpenAIShopping?: () => void }) {
  const router = useRouter();
  const { totalItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  // Cart animation states
  const [animateCart, setAnimateCart] = useState(false);
  const prevCountRef = useRef(totalItemsCount);

  useEffect(() => {
    if (totalItemsCount !== prevCountRef.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      prevCountRef.current = totalItemsCount;
      return () => clearTimeout(timer);
    }
  }, [totalItemsCount]);
  const [selectedProvince, setSelectedProvince] = useState('Luanda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Auth States
  const [sessionUser, setSessionUser] = useState<{
    name: string;
    email: string;
    avatarInitials: string;
  } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState<PushNotificationPayload[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Auto-close Category Dropdown after 5 seconds if left unattended
  useEffect(() => {
    if (categoryDropdownOpen) {
      const timer = setTimeout(() => {
        setCategoryDropdownOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [categoryDropdownOpen]);

  useEffect(() => {
    // Check Supabase active session
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilizador';
          const initials = fullName
            .split(' ')
            .map((n: string) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

          setSessionUser({
            name: fullName,
            email: user.email || '',
            avatarInitials: initials
          });
        }
      } catch (err) {
        console.error('Error fetching session in header:', err);
      }
    };

    checkSession();
    setNotifications(PushNotificationService.getInitialNotifications());
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await PushNotificationService.requestPermission();
    setHasPermission(granted);
    if (granted) {
      PushNotificationService.sendNativeNotification(
        '🔔 Alertas Activos!',
        'ANGOLA MARKET enviará actualizações em tempo real das suas compras e vendas.'
      );
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSessionUser(null);
    setProfileDropdownOpen(false);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}&province=${selectedProvince}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131924]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner for Sellers & Quick Auth */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
              Mercado Nacional
            </span>
            <span className="hidden sm:inline">Compre de milhares de vendedores em todas as 18 províncias.</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 font-medium">
            <Link href="/seller" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Vender no ANGOLA MARKET</span>
            </Link>
            <span className="text-emerald-500">|</span>
            <Link href="/track" className="hover:text-white transition-colors">
              Rastrear Pedido
            </Link>
            <span className="text-emerald-500">|</span>
            <Link href="/developer" className="hover:text-white transition-colors">
              Developer API
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                AM
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                  ANGOLA<span className="text-emerald-600 dark:text-emerald-400">MARKET</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                  Compre de milhares de vendedores
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar & AI Shopping Trigger */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4 items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              {/* Province Location Filter */}
              <div className="flex items-center gap-1 px-3 border-r border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs cursor-pointer py-2 pr-1"
                >
                  {ANGOLA_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por telemóveis, geradores, moda, frigoríficos..."
                className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 flex items-center justify-center transition-colors"
                aria-label="Pesquisar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* AI Assistant Trigger Button */}
            <button
              onClick={onOpenAIShopping}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all hover:scale-105 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>IA de Compras</span>
            </button>
          </div>

          {/* Action Tools: Theme, Push Notifications, Account Dropdown, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenAIShopping}
              className="lg:hidden p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">IA</span>
            </button>

            <ThemeToggle />

            {/* Notification Bell Panel */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-500 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>Notificações ({unreadCount})</span>
                    <button onClick={markAllRead} className="text-[10px] text-emerald-600 font-extrabold hover:underline">
                      Marcar lidas
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-amber-500/5' : ''}`}>
                        <div className="flex justify-between font-bold">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">{n.body}</p>
                      </div>
                    ))}
                  </div>

                  {!hasPermission && (
                    <div className="p-2.5 bg-slate-900 text-slate-300 text-[10px] text-center border-t border-slate-800">
                      <button
                        onClick={handleRequestPermission}
                        className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg w-full flex items-center justify-center gap-1 hover:bg-amber-400 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-slate-950" />
                        <span>Activar Alertas no Telemóvel/PC</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown or prominent Login button */}
            {sessionUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/45 px-3 py-1.5 rounded-xl border border-emerald-250 dark:border-emerald-900/50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-inner">
                    {sessionUser.avatarInitials}
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 hidden sm:inline truncate max-w-[90px]">
                    {sessionUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-550 dark:text-slate-400 shrink-0" />
                </button>

                {/* Profile menu dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="font-extrabold text-slate-900 dark:text-white block truncate">{sessionUser.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{sessionUser.email}</span>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold transition-all"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>A Minha Conta</span>
                    </Link>

                    <Link
                      href="/seller"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold transition-all"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>Central do Vendedor</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold transition-all"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Painel de Admin</span>
                    </Link>

                    <Link
                      href="/developer"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Developer API</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-all"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Terminar Sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-650 hover:text-white dark:hover:bg-emerald-600 text-slate-900 dark:text-slate-100 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                  <span>Entrar</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-sm"
                >
                  <Store className="w-4 h-4 text-slate-950" />
                  <span>Registar / Criar Loja</span>
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className={`relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                animateCart ? 'scale-125 rotate-12 text-emerald-600 dark:text-emerald-400' : ''
              }`}
              aria-label="Carrinho"
            >
              <ShoppingCart className={`w-6 h-6 text-slate-800 dark:text-slate-100 transition-colors ${
                animateCart ? 'text-emerald-600 dark:text-emerald-400' : ''
              }`} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearch} className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que procura em Angola?"
              className="w-full px-3 py-2 text-sm bg-transparent outline-none text-slate-900 dark:text-white"
            />
            <button type="submit" className="bg-emerald-650 text-white px-4 py-2 bg-emerald-600">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Categories Bar Navigation */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="relative">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span>Todas as Categorias</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2">
                {MARKETPLACE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {MARKETPLACE_CATEGORIES.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/shop" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Ofertas do Dia
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131924] p-4 space-y-4 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">Categorias Principais</span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {MARKETPLACE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-emerald-50"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {sessionUser ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>A Minha Conta ({sessionUser.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-red-500 font-bold py-2.5 rounded-xl text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminar Sessão</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar / Criar Conta</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-sm"
                >
                  <Store className="w-4 h-4" />
                  <span>Registar / Vender no ANGOLA MARKET</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
