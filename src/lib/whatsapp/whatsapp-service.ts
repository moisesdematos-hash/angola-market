export interface WhatsAppMessagePayload {
  to: string; // Phone number e.g. +244923000000
  templateName: string;
  parameters: Record<string, string>;
}

export class WhatsAppService {
  private static API_URL = 'https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages';

  /**
   * Helper to format templates in Angolan Portuguese (AO)
   */
  static getMessageBody(templateName: string, parameters: Record<string, string>): string {
    const defaultParams = {
      buyerName: 'Cliente',
      sellerName: 'Vendedor',
      orderNumber: 'ORD-XXXXXX',
      totalKz: '0 Kz',
      mcxReference: '000 000 000',
      trackingCode: 'AO-DEL-XXXXXX',
      courier: 'KargaGO',
      ...parameters
    };

    switch (templateName) {
      case 'order_placed_buyer':
        return `🛒 *ANGOLA MARKET — Pedido Confirmado!*\n\nOlá, ${defaultParams.buyerName},\nO seu pedido *${defaultParams.orderNumber}* foi registado com sucesso com garantia de retenção Escrow.\n\n💰 *Total:* ${defaultParams.totalKz}\n💳 *Pagar via Multicaixa Express:* Entidade: *00124* | Ref: *${defaultParams.mcxReference}*\n\n🚚 *Logística:* ${defaultParams.courier}\n📦 *Rastreio:* [Acompanhar Pedido](https://angola-market-rho.vercel.app/track?code=${defaultParams.trackingCode})\n\nObrigado por comprar no ANGOLA MARKET! 🇦🇴`;

      case 'order_placed_seller':
        return `🏪 *ANGOLA MARKET — Nova Venda!*\n\nOlá, ${defaultParams.sellerName},\nA sua loja recebeu um novo pedido: *${defaultParams.orderNumber}*.\n\n📦 *Produto:* ${parameters.productTitle || 'Artigo do Catálogo'}\n💰 *Valor Líquido:* ${defaultParams.totalKz}\n\n⚠️ Por favor, prepare a encomenda e aguarde a recolha do estafeta KargaGO.\n\n[Aceder ao Seller Center](https://angola-market-rho.vercel.app/seller/products)`;

      case 'delivery_dispatched':
        return `🚚 *ANGOLA MARKET — Encomenda a Caminho!*\n\nOlá, ${defaultParams.buyerName},\nO estafeta KargaGO já recolheu o seu pedido *${defaultParams.orderNumber}*.\n\n📦 *Código de Rastreio:* ${defaultParams.trackingCode}\n🔑 *PIN de Segurança para Entrega:* ${parameters.deliveryPin || 'N/A'}\n\n⚠️ *Atenção:* Forneça este PIN ao estafeta apenas no momento em que receber e inspecionar o produto físico para libertar o pagamento em Escrow ao vendedor.`;

      default:
        return `📱 Notificação Oficial ANGOLA MARKET. Pedido: ${defaultParams.orderNumber}.`;
    }
  }

  /**
   * Sends or simulates sending a WhatsApp Message
   */
  static async sendWhatsAppNotification(to: string, templateName: string, parameters: Record<string, string>): Promise<{ success: boolean; messageId: string; body: string }> {
    const cleanPhone = to.replace(/[\s\-\+]/g, '');
    const body = this.getMessageBody(templateName, parameters);

    console.log(`[WhatsApp API Notification Sent to ${cleanPhone}]:`, body);

    // Mock API call to Meta WhatsApp Business API
    return {
      success: true,
      messageId: `wa-msg-${Date.now()}`,
      body
    };
  }
}
