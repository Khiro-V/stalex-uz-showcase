import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import productsData from "@/data/products.json";

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  images: string[];
  price: string;
  specs: Record<string, string>;
  description: string;
}

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categoryData, setCategoryData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const category = productsData.categories.find((cat: any) => cat.slug === slug);
    setCategoryData(category);
    
    const categoryProducts = productsData.products.filter(
      (product: any) => product.categoryId === slug
    );
    setProducts(categoryProducts);
    setFilteredProducts(categoryProducts);
  }, [slug]);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, "ru");
      }
      return 0;
    });

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchQuery, sortBy, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  if (!categoryData) return null;

  return (
    <>
      <Helmet>
        <title>{categoryData.name} - Каталог оборудования STALEX | STG CORP</title>
        <meta name="description" content={`Купить ${categoryData.name.toLowerCase()} STALEX в Узбекистане. Официальный дистрибьютор, гарантия качества, профессиональная поддержка.`} />
        <link rel="canonical" href={`https://stalex-shop.uz/catalog/${slug}`} />
        <meta property="og:title" content={`${categoryData.name} - Каталог STALEX`} />
        <meta property="og:description" content={`Купить ${categoryData.name.toLowerCase()} STALEX в Узбекистане`} />
        <meta property="og:url" content={`https://stalex-shop.uz/catalog/${slug}`} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumbs */}
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li><Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{categoryData.name}</li>
          </ol>
        </nav>

        <section className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">{categoryData.name}</h1>

          {/* Filters and Search */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Запросить цену</span>
                    <Button size="sm">Подробнее</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Назад
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Вперед
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Category;
