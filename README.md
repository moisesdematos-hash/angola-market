# 🇦🇴 ANGOLA MARKET — Marketplace E-Commerce Platform

> "Compre de milhares de vendedores. Sem fronteiras, sem complicação."

ANGOLA MARKET é uma plataforma completa de marketplace digital e e-commerce para Angola, inspirada nos melhores conceitos de marketplaces globais e perfeitamente adaptada à realidade do comércio nacional angolano.

A plataforma opera num modelo de **Zero-Stock (Estoque do Vendedor)**:
`CLIENTE → ANGOLA MARKET → VENDEDOR → LOGÍSTICA → CLIENTE`

---

## 🚀 Funcionalidades Principais

- **Landing Page & Pesquisa Inteligente**: Hero interativo com pesquisa direta por províncias, filtros por localização (Luanda, Benguela, Huambo, Cabinda, etc.) e ofertas do dia.
- **Modo Claro / Escuro (Light & Dark Mode)**: Sistema de temas adaptativo com `next-themes` e tokens Tailwind CSS v4 para ecrãs OLED em mobile e desktop.
- **ANGOLA AI SHOPPING ASSISTANT**: Assistente virtual integrado com Groq API (Llama 3 70B) para interpretação de orçamentos e intenção em português de Angola sem alucinação de catálogo.
- **AI SELLER COPILOT**: Ferramenta de inteligência artificial para apoio a vendedores na geração de títulos, descrições profissionais, tags e SEO.
- **Angola Seller Score (0-100)**: Algoritmo de classificação de reputação de vendedores baseado em avaliações, tempo de resposta, devoluções e taxa de cumprimento.
- **Pagamentos Protegidos (Escrow)**: Suporte a Multicaixa Express (MCX) com geração instantânea de entidade e referência, transferência bancária (IBAN) e Pagamento na Entrega (COD), com fundos retidos até confirmação por PIN.
- **Logística Integrada & Track Order**: Rastreamento de entregas com cronograma em tempo real, estafetas independentes e confirmação por PIN.
- **Faturas e Recibos Digitais**: Emissão de faturas/recibos em PDF com NIF para conformidade fiscal.
- **Painel Administrativo & Moderador**: Gestão de GMV, receitas, aprovação de documentos NIF de vendedores e mediação de disputas no Resolution Center.

---

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS v4, `next-themes`, Lucide React Icons.
- **Backend & APIs**: Next.js Server Actions & API Routes (REST/JSON).
- **Banco de Dados & Auth**: Supabase (PostgreSQL schema com Row Level Security - RLS, Supabase Auth com suporte a convidado e sessões persistentes).
- **IA**: Groq API (`llama-3.3-70b-versatile`).
- **Deploy**: Preparado para Vercel.

---

## ⚡ Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local

# 3. Executar o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.
