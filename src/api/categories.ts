import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
  productCount?: number;
}

export async function listCategoriesWithCounts(): Promise<Category[]> {
  // Get all categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('title');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  if (!categories) {
    return [];
  }

  // Get product count for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_published', true);

      if (countError) {
        console.error('Error counting products:', countError);
        return { ...category, productCount: 0 };
      }

      return { ...category, productCount: count || 0 };
    })
  );

  return categoriesWithCounts;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching category:', error);
    throw error;
  }

  return data;
}
