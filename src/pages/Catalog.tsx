import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";
import { useState, useEffect } from "react";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Каталог оборудования STALEX | STG CORP";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Каталог промышленного оборудования STALEX: гильотинные ножницы, листогибочные прессы, гидравлические прессы, вальцы. Технические характеристики, цены.');
    }
  }, []);

  const filteredCategories = productsData.categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Каталог оборудования</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Полный ассортимент промышленного оборудования STALEX для обработки металла
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск по категориям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/catalog/${category.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                      <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <span className="text-white font-medium flex items-center gap-2">
                            Смотреть модели <ArrowRight size={18} />
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-primary">
                            {category.productCount} {category.productCount === 1 ? 'модель' : 'моделей'}
                          </div>
                          <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" size={20} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Не нашли нужное оборудование?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Свяжитесь с нашими специалистами, и мы поможем подобрать оптимальное решение 
                для ваших производственных задач
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/contacts#quote" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary-light rounded transition-colors font-medium"
                >
                  Запросить консультацию
                </Link>
                <a 
                  href="tel:+998974335115" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border bg-background hover:bg-secondary rounded transition-colors font-medium"
                >
                  Позвонить +998 97 433-51-15
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
