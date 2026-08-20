import { createClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  province?: string;
  role?: string;
}

export class SupabaseAuthService {
  private static getSupabase() {
    return createClient();
  }

  /**
   * Register a new user profile with Supabase Auth
   */
  static async signUp(email: string, password: string, fullName: string, phone: string) {
    const supabase = this.getSupabase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: 'customer'
        }
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in existing user
   */
  static async signIn(email: string, password: string) {
    const supabase = this.getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with Google OAuth
   */
  static async signInWithGoogle() {
    const supabase = this.getSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Logout user
   */
  static async signOut() {
    const supabase = this.getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser() {
    const supabase = this.getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || 'Utilizador Angola Market',
      phone: user.user_metadata?.phone || '+244 923 000 000',
      role: user.user_metadata?.role || 'customer'
    };
  }
}
