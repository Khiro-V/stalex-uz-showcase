import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category_id: string | null;
  specs: Record<string, any>;
  price_from: number | null;
  images: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListProductsParams {
  categorySlug?: string;
  q?: string;
}

export async function listProducts(params?: ListProductsParams): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug)
    `)
    .eq('is_published', true);

  // Filter by category slug if provided
  if (params?.categorySlug) {
    query = query.eq('categories.slug', params.categorySlug);
  }

  // Search by title if query provided
  if (params?.q) {
    query = query.ilike('title', `%${params.q}%`);
  }

  query = query.order('title');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    images: Array.isArray(item.images) ? item.images : [],
    specs: typeof item.specs === 'object' && item.specs !== null ? item.specs : {}
  })) as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
    specs: typeof data.specs === 'object' && data.specs !== null ? data.specs : {}
  } as Product;
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    images: Array.isArray(item.images) ? item.images : [],
    specs: typeof item.specs === 'object' && item.specs !== null ? item.specs : {}
  })) as Product[];
}
