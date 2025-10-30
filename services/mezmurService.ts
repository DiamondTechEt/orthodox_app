import { supabase } from '@/lib/supabase';
import { Mezmur, Category, Favorite, Download } from '@/types/database';

export const mezmurService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getMezmurs(): Promise<Mezmur[]> {
    const { data, error } = await supabase
      .from('mezmurs')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMezmursByCategory(categoryId: string): Promise<Mezmur[]> {
    const { data, error } = await supabase
      .from('mezmurs')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .order('title');

    if (error) throw error;
    return data || [];
  },

  async searchMezmurs(query: string): Promise<Mezmur[]> {
    const { data, error } = await supabase
      .from('mezmurs')
      .select('*, category:categories(*)')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .order('title');

    if (error) throw error;
    return data || [];
  },

  async getMezmurById(id: string): Promise<Mezmur | null> {
    const { data, error } = await supabase
      .from('mezmurs')
      .select('*, category:categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async incrementPlayCount(mezmurId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_play_count', {
      mezmur_id: mezmurId,
    });

    if (error) {
      const { data: mezmur } = await supabase
        .from('mezmurs')
        .select('play_count')
        .eq('id', mezmurId)
        .maybeSingle();

      if (mezmur) {
        await supabase
          .from('mezmurs')
          .update({ play_count: mezmur.play_count + 1 })
          .eq('id', mezmurId);
      }
    }
  },

  async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, mezmur:mezmurs(*, category:categories(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addFavorite(userId: string, mezmurId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, mezmur_id: mezmurId }]);

    if (error) throw error;
  },

  async removeFavorite(userId: string, mezmurId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('mezmur_id', mezmurId);

    if (error) throw error;
  },

  async isFavorite(userId: string, mezmurId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('mezmur_id', mezmurId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  async getDownloads(userId: string): Promise<Download[]> {
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async addDownload(userId: string, mezmurId: string, localPath: string): Promise<void> {
    const { error } = await supabase
      .from('downloads')
      .insert([{ user_id: userId, mezmur_id: mezmurId, local_path: localPath }]);

    if (error) throw error;
  },

  async removeDownload(userId: string, mezmurId: string): Promise<void> {
    const { error } = await supabase
      .from('downloads')
      .delete()
      .eq('user_id', userId)
      .eq('mezmur_id', mezmurId);

    if (error) throw error;
  },

  async isDownloaded(userId: string, mezmurId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('downloads')
      .select('local_path')
      .eq('user_id', userId)
      .eq('mezmur_id', mezmurId)
      .maybeSingle();

    if (error) return null;
    return data?.local_path || null;
  },
};
