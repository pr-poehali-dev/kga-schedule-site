import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { importExcelFile } from '@/lib/api';

interface ImportExcelDialogProps {
  onImportSuccess: () => void;
}

export default function ImportExcelDialog({ onImportSuccess }: ImportExcelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Content = base64.split(',')[1];

        try {
          const result = await importExcelFile(base64Content);
          
          if (result.errors && result.errors.length > 0) {
            toast.warning(`Импортировано: ${result.imported}. Ошибок: ${result.errors.length}`, {
              description: result.errors.slice(0, 3).join('\n')
            });
          } else {
            toast.success(`Успешно импортировано ${result.imported} занятий`);
          }
          
          setIsOpen(false);
          onImportSuccess();
        } catch (error) {
          toast.error('Ошибка при импорте файла');
          console.error('Import error:', error);
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Ошибка при чтении файла');
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="Upload" size={18} />
          Импорт из Excel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Импорт расписания из Excel</DialogTitle>
          <DialogDescription>
            Загрузите файл Excel с расписанием. Формат файла:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-semibold">Структура файла Excel:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Столбец A: Название группы (например, ЛА-23)</li>
              <li>Столбец B: Предмет (например, Математика)</li>
              <li>Столбец C: ФИО преподавателя (например, Сидоров Иван Петрович)</li>
              <li>Столбец D: Аудитория (например, А-101)</li>
              <li>Столбец E: День недели (1-6, где 1=Понедельник)</li>
              <li>Столбец F: Время начала (например, 09:00)</li>
              <li>Столбец G: Время окончания (например, 10:30)</li>
              <li>Столбец H: Название кампуса (например, Главный корпус)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Первая строка должна содержать заголовки
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excel-file">Выберите файл Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Загрузка и обработка файла...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
