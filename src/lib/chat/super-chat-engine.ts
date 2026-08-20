import { GroqAIService } from '@/lib/ai/groq-service';
import { MOCK_PRODUCTS, Product, formatKwanza } from '@/lib/mock-data';
import { LogisticsEngine } from '@/lib/logistics/delivery-engine';

export interface SuperChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'seller' | 'support' | 'super_ai';
  text: string;
  timestamp: string;
  isBlocked?: boolean;
  actionCard?: {
    type: 'product_recommendation' | 'payment_reference' | 'tracking_timeline' | 'golden_key_checkout';
    data: any;
  };
}

export class SuperChatEngine {
  /**
   * CHAVE DE OURO: Direct 1-Click Golden Checkout inside Chat
   */
  static generateGoldenKeyCheckout(product: Product): SuperChatMessage {
    const orderNumber = `ORD-GOLD-${Math.floor(100000 + Math.random() * 900000)}`;
    const originalPrice = product.promotional_price || product.price;
    const goldenDiscountKz = Math.round(originalPrice * 0.10); // 10% Gold Discount
    const finalTotalKz = originalPrice - goldenDiscountKz + 3500;
    const pin = LogisticsEngine.generateDeliveryPin();

    return {
      id: `gold-${Date.now()}`,
      conversationId: 'conv-1',
      senderId: 'golden-key-bot',
      senderName: '🔑 CHAVE DE OURO — CHECKOUT VIP IN-CHAT',
      senderRole: 'super_ai',
      text: `🏆 CHAVE DE OURO ATIVADA! O seu pedido VIP #${orderNumber} foi criado diretamente no Chat com 10% de Desconto Ouro e Retenção Escrow.`,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      actionCard: {
        type: 'golden_key_checkout',
        data: {
          orderNumber,
          productTitle: product.title,
          originalPriceKz: originalPrice,
          goldenDiscountKz,
          finalTotalKz,
          mcxEntity: '00124',
          mcxReference: `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
          deliveryPin: pin,
          courier: 'KargaGO Express (www.kargago.com)'
        }
      }
    };
  }

  static async processCommand(input: string, conversationId: string): Promise<SuperChatMessage | null> {
    const trimmed = input.trim();
    const timestamp = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });

    // Golden Key Trigger
    if (trimmed.toLowerCase().includes('/ouro') || trimmed.toLowerCase().includes('chave de ouro') || trimmed.toLowerCase().includes('/gold')) {
      return this.generateGoldenKeyCheckout(MOCK_PRODUCTS[0]);
    }

    if (trimmed.toLowerCase().startsWith('/pesquisar') || trimmed.toLowerCase().startsWith('/buscar')) {
      const query = trimmed.replace(/\/pesquisar|\/buscar/gi, '').trim();
      const res = await GroqAIService.processShoppingQuery(query || 'telemóveis');
      const topProduct = res.recommendedProducts[0] || MOCK_PRODUCTS[0];

      return {
        id: `super-${Date.now()}`,
        conversationId,
        senderId: 'super-ai-bot',
        senderName: '⚡ SUPER CHAT AI ASSISTANT',
        senderRole: 'super_ai',
        text: `🔍 Pesquisa SUPER CHAT para "${query || 'produtos'}": Encontrei o produto ideal disponível com retenção Escrow.`,
        timestamp,
        actionCard: {
          type: 'product_recommendation',
          data: topProduct
        }
      };
    }

    if (trimmed.toLowerCase().startsWith('/rastrear') || trimmed.toLowerCase().startsWith('/track')) {
      const code = trimmed.replace(/\/rastrear|\/track/gi, '').trim() || 'AO-DEL-948120';
      const trackingData = LogisticsEngine.getTrackingInfo(code);

      return {
        id: `super-${Date.now()}`,
        conversationId,
        senderId: 'super-ai-bot',
        senderName: '⚡ SUPER CHAT LOGÍSTICA',
        senderRole: 'super_ai',
        text: `🚚 Estado da Entrega KargaGO para o código ${code}:`,
        timestamp,
        actionCard: {
          type: 'tracking_timeline',
          data: trackingData
        }
      };
    }

    if (trimmed.toLowerCase().startsWith('/pagar') || trimmed.toLowerCase().startsWith('/mcx')) {
      return {
        id: `super-${Date.now()}`,
        conversationId,
        senderId: 'super-ai-bot',
        senderName: '⚡ SUPER CHAT FINANCE',
        senderRole: 'super_ai',
        text: '💳 Dados para Pagamento Multicaixa Express (MCX) gerados no SUPER CHAT:',
        timestamp,
        actionCard: {
          type: 'payment_reference',
          data: {
            entity: '00124',
            reference: '849 201 104',
            amountKz: 1250000,
            status: 'Aguardando Pagamento em Escrow'
          }
        }
      };
    }

    return null;
  }
}
