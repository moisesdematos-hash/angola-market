export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'sale' | 'delivery' | 'escrow' | 'loyalty';
  read: boolean;
}

export class PushNotificationService {
  /**
   * Request browser permission for native HTML5 Push Notifications
   */
  static async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('Push notifications not supported in this browser.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Triggers a native system push notification
   */
  static sendNativeNotification(title: string, body: string) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  }

  /**
   * Generates mock notifications list
   */
  static getInitialNotifications(): PushNotificationPayload[] {
    return [
      {
        id: 'n1',
        title: '🚚 Encomenda a Caminho',
        body: 'O seu pedido #ORD-AO-849201 já foi recolhido pelo estafeta KargaGO.',
        timestamp: 'Há 5 min',
        type: 'delivery',
        read: false
      },
      {
        id: 'n2',
        title: '💰 Cashback Creditado!',
        body: 'Ganhou 12.500 Kz de reembolso KwanzaBack na sua carteira.',
        timestamp: 'Há 1h',
        type: 'loyalty',
        read: false
      },
      {
        id: 'n3',
        title: '🔒 Pagamento Seguro Activo',
        body: 'O valor do pedido #ORD-AO-849201 está seguro em Escrow.',
        timestamp: 'Há 2h',
        type: 'escrow',
        read: true
      }
    ];
  }
}
