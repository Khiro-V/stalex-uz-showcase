-- Fix search_path for security functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' IN (
    'admin1@example.com',
    'admin2@example.com'
    -- Add your admin emails here
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;