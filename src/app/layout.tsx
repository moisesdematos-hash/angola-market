import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';

export const metadata: Metadata = {
  title: 'ANGOLA MARKET — O marketplace onde Angola compra, vende e cresce',
  description: 'Compre de milhares de vendedores em Angola. Sem fronteiras, sem complicação. Eletrónicos, telemóveis, computadores, moda, casa e eletrodomésticos com pagamento protegido Multicaixa Express e entregas rastreáveis.',
  keywords: ['Angola Market', 'Marketplace Angola', 'E-commerce Angola', 'Comprar em Luanda', 'Multicaixa Express', 'Vendas online Angola'],
  openGraph: {
    title: 'ANGOLA MARKET — Compre de milhares de vendedores em Angola',
    description: 'Sem fronteiras, sem complicação. Pagamento seguro com Escrow e entrega garantida.',
    url: 'https://angolamarket.ao',
    siteName: 'ANGOLA MARKET',
    locale: 'pt_AO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
