import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { getNews, getRelatedNews, type NewsPost } from "@/api/news";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const NewsPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await getNews(slug);
      
      if (!data) {
        setPost(null);
        return;
      }

      setPost(data);

      // Load related posts
      const related = await getRelatedNews(data.id, data.tags, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Failed to load news post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = (email: string | null) => {
    if (!email) return 'Администратор';
    return email.split('@')[0];
  };

  // Simple markdown to HTML converter
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return '';

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-4 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc mb-4">$1</ul>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() && !para.startsWith('<')) {
        return `<p class="mb-4">${para}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground mb-4">Новость не найдена</p>
            <Link to="/news">
              <Button variant="outline">
                <ArrowLeft size={16} className="mr-2" />
                К списку новостей
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Новости STG CORP</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={`https://stalex-shop.uz/news/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={`https://stalex-shop.uz/news/${slug}`} />
        {post.cover_url && <meta property="og:image" content={post.cover_url} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumbs */}
        <nav className="container mx-auto px-4 py-4 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Главная</Link></li>
            <li>/</li>
            <li><Link to="/news" className="hover:text-primary transition-colors">Новости</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link to="/news" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            К списку новостей
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{format(new Date(post.published_at), 'd MMMM yyyy', { locale: ru })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{getAuthorName(post.author_email)}</span>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/news?tag=${encodeURIComponent(tag)}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {post.cover_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content_md || '') }}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">Читайте также</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/news/${related.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                      <div className="aspect-video bg-secondary relative overflow-hidden">
                        {related.cover_url ? (
                          <img
                            src={related.cover_url}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            Нет изображения
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(related.published_at), 'd MMMM yyyy', { locale: ru })}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
};

export default NewsPostPage;
