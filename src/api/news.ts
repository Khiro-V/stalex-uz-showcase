import { supabase } from "@/integrations/supabase/client";

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  cover_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string;
  author_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListNewsParams {
  q?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface ListNewsResult {
  data: NewsPost[];
  total: number;
}

export async function listNews(params?: ListNewsParams): Promise<ListNewsResult> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('news_posts')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // Search by title or excerpt
  if (params?.q) {
    query = query.or(`title.ilike.%${params.q}%,excerpt.ilike.%${params.q}%`);
  }

  // Filter by tag
  if (params?.tag) {
    query = query.contains('tags', [params.tag]);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    throw error;
  }

  return {
    data: data || [],
    total: count || 0
  };
}

export async function getNews(slug: string): Promise<NewsPost | null> {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching news post:', error);
    throw error;
  }

  return data;
}

export async function getRelatedNews(
  currentId: number,
  tags: string[],
  limit: number = 4
): Promise<NewsPost[]> {
  // Try to find posts with overlapping tags
  let query = supabase
    .from('news_posts')
    .select('*')
    .eq('is_published', true)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching related news:', error);
    return [];
  }

  return data || [];
}

export async function listLatestNews(limit: number = 3): Promise<NewsPost[]> {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest news:', error);
    throw error;
  }

  return data || [];
}

// Admin functions
export async function createNews(post: Omit<NewsPost, 'id' | 'created_at' | 'updated_at' | 'author_email'>): Promise<NewsPost> {
  const { data, error } = await supabase
    .from('news_posts')
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error('Error creating news post:', error);
    throw error;
  }

  return data;
}

export async function updateNews(id: number, post: Partial<NewsPost>): Promise<NewsPost> {
  const { data, error } = await supabase
    .from('news_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news post:', error);
    throw error;
  }

  return data;
}

export async function deleteNews(id: number): Promise<void> {
  const { error } = await supabase
    .from('news_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news post:', error);
    throw error;
  }
}

// Admin: list all posts (including drafts)
export async function listAllNews(params?: ListNewsParams): Promise<ListNewsResult> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('news_posts')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false });

  // Search by title, excerpt or tags
  if (params?.q) {
    query = query.or(`title.ilike.%${params.q}%,excerpt.ilike.%${params.q}%,tags.cs.{${params.q}}`);
  }

  // Filter by tag
  if (params?.tag) {
    query = query.contains('tags', [params.tag]);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching all news:', error);
    throw error;
  }

  return {
    data: data || [],
    total: count || 0
  };
}

export async function getNewsById(id: number): Promise<NewsPost | null> {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching news post:', error);
    throw error;
  }

  return data;
}
