import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  images: string[];
  specs: Record<string, any>;
}

const Compare = () => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompareList();
  }, []);

  const loadCompareList = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("compareList");
      if (stored) {
        const ids = JSON.parse(stored);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', ids)
          .eq('is_published', true);

        if (error) {
          console.error('Error loading compare list:', error);
          return;
        }

        const products = (data || []).map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : [],
          specs: typeof item.specs === 'object' && item.specs !== null ? item.specs : {}
        })) as Product[];

        setCompareList(products.slice(0, 4));
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCompare = (id: string) => {
    const updated = compareList.filter((p) => p.id !== id);
    setCompareList(updated);
    localStorage.setItem("compareList", JSON.stringify(updated.map((p) => p.id)));
  };

  const allSpecs = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <>
      <Helmet>
        <title>Сравнение товаров - Оборудование STALEX | STG CORP</title>
        <meta name="description" content="Сравните характеристики оборудования STALEX. Удобная таблица сравнения до 4 моделей." />
        <link rel="canonical" href="https://stalex-shop.uz/compare" />
        <meta property="og:title" content="Сравнение товаров - STALEX" />
        <meta property="og:url" content="https://stalex-shop.uz/compare" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Сравнение</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Сравнение товаров</h1>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Загрузка...
            </div>
          ) : compareList.length === 0 ? (
            <div className="bg-card rounded-lg p-12 text-center">
              <p className="text-xl text-muted-foreground mb-6">
                Вы еще не добавили товары для сравнения
              </p>
              <Link to="/catalog">
                <Button size="lg">Перейти в каталог</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left font-bold text-foreground sticky left-0 bg-card z-10">
                      Характеристика
                    </th>
                    {compareList.map((product) => (
                      <th key={product.id} className="p-4 min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                            aria-label="Удалить из сравнения"
                          >
                            <X size={16} />
                          </button>
                          <Link to={`/product/${product.slug}`}>
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full aspect-square object-cover rounded-lg mb-3"
                              />
                            )}
                            <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSpecs.map((spec, index) => (
                    <tr key={spec} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="p-4 font-medium text-foreground sticky left-0 bg-inherit">
                        {spec}
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="p-4 text-muted-foreground">
                          {product.specs[spec] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Compare;
