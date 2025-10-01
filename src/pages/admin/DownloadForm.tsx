import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from '@/components/admin/FileUpload';
import {
  listAllDownloads,
  createDownload,
  updateDownload,
  listDownloadCategories,
  type Download,
  type DownloadCategory,
} from '@/api/downloads';

const DownloadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<DownloadCategory[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category_id: undefined as number | undefined,
    file_url: '',
    tags: '',
    is_published: true,
    published_at: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadCategories();
    if (id && id !== 'new') {
      loadDownload();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await listDownloadCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDownload = async () => {
    try {
      const allDownloads = await listAllDownloads();
      const download = allDownloads.find((d) => d.id === Number(id));
      if (download) {
        setFormData({
          title: download.title,
          slug: download.slug,
          description: download.description || '',
          category_id: download.category_id,
          file_url: download.file_url,
          tags: download.tags?.join(', ') || '',
          is_published: download.is_published,
          published_at: download.published_at.split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error loading download:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (id && id !== 'new') {
        await updateDownload(Number(id), data);
        toast({ title: 'Файл обновлён' });
      } else {
        await createDownload(data);
        toast({ title: 'Файл создан' });
      }

      navigate('/admin/downloads');
    } catch (error) {
      console.error('Error saving download:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/downloads')}
        className="mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        Назад
      </Button>

      <h1 className="text-3xl font-bold mb-6">
        {id && id !== 'new' ? 'Редактировать' : 'Создать'} файл
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="title">Название *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug: generateSlug(e.target.value),
              });
            }}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div>
          <Label htmlFor="category">Категория</Label>
          <Select
            value={formData.category_id?.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Файл *</Label>
          <FileUpload
            bucket="downloads"
            onUpload={(url) => setFormData({ ...formData, file_url: url })}
            currentFile={formData.file_url}
          />
          {formData.file_url && (
            <a
              href={formData.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              Открыть файл
            </a>
          )}
        </div>

        <div>
          <Label htmlFor="tags">Теги (через запятую)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="каталог, инструкция, pdf"
          />
        </div>

        <div>
          <Label htmlFor="published_at">Дата публикации</Label>
          <Input
            id="published_at"
            type="date"
            value={formData.published_at}
            onChange={(e) =>
              setFormData({ ...formData, published_at: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_published: checked })
            }
          />
          <Label htmlFor="is_published">Опубликовано</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/downloads')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DownloadForm;
