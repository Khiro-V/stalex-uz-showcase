import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Clock, Wrench, Award, ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { listCategoriesWithCounts, type Category } from "@/api/categories";

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "STG CORP - Официальный поставщик оборудования STALEX в Узбекистане";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Поставка промышленного оборудования STALEX в Узбекистан. Гильотины, листогибы, прессы, станки. Гарантия, сервис, консультации.');
    }

    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await listCategoriesWithCounts();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const advantages = [
    {
      icon: Shield,
      title: "Официальная гарантия",
      description: "Полная гарантия производителя на всё оборудование STALEX"
    },
    {
      icon: Wrench,
      title: "Сервисная поддержка",
      description: "Квалифицированное обслуживание и ремонт оборудования"
    },
    {
      icon: Clock,
      title: "Оперативная доставка",
      description: "Быстрая доставка оборудования по всему Узбекистану"
    },
    {
      icon: Award,
      title: "Консультации экспертов",
      description: "Помощь в подборе оборудования под ваши задачи"
    }
  ];

  const news = [
    {
      id: "1",
      title: "Новое поступление гильотинных ножниц STALEX",
      date: "15 марта 2025",
      excerpt: "На склад поступила новая партия гильотинных ножниц серии THS с улучшенными характеристиками.",
      image: "/images/news/news-1.jpg"
    },
    {
      id: "2",
      title: "Акция на листогибочные прессы",
      date: "10 марта 2025",
      excerpt: "Специальное предложение на гидравлические листогибочные прессы серии HBS. Скидка до 10%.",
      image: "/images/news/news-2.jpg"
    },
    {
      id: "3",
      title: "Обучающий семинар по работе с оборудованием",
      date: "5 марта 2025",
      excerpt: "Приглашаем на бесплатный семинар по эксплуатации и обслуживанию оборудования STALEX.",
      image: "/images/news/news-3.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative bg-gradient-to-br from-primary to-primary-light text-primary-foreground py-20 md:py-32"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%)"
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Оборудование STALEX — официальные поставки в Узбекистан
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-95">
                Профессиональное промышленное оборудование для обработки металла: 
                гильотины, листогибы, прессы и станки
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent-light text-accent-foreground">
                  <Link to="/catalog">Каталог оборудования</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white">
                  <Link to="/contacts#quote">Запросить КП</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((advantage, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <advantage.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                  <p className="text-sm text-muted-foreground">{advantage.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Каталог оборудования</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Широкий ассортимент промышленного оборудования STALEX для любых производственных задач
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {loading ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Загрузка категорий...
                </div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Категории не найдены
                </div>
              ) : (
                categories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/catalog/${category.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                      <div className="aspect-square bg-secondary relative overflow-hidden">
                        {category.cover_url && (
                          <img 
                            src={category.cover_url} 
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white font-medium flex items-center gap-2">
                            Смотреть <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                        <div className="text-sm font-medium text-primary">
                          {category.productCount} моделей
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/catalog">Смотреть весь каталог</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Почему выбирают STG CORP
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Официальный дилер STALEX</h3>
                      <p className="text-sm text-muted-foreground">
                        Прямые поставки от производителя с полной гарантией подлинности
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Гарантия и сервис</h3>
                      <p className="text-sm text-muted-foreground">
                        Полное гарантийное и послегарантийное обслуживание оборудования
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Наличие на складе</h3>
                      <p className="text-sm text-muted-foreground">
                        Большой выбор оборудования в наличии для быстрой отгрузки
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Техническая поддержка</h3>
                      <p className="text-sm text-muted-foreground">
                        Консультации по выбору, установке и эксплуатации оборудования
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary-light">
                  <Link to="/about">Подробнее о компании</Link>
                </Button>
              </div>
              <div className="bg-primary/5 rounded-lg p-8 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4">10+</div>
                  <div className="text-xl font-medium mb-2">Лет опыта</div>
                  <p className="text-muted-foreground">
                    Поставки промышленного оборудования в Узбекистане
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Новости</h2>
              <Button asChild variant="ghost">
                <Link to="/news">Все новости <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} to={`/news/${item.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full">
                    <div className="aspect-video bg-secondary"></div>
                    <div className="p-6">
                      <div className="text-sm text-muted-foreground mb-2">{item.date}</div>
                      <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Нужна консультация?
            </h2>
            <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
              Наши специалисты помогут подобрать оборудование под ваши задачи и ответят на все вопросы
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-light text-accent-foreground">
                <Link to="/contacts#quote">Запросить КП</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white">
                <a href="tel:+998974335115">Позвонить сейчас</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
