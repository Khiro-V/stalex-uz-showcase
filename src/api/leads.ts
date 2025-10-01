import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  model?: string;
  message?: string;
  created_at: string;
}

export async function createLead(data: Omit<Lead, 'id' | 'created_at'>) {
  const { data: lead, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return lead;
}

export async function listLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteLead(id: number) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
