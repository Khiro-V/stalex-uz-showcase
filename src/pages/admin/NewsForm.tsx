import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X, Upload } from "lucide-react";
import { getNewsById, createNews, updateNews, type NewsPost } from "@/api/news";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewsForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = id && id !== 'new';

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_md: '',
    cover_url: '',
    tags: [] as string[],
    is_published: true,
    published_at: new Date().toISOString().split('T')[0]
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    if (!id || id === 'new') return;

    try {
      setLoading(true);
      const post = await getNewsById(parseInt(id));
      if (post) {
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content_md: post.content_md || '',
          cover_url: post.cover_url || '',
          tags: post.tags,
          is_published: post.is_published,
          published_at: new Date(post.published_at).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новость",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^а-яa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5 МБ",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Можно загружать только изображения",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        cover_url: publicUrl
      }));

      toast({
        title: "Успешно",
        description: "Изображение загружено"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Заголовок обязателен",
        variant: "destructive"
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Ошибка",
        description: "Slug обязателен",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const postData = {
        ...formData,
        published_at: new Date(formData.published_at).toISOString()
      };

      if (isEdit) {
        await updateNews(parseInt(id), postData);
        toast({
          title: "Успешно",
          description: "Новость обновлена"
        });
      } else {
        await createNews(postData);
        toast({
          title: "Успешно",
          description: "Новость создана"
        });
      }

      navigate('/admin/news');
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить новость",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/news/${formData.slug}`, '_blank');
    }
  };

  // Simple markdown preview
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return '';
    
    let html = markdown;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
    html = html.split('\n\n').map(para => para.trim() ? `<p class="mb-4">${para}</p>` : '').join('\n');
    
    return html;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/news">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Редактировать новость' : 'Создать новость'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          {isEdit && formData.slug && (
            <Button variant="outline" onClick={handlePreview} type="button">
              <Eye size={16} className="mr-2" />
              Предпросмотр
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            <Save size={16} className="mr-2" />
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Заголовок *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Введите заголовок новости"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-адрес-новости"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL новости: /news/{formData.slug || 'slug'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Краткое описание для карточки новости"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Tabs defaultValue="edit">
                <TabsList className="mb-4">
                  <TabsTrigger value="edit">Редактирование</TabsTrigger>
                  <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit">
                  <div>
                    <Label htmlFor="content_md">Содержание (Markdown)</Label>
                    <Textarea
                      id="content_md"
                      value={formData.content_md}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_md: e.target.value }))}
                      placeholder="Введите текст статьи в формате Markdown..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Поддерживается Markdown: **жирный**, *курсив*, # Заголовки, [ссылки](url)
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div 
                    className="prose prose-sm max-w-none p-4 border rounded-lg min-h-[500px]"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content_md) }}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Публикация</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Опубликовано</Label>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="published_at">Дата публикации</Label>
                  <Input
                    id="published_at"
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Обложка</h3>
              <div className="space-y-4">
                {formData.cover_url && (
                  <div className="relative">
                    <img
                      src={formData.cover_url}
                      alt="Cover"
                      className="w-full h-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData(prev => ({ ...prev, cover_url: '' }))}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="cover_upload" className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
                      <p className="text-sm text-muted-foreground">
                        {uploading ? 'Загрузка...' : 'Нажмите для загрузки обложки'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG до 5 МБ
                      </p>
                    </div>
                    <Input
                      id="cover_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Теги</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Добавить тег"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    +
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
