import { useState, useEffect } from 'react';
import { Download as DownloadIcon, Search, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { listDownloads, type Download } from '@/api/downloads';

const Downloads = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const data = await listDownloads();
      setDownloads(data);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDownloads = downloads.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByCategory = filteredDownloads.reduce((acc, download) => {
    const categoryTitle = download.download_categories?.title || 'Без категории';
    if (!acc[categoryTitle]) {
      acc[categoryTitle] = [];
    }
    acc[categoryTitle].push(download);
    return acc;
  }, {} as Record<string, Download[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">Загрузки</h1>
            <p className="text-lg text-muted-foreground">
              Каталоги, инструкции и документация
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : Object.keys(groupedByCategory).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">Файлы не найдены</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedByCategory).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-4">{category}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((download) => (
                        <div
                          key={download.id}
                          className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="text-primary" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1 truncate">{download.title}</h3>
                              {download.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {download.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {download.tags && download.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {download.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <Button
                            asChild
                            className="w-full"
                          >
                            <a
                              href={download.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              <DownloadIcon size={16} className="mr-2" />
                              Скачать
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Downloads;
