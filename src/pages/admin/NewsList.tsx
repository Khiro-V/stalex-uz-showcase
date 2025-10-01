import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { listAllNews, deleteNews, type NewsPost } from "@/api/news";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NewsList = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<NewsPost | null>(null);
  const { toast } = useToast();
  const pageSize = 20;

  useEffect(() => {
    loadPosts();
  }, [currentPage, searchQuery]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await listAllNews({
        q: searchQuery || undefined,
        page: currentPage,
        pageSize
      });
      setPosts(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список новостей",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDeleteClick = (post: NewsPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deleteNews(postToDelete.id);
      toast({
        title: "Успешно",
        description: "Новость удалена"
      });
      loadPosts();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить новость",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Новости</h1>
          <p className="text-muted-foreground">Управление новостями и статьями</p>
        </div>
        <Link to="/admin/news/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Создать новость
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Поиск по заголовку или тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Загрузка...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Новости не найдены</p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Сбросить поиск
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Заголовок</TableHead>
                  <TableHead>Дата публикации</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Теги</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/admin/news/${post.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.published_at), 'd MMM yyyy', { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Опубликовано" : "Черновик"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/news/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{postToDelete?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsList;
