export interface LoyaltyProfile {
  userId: string;
  kwanzaBackBalanceKz: number;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  totalOrdersCompleted: number;
  referralCode: string;
  referralEarningsKz: number;
}

export class LoyaltyEngine {
  /**
   * Calculate Cashback earned for a completed order (e.g. 2% for Bronze, 5% for Diamante)
   */
  static calculateCashback(totalOrderKz: number, tier: LoyaltyProfile['tier']): number {
    const rate = tier === 'Diamante' ? 0.05 : tier === 'Ouro' ? 0.04 : tier === 'Prata' ? 0.03 : 0.02;
    return Math.round(totalOrderKz * rate);
  }

  /**
   * Determine Tier upgrade based on completed orders
   */
  static getTierFromOrders(totalOrders: number): LoyaltyProfile['tier'] {
    if (totalOrders >= 50) return 'Diamante';
    if (totalOrders >= 20) return 'Ouro';
    if (totalOrders >= 5) return 'Prata';
    return 'Bronze';
  }

  /**
   * Generate unique referral code for customer
   */
  static generateReferralCode(name: string): string {
    const cleanName = name.split(' ')[0].toUpperCase();
    const random = Math.floor(100 + Math.random() * 900);
    return `AM-${cleanName}-${random}`;
  }
}
