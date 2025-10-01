import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  currentFile?: string;
}

export const FileUpload = ({ bucket, onUpload, currentFile }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      onUpload(url);
      toast({
        title: 'Успешно',
        description: 'Файл загружен',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Загрузка...' : currentFile ? 'Заменить файл' : 'Загрузить файл'}
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {currentFile && (
        <p className="text-sm text-muted-foreground">Файл загружен</p>
      )}
    </div>
  );
};
