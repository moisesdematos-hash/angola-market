export type PaymentMethodType = 'mcx' | 'bank_transfer' | 'paypay';

export type EscrowStatus = 'pending' | 'escrow_locked' | 'released' | 'refunded' | 'failed';

export interface PaymentRequest {
  orderId: string;
  amountKz: number;
  method: PaymentMethodType;
  customerPhone?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: EscrowStatus;
  paymentDetails: {
    mcxReference?: string;
    mcxEntity?: string;
    iban?: string;
    bankName?: string;
    instructions: string;
  };
  timestamp: string;
}

export class PaymentAdapter {
  static async processPayment(req: PaymentRequest): Promise<PaymentResult> {
    const transactionId = `TX-AO-${Math.floor(100000 + Math.random() * 900000)}`;

    if (req.method === 'mcx') {
      const refNumber = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
      return {
        success: true,
        transactionId,
        status: 'pending',
        paymentDetails: {
          mcxEntity: '00124',
          mcxReference: refNumber,
          instructions: `Efetue o pagamento na sua aplicação Multicaixa Express ou no Caixa Eletrónico usando a Entidade 00124 e a Referência ${refNumber}.`
        },
        timestamp: new Date().toISOString()
      };
    }

    if (req.method === 'bank_transfer') {
      return {
        success: true,
        transactionId,
        status: 'pending',
        paymentDetails: {
          iban: process.env.BANK_TRANSFER_IBAN || 'AO06.0040.0000.1234.5678.1014.1',
          bankName: process.env.BANK_NAME || 'Banco Angolano de Investimentos (BAI)',
          instructions: 'Efetue a transferência para o IBAN fornecido e submeta o comprovativo para validação instantânea.'
        },
        timestamp: new Date().toISOString()
      };
    }

    // PayPay Angola
    const paypayRef = `PP-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      transactionId,
      status: 'pending',
      paymentDetails: {
        mcxReference: paypayRef,
        instructions: `Efetue o pagamento através da aplicação PayPay Angola inserindo o código de pagamento ${paypayRef} ou enviando para o telemóvel +244 923 111 222.`
      },
      timestamp: new Date().toISOString()
    };
  }

  static verifyEscrowRelease(orderId: string, isCustomerConfirmed: boolean): { canRelease: boolean; status: EscrowStatus } {
    if (isCustomerConfirmed) {
      return { canRelease: true, status: 'released' };
    }
    return { canRelease: false, status: 'escrow_locked' };
  }
}
