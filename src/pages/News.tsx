import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";
import { listNews, type NewsPost } from "@/api/news";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const News = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    document.title = "Новости - STG CORP";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Последние новости, акции и обновления от официального дистрибьютора STALEX в Узбекистане.');
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [currentPage, searchQuery, selectedTag]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const result = await listNews({
        q: searchQuery || undefined,
        tag: selectedTag || undefined,
        page: currentPage,
        pageSize
      });
      setPosts(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const getAuthorName = (email: string | null) => {
    if (!email) return 'Администратор';
    return email.split('@')[0];
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  return (
    <>
      <Helmet>
        <title>Новости - STG CORP</title>
        <meta name="description" content="Последние новости, акции и обновления от официального дистрибьютора STALEX в Узбекистане." />
        <link rel="canonical" href="https://stalex-shop.uz/news" />
        <meta property="og:title" content="Новости - STG CORP" />
        <meta property="og:description" content="Последние новости, акции и обновления от STALEX" />
        <meta property="og:url" content="https://stalex-shop.uz/news" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumbs */}
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Новости</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-secondary py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Новости и события</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Актуальная информация о новых поступлениях, акциях и событиях компании
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="max-w-xl mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск по новостям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Теги:</span>
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Загрузка новостей...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  Новости не найдены
                </p>
                {(searchQuery || selectedTag) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                      setCurrentPage(1);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/news/${post.slug}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-video bg-secondary relative overflow-hidden">
                          {post.cover_url ? (
                            <img
                              src={post.cover_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              Нет изображения
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{format(new Date(post.published_at), 'd MMMM yyyy', { locale: ru })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{getAuthorName(post.author_email)}</span>
                            </div>
                          </div>
                          
                          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>
                          )}

                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {post.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      Назад
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Страница {currentPage} из {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      Вперед
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default News;
