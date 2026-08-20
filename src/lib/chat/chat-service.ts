export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'seller' | 'support';
  text: string;
  attachmentUrl?: string;
  timestamp: string;
  isBlocked?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  participantName: string;
  participantRole: 'seller' | 'support' | 'customer';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export class ChatService {
  /**
   * Anti-circumvention safety filter (impedir que o chat seja usado para contornar a plataforma)
   * Blocks phone numbers, IBANs, or external payment bypass phrases to protect Escrow safety.
   */
  static sanitizeChatMessage(text: string): { safeText: string; isBlocked: boolean; warningMsg?: string } {
    // Regex matching phone numbers, IBANs, or external contact requests
    const phonePattern = /(\+?244\s*9\d{8}|\b9\d{8}\b)/gi;
    const ibanPattern = /AO\d{21}/gi;
    const bypassPhrases = /(paga por fora|chama no whatsapp|transfere direto|fora do mercado|sem taxa)/gi;

    let isBlocked = false;
    let warningMsg = '';

    if (phonePattern.test(text) || ibanPattern.test(text) || bypassPhrases.test(text)) {
      isBlocked = true;
      warningMsg = ' ⚠️ Mensagem filtrada por motivos de segurança: Contactos diretos ou pagamentos fora do ANGOLA MARKET não são permitidos para proteger a retenção Escrow.';
    }

    const safeText = text
      .replace(phonePattern, '[CONTACTO OCULTO PELA SEGURANÇA]')
      .replace(ibanPattern, '[IBAN OCULTO]');

    return { safeText, isBlocked, warningMsg };
  }

  static getInitialConversations(): ChatConversation[] {
    return [
      {
        id: 'conv-1',
        title: 'Dúvida sobre iPhone 15 Pro Max',
        participantName: 'Luanda Tech Center',
        participantRole: 'seller',
        lastMessage: 'Olá! Sim, temos o produto disponível para entrega imediata em Talatona.',
        lastMessageTime: '14:20',
        unreadCount: 1,
        isOnline: true
      },
      {
        id: 'conv-2',
        title: 'Suporte — Ajuda com Pedido #ORD-AO-849201',
        participantName: 'Suporte ANGOLA MARKET',
        participantRole: 'support',
        lastMessage: 'O seu pagamento em Escrow foi confirmado. O estafeta está a caminho.',
        lastMessageTime: '12:05',
        unreadCount: 0,
        isOnline: true
      },
      {
        id: 'conv-3',
        title: 'Benguela Electro — Frigorífico LG',
        participantName: 'Benguela Electro',
        participantRole: 'seller',
        lastMessage: 'A garantia oficial de 2 anos acompanha a fatura com NIF.',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
        isOnline: false
      }
    ];
  }

  static getInitialMessages(conversationId: string): ChatMessage[] {
    if (conversationId === 'conv-1') {
      return [
        {
          id: 'm1',
          conversationId: 'conv-1',
          senderId: 'user-1',
          senderName: 'Manuel Domingos',
          senderRole: 'customer',
          text: 'Boa tarde! O iPhone 15 Pro Max está selado na caixa original?',
          timestamp: '14:15'
        },
        {
          id: 'm2',
          conversationId: 'conv-1',
          senderId: 'seller-1',
          senderName: 'Luanda Tech Center',
          senderRole: 'seller',
          text: 'Olá! Sim, temos o produto disponível selado para entrega imediata em Talatona.',
          timestamp: '14:20'
        }
      ];
    }

    return [
      {
        id: 'm3',
        conversationId: 'conv-2',
        senderId: 'support-1',
        senderName: 'Suporte ANGOLA MARKET',
        senderRole: 'support',
        text: 'Bem-vindo ao Suporte Oficial do ANGOLA MARKET. Como podemos ajudar?',
        timestamp: '12:00'
      },
      {
        id: 'm4',
        conversationId: 'conv-2',
        senderId: 'user-1',
        senderName: 'Manuel Domingos',
        senderRole: 'customer',
        text: 'Gostaria de confirmar a hora estimada da entrega do meu pedido #ORD-AO-849201.',
        timestamp: '12:03'
      },
      {
        id: 'm5',
        conversationId: 'conv-2',
        senderId: 'support-1',
        senderName: 'Suporte ANGOLA MARKET',
        senderRole: 'support',
        text: 'O seu pagamento em Escrow foi confirmado. O estafeta KargaGO está a caminho com o seu código PIN.',
        timestamp: '12:05'
      }
    ];
  }
}
