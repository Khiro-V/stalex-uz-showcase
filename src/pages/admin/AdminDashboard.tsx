import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FolderTree, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    published: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, categoriesRes, publishedRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_published', true),
      ]);

      setStats({
        products: productsRes.count || 0,
        categories: categoriesRes.count || 0,
        published: publishedRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <>
      <Helmet>
        <title>Панель администратора - StankoGroup</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-muted-foreground mt-2">
            Управление товарами и категориями
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">
                Опубликовано: {stats.published}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Категории</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Товары</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Управление каталогом товаров
              </p>
              <div className="flex gap-2">
                <Link to="/admin/products">
                  <Button variant="outline">Все товары</Button>
                </Link>
                <Link to="/admin/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить товар
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Категории</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Управление категориями товаров
              </p>
              <div className="flex gap-2">
                <Link to="/admin/categories">
                  <Button variant="outline">Все категории</Button>
                </Link>
                <Link to="/admin/categories/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить категорию
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
