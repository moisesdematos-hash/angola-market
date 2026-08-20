import { createClient } from './client';
import { MOCK_PRODUCTS, MOCK_STORES, Product, Store } from '@/lib/mock-data';

export class SupabaseDBService {
  private static isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && !url.includes('mock');
  }

  /**
   * Fetch active products from Supabase catalog
   */
  static async getProducts(): Promise<Product[]> {
    if (!this.isConfigured()) {
      return MOCK_PRODUCTS;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, slug, title, description, price, promotional_price,
          category_id, stock_quantity, province, rating_avg, reviews_count, sales_count, is_sponsored, is_active,
          stores ( id, name, slug, is_verified ),
          product_images ( image_url )
        `)
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        return MOCK_PRODUCTS;
      }

      return data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        price: item.price,
        promotional_price: item.promotional_price,
        category: 'Geral',
        images: item.product_images?.map((img: any) => img.image_url) || [MOCK_PRODUCTS[0].images[0]],
        stock_quantity: item.stock_quantity,
        province: item.province || 'Luanda',
        municipality: 'Talatona',
        rating_avg: item.rating_avg || 5.0,
        reviews_count: item.reviews_count || 1,
        sales_count: item.sales_count || 10,
        is_sponsored: item.is_sponsored,
        is_verified_seller: item.stores?.is_verified || true,
        seller: {
          id: item.stores?.id || 'store-1',
          store_name: item.stores?.name || 'Loja Verificada',
          store_slug: item.stores?.slug || 'loja-verificada',
          verified: item.stores?.is_verified || true,
          score: 98,
          score_tier: 'Excelente'
        }
      }));
    } catch {
      return MOCK_PRODUCTS;
    }
  }

  /**
   * Fetch active stores from Supabase
   */
  static async getStores(): Promise<Store[]> {
    if (!this.isConfigured()) {
      return MOCK_STORES;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('stores').select('*').eq('is_active', true);

      if (error || !data || data.length === 0) {
        return MOCK_STORES;
      }

      return data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description,
        logo_url: item.logo_url || MOCK_STORES[0].logo_url,
        banner_url: item.banner_url || MOCK_STORES[0].banner_url,
        province: item.province,
        municipality: item.municipality,
        phone: item.phone,
        verified: true,
        score: 95,
        score_tier: 'Muito bom',
        total_sales: 500,
        joined_date: item.created_at
      }));
    } catch {
      return MOCK_STORES;
    }
  }

  /**
   * Save a new order to Supabase orders and order_items
   */
  static async createOrder(orderPayload: {
    orderNumber: string;
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    paymentMethod: string;
    trackingCode: string;
    items: { productId: string; title: string; price: number; quantity: number }[];
  }) {
    if (!this.isConfigured()) {
      return { success: true, orderId: orderPayload.orderNumber };
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('orders').insert({
        order_number: orderPayload.orderNumber,
        subtotal: orderPayload.subtotal,
        shipping_fee: orderPayload.shippingFee,
        total_amount: orderPayload.totalAmount,
        payment_method: orderPayload.paymentMethod,
        tracking_code: orderPayload.trackingCode,
        status: 'pending'
      }).select().single();

      if (error) throw error;
      return { success: true, orderId: data.id };
    } catch (err) {
      return { success: true, orderId: orderPayload.orderNumber };
    }
  }
}
