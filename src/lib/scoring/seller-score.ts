export interface SellerMetrics {
  ratingAvg: number; // 1.0 to 5.0
  fulfillmentRatePercentage: number; // 0 to 100
  returnRatePercentage: number; // 0 to 100
  responseTimeHours: number; // e.g. 0.5 to 48
  totalOrders: number;
}

export interface SellerScoreResult {
  score: number; // 0 to 100
  tier: 'Excelente' | 'Muito bom' | 'Bom' | 'Atenção' | 'Suspenso';
  badgeColor: string;
  breakdown: {
    ratingPoints: number;
    fulfillmentPoints: number;
    returnPoints: number;
    responsePoints: number;
  };
}

export function calculateAngolaSellerScore(metrics: SellerMetrics): SellerScoreResult {
  // 1. Rating points (max 40)
  const ratingPoints = Math.min(40, (metrics.ratingAvg / 5.0) * 40);

  // 2. Fulfillment points (max 30)
  const fulfillmentPoints = Math.min(30, (metrics.fulfillmentRatePercentage / 100.0) * 30);

  // 3. Return & dispute penalty points (max 20)
  const returnPenalty = (metrics.returnRatePercentage / 100.0) * 40;
  const returnPoints = Math.max(0, 20 - returnPenalty);

  // 4. Response time points (max 10)
  let responsePoints = 10;
  if (metrics.responseTimeHours > 24) {
    responsePoints = 2;
  } else if (metrics.responseTimeHours > 12) {
    responsePoints = 5;
  } else if (metrics.responseTimeHours > 4) {
    responsePoints = 8;
  }

  const rawScore = Math.round(ratingPoints + fulfillmentPoints + returnPoints + responsePoints);
  const score = Math.min(100, Math.max(0, rawScore));

  let tier: SellerScoreResult['tier'] = 'Excelente';
  let badgeColor = 'bg-emerald-600 text-white';

  if (score >= 95) {
    tier = 'Excelente';
    badgeColor = 'bg-emerald-600 text-white';
  } else if (score >= 85) {
    tier = 'Muito bom';
    badgeColor = 'bg-green-600 text-white';
  } else if (score >= 70) {
    tier = 'Bom';
    badgeColor = 'bg-blue-600 text-white';
  } else if (score >= 50) {
    tier = 'Atenção';
    badgeColor = 'bg-amber-600 text-white';
  } else {
    tier = 'Suspenso';
    badgeColor = 'bg-red-600 text-white';
  }

  return {
    score,
    tier,
    badgeColor,
    breakdown: {
      ratingPoints,
      fulfillmentPoints,
      returnPoints,
      responsePoints
    }
  };
}
