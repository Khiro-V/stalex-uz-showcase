import { supabase } from '@/integrations/supabase/client';

export interface DownloadCategory {
  id: number;
  slug: string;
  title: string;
}

export interface Download {
  id: number;
  slug: string;
  title: string;
  description?: string;
  category_id?: number;
  file_url: string;
  tags?: string[];
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  download_categories?: DownloadCategory;
}

// Categories
export async function listDownloadCategories() {
  const { data, error } = await supabase
    .from('download_categories')
    .select('*')
    .order('title');

  if (error) throw error;
  return data || [];
}

export async function createDownloadCategory(data: Omit<DownloadCategory, 'id'>) {
  const { data: category, error } = await supabase
    .from('download_categories')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return category;
}

export async function updateDownloadCategory(id: number, data: Partial<Omit<DownloadCategory, 'id'>>) {
  const { data: category, error } = await supabase
    .from('download_categories')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return category;
}

export async function deleteDownloadCategory(id: number) {
  const { error } = await supabase
    .from('download_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Downloads
export async function listDownloads(params?: { categoryId?: number; q?: string }) {
  let query = supabase
    .from('downloads')
    .select('*, download_categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (params?.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }

  if (params?.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function listAllDownloads(params?: { q?: string }) {
  let query = supabase
    .from('downloads')
    .select('*, download_categories(*)')
    .order('published_at', { ascending: false });

  if (params?.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getDownload(slug: string) {
  const { data, error } = await supabase
    .from('downloads')
    .select('*, download_categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;
  return data;
}

export async function createDownload(data: Omit<Download, 'id' | 'created_at' | 'updated_at' | 'download_categories'>) {
  const { data: download, error } = await supabase
    .from('downloads')
    .insert(data)
    .select('*, download_categories(*)')
    .single();

  if (error) throw error;
  return download;
}

export async function updateDownload(id: number, data: Partial<Omit<Download, 'id' | 'created_at' | 'updated_at' | 'download_categories'>>) {
  const { data: download, error } = await supabase
    .from('downloads')
    .update(data)
    .eq('id', id)
    .select('*, download_categories(*)')
    .single();

  if (error) throw error;
  return download;
}

export async function deleteDownload(id: number) {
  const { error } = await supabase
    .from('downloads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
