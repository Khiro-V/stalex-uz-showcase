import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Package, FolderTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: 'Выход выполнен',
        description: 'Вы вышли из системы',
      });
      navigate('/auth');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/admin" className="text-xl font-bold">
                Админка StankoGroup
              </Link>
              <nav className="flex gap-4">
                <Link to="/admin/products">
                  <Button
                    variant={isActive('/admin/products') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Товары
                  </Button>
                </Link>
                <Link to="/admin/categories">
                  <Button
                    variant={isActive('/admin/categories') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <FolderTree className="mr-2 h-4 w-4" />
                    Категории
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
