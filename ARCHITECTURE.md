# 🏗️ ANGOLA MARKET — System Architecture Documentation

## Overview
ANGOLA MARKET is architected as a modular, scalable e-commerce infrastructure designed for high concurrency and local network resiliency in Angola.

```text
[ Client Browser / PWA ] 
          │
          ├──> [ Next.js App Router (React 19) ]
          │          │
          │          ├──> ThemeProvider (next-themes: Light/Dark)
          │          ├──> CartProvider (Multi-seller split state)
          │          └──> GroqAIService (Server-side AI Adapter)
          │
          ├──> [ Payment Adapter Layer ]
          │          ├──> Multicaixa Express (MCX) Generator
          │          ├──> IBAN Transfer Validator
          │          └──> Escrow State Machine
          │
          └──> [ Supabase Cloud ]
                     ├──> PostgreSQL Database (35+ Tables)
                     ├──> Row Level Security (RLS Policies)
                     ├──> Auth (Email/Google/Guest)
                     └──> Storage Buckets (product-images, seller-documents)
```

## Modular Components
1. **Catalog Module**: Products, categories, variants, inventory movements.
2. **Escrow & Payment Module**: Holds funds safely during shipping.
3. **Logistics Engine**: Tracking codes, PIN validation, courier assignment.
4. **AI Engine**: Groq API Llama 3 70B for shopping assistant & seller copilot.
5. **Reputation Engine**: Angola Seller Score (0-100).
