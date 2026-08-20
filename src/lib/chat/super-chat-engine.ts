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
    type: 'product_recommendation' | 'payment_reference' | 'tracking_timeline' | 'voice_note';
    data: any;
  };
}

export class SuperChatEngine {
  /**
   * Processes Super Chat Slash Commands & AI Assistant Queries
   * Commands: /pesquisar, /rastrear, /ajuda, /comprar, /vender
   */
  static async processCommand(input: string, conversationId: string): Promise<SuperChatMessage | null> {
    const trimmed = input.trim();
    const timestamp = new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });

    // 1. /pesquisar [termo]
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

    // 2. /rastrear [codigo]
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

    // 3. /pagar ou /mcx
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

    // 4. Natural AI query fallback inside Super Chat
    if (trimmed.toLowerCase().includes('ajuda') || trimmed.toLowerCase().includes('como') || trimmed.length > 15) {
      const res = await GroqAIService.processShoppingQuery(trimmed);
      return {
        id: `super-${Date.now()}`,
        conversationId,
        senderId: 'super-ai-bot',
        senderName: '⚡ SUPER CHAT AI ASSISTANT',
        senderRole: 'super_ai',
        text: `🤖 ${res.message}`,
        timestamp
      };
    }

    return null;
  }
}
