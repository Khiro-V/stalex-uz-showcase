import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface Category {
  id: string;
  title: string;
}

interface SpecField {
  key: string;
  value: string;
}

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    short_description: '',
    price_from: '',
    is_published: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<SpecField[]>([
    { key: 'Мощность', value: '' },
    { key: 'Габариты', value: '' },
    { key: 'Вес', value: '' },
    { key: 'Напряжение', value: '' },
    { key: 'Производительность', value: '' },
  ]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, title')
      .order('title');
    setCategories(data || []);
  };

  const fetchProduct = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id || '',
        short_description: data.short_description || '',
        price_from: data.price_from?.toString() || '',
        is_published: data.is_published,
      });
      const imageUrls = Array.isArray(data.images) 
        ? data.images.filter((img): img is string => typeof img === 'string')
        : [];
      setImages(imageUrls);
      
      if (data.specs && typeof data.specs === 'object') {
        const specsArray = Object.entries(data.specs).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        if (specsArray.length > 0) {
          setSpecs(specsArray);
        }
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    if (!id) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpecField = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    const productData = {
      title: formData.title,
      slug: formData.slug,
      category_id: formData.category_id || null,
      short_description: formData.short_description,
      price_from: formData.price_from ? parseFloat(formData.price_from) : null,
      is_published: formData.is_published,
      images,
      specs: specsObject,
    };

    let error;
    if (id) {
      ({ error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id));
    } else {
      ({ error } = await supabase.from('products').insert(productData));
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: id ? 'Товар обновлен' : 'Товар создан',
      });
      navigate('/admin/products');
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{id ? 'Редактирование товара' : 'Новый товар'} - StankoGroup</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {id ? 'Редактирование товара' : 'Новый товар'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            Отмена
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL (slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Короткое описание</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_from">Цена от (UZS)</Label>
                <Input
                  id="price_from"
                  type="number"
                  value={formData.price_from}
                  onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Опубликовано</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изображения</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} onImagesChange={setImages} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Характеристики</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addSpecField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить поле
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Название"
                      value={spec.key}
                      onChange={(e) => updateSpecField(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Значение"
                      value={spec.value}
                      onChange={(e) => updateSpecField(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSpecField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
