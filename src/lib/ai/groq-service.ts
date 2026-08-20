import Groq from 'groq-sdk';
import { MOCK_PRODUCTS, Product } from '@/lib/mock-data';

export interface ShoppingAssistantResponse {
  message: string;
  recommendedProducts: Product[];
  parsedIntent: {
    category?: string;
    maxBudgetKz?: number;
    keywords?: string[];
  };
}

export class GroqAIService {
  private static getClient() {
    const apiKey = process.env.GROQ_API_KEY || 'gsk_mock';
    return new Groq({ apiKey, dangerouslyAllowBrowser: false });
  }

  /**
   * ANGOLA AI SHOPPING ASSISTANT
   * Reads customer intent (e.g. "Quero um telefone até 250 mil kwanzas para boas fotos")
   * and matches real products in catalog. DOES NOT INVENT PRODUCTS.
   */
  static async processShoppingQuery(query: string): Promise<ShoppingAssistantResponse> {
    const queryLower = query.toLowerCase();

    // Parse budget if present (e.g. 250 mil, 250000, 1 milhão, 500k)
    let maxBudgetKz: number | undefined = undefined;
    const milMatch = queryLower.match(/(\d+)\s*mil/);
    const numMatch = queryLower.match(/(\d{5,8})/);
    if (milMatch) {
      maxBudgetKz = parseInt(milMatch[1], 10) * 1000;
    } else if (numMatch) {
      maxBudgetKz = parseInt(numMatch[1], 10);
    }

    // Filter real products from catalog
    let matchedProducts = MOCK_PRODUCTS.filter(product => {
      let matches = true;
      if (maxBudgetKz && product.price > maxBudgetKz) {
        matches = false;
      }
      if (queryLower.includes('telefone') || queryLower.includes('iphone') || queryLower.includes('samsung') || queryLower.includes('telemovel')) {
        if (product.category !== 'Telemóveis') matches = false;
      } else if (queryLower.includes('computador') || queryLower.includes('macbook') || queryLower.includes('portatil')) {
        if (product.category !== 'Computadores') matches = false;
      } else if (queryLower.includes('frigorifico') || queryLower.includes('ar condicionado')) {
        if (product.category !== 'Eletrodomésticos') matches = false;
      }
      return matches;
    });

    if (matchedProducts.length === 0) {
      matchedProducts = MOCK_PRODUCTS.slice(0, 3);
    }

    let responseMessage = `Encontrei as melhores opções no ANGOLA MARKET para o seu pedido "${query}":`;
    if (maxBudgetKz) {
      responseMessage += ` (Filtrado até ${new Intl.NumberFormat('pt-AO').format(maxBudgetKz)} Kz)`;
    }

    try {
      if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock')) {
        const groq = this.getClient();
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'És o ANGOLA AI SHOPPING ASSISTANT do marketplace ANGOLA MARKET. Responde em português de Angola de forma prestável e cortês. NUNCA inventes produtos que não existam no catálogo.'
            },
            {
              role: 'user',
              content: `O cliente pesquisou: "${query}". Produtos reais disponíveis: ${JSON.stringify(matchedProducts.map(p => ({ title: p.title, price: p.price, seller: p.seller.store_name })))}. Gera uma resposta amigável de 2 frases.`
            }
          ],
          model: 'llama-3.3-70b-versatile',
        });

        if (completion.choices[0]?.message?.content) {
          responseMessage = completion.choices[0].message.content;
        }
      }
    } catch {
      // Fallback gracefully to structured text
    }

    return {
      message: responseMessage,
      recommendedProducts: matchedProducts,
      parsedIntent: {
        maxBudgetKz,
        keywords: query.split(' ')
      }
    };
  }

  /**
   * AI SELLER COPILOT
   * Helps seller generate high-converting title, description, tags & attributes from brief prompt.
   */
  static async generateSellerListing(brief: string): Promise<{
    title: string;
    description: string;
    tags: string[];
    suggestedCategory: string;
    recommendedPriceKz: number;
  }> {
    try {
      if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('mock')) {
        const groq = this.getClient();
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'És o AI SELLER COPILOT do ANGOLA MARKET. Ajuda o vendedor a criar anúncios profissionais. Retorna JSON com os campos: title, description, tags (array de strings), suggestedCategory, recommendedPriceKz.'
            },
            {
              role: 'user',
              content: `Informação do vendedor: "${brief}"`
            }
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      }
    } catch {
      // Fallback mock generator
    }

    return {
      title: `${brief} - Excelente Estado (Pronta Entrega em Luanda)`,
      description: `Produto ${brief} em perfeitas condições de funcionamento. Verificado e pronto para entrega rápida com garantia e pagamento seguro pelo ANGOLA MARKET.`,
      tags: ['Angola', 'SemFronteiras', 'Oportunidade', 'Garantia', 'ProntaEntrega'],
      suggestedCategory: 'Telemóveis',
      recommendedPriceKz: 220000
    };
  }
}
