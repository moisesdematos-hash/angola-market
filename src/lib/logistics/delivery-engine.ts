export interface TrackingDetails {
  trackingCode: string;
  orderId: string;
  status: 'pending_pickup' | 'picked_up' | 'in_transit' | 'delivered' | 'returned';
  courierName: string;
  courierPhone: string;
  vehicleType: string;
  estimatedDeliveryDate: string;
  pinVerificationCode: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    done: boolean;
  }[];
}

export class LogisticsEngine {
  static generateTrackingCode(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `AO-DEL-${randomNum}`;
  }

  static generateDeliveryPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static getTrackingInfo(trackingCode: string): TrackingDetails {
    const today = new Date().toISOString().split('T')[0];

    return {
      trackingCode,
      orderId: 'ORD-2026-9481',
      status: 'in_transit',
      courierName: 'Kiluange Silva (Angola Express Courier)',
      courierPhone: '+244 923 112 233',
      vehicleType: 'Motociclo Yamaha 125cc',
      estimatedDeliveryDate: today,
      pinVerificationCode: '8492',
      timeline: [
        {
          title: 'Pedido Confirmado',
          description: 'O pagamento foi verificado e retido com segurança pelo ANGOLA MARKET.',
          timestamp: 'Hoje, 09:15',
          done: true
        },
        {
          title: 'Preparado pelo Vendedor',
          description: 'A loja embalou e selou os seus produtos para recolha.',
          timestamp: 'Hoje, 10:30',
          done: true
        },
        {
          title: 'Recolhido pelo Estafeta',
          description: 'O estafeta Kiluange Silva iniciou o transporte a partir do centro de distribuição de Talatona.',
          timestamp: 'Hoje, 11:45',
          done: true
        },
        {
          title: 'Em Trânsito',
          description: 'O seu pacote está a caminho do endereço indicado.',
          timestamp: 'Hoje, 12:10',
          done: true
        },
        {
          title: 'Entregue',
          description: 'Confirmação final mediante apresentação do código PIN ao estafeta.',
          timestamp: 'Pendente',
          done: false
        }
      ]
    };
  }

  /**
   * Generates WhatsApp direct alert URL for Angolan mobile numbers
   */
  static buildWhatsAppAlertUrl(phone: string, trackingCode: string, orderNumber: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Olá! O seu pedido ${orderNumber} no ANGOLA MARKET já está em trânsito. Acompanhe a entrega com o código: ${trackingCode}. Dúvidas? Responda a esta mensagem.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }
}
