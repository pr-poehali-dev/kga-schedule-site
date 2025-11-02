import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Campus, Teacher, Group, Schedule } from '@/types';
import { updateSchedule } from '@/lib/api';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

interface EditScheduleDialogProps {
  schedule: Schedule | null;
  groups: Group[];
  teachers: Teacher[];
  campuses: Campus[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditScheduleDialog({ 
  schedule, 
  groups, 
  teachers, 
  campuses, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditScheduleDialogProps) {
  const [formData, setFormData] = useState({
    id: 0,
    group_id: '',
    teacher_id: '',
    campus_id: '',
    subject: '',
    room: '',
    day_of_week: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        id: schedule.id,
        group_id: schedule.group_id.toString(),
        teacher_id: schedule.teacher_id.toString(),
        campus_id: schedule.campus_id.toString(),
        subject: schedule.subject,
        room: schedule.room,
        day_of_week: schedule.day_of_week.toString(),
        start_time: schedule.start_time.substring(0, 5),
        end_time: schedule.end_time.substring(0, 5)
      });
    }
  }, [schedule]);

  const handleSubmit = async () => {
    try {
      await updateSchedule({
        id: formData.id,
        group_id: Number(formData.group_id),
        teacher_id: Number(formData.teacher_id),
        campus_id: Number(formData.campus_id),
        subject: formData.subject,
        room: formData.room,
        day_of_week: Number(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time
      });

      toast.success('Занятие обновлено');
      onClose();
      onSuccess();
    } catch (error) {
      toast.error('Ошибка при обновлении занятия');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать занятие</DialogTitle>
          <DialogDescription>
            Измените информацию о занятии
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Предмет</Label>
            <Input 
              placeholder="Название предмета" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Группа</Label>
              <Select value={formData.group_id} onValueChange={(v) => setFormData({...formData, group_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите группу" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(g => (
                    <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Преподаватель</Label>
              <Select value={formData.teacher_id} onValueChange={(v) => setFormData({...formData, teacher_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите преподавателя" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>{t.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Аудитория</Label>
              <Input 
                placeholder="А-101" 
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Кампус</Label>
              <Select value={formData.campus_id} onValueChange={(v) => setFormData({...formData, campus_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите кампус" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>День недели</Label>
              <Select value={formData.day_of_week} onValueChange={(v) => setFormData({...formData, day_of_week: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="День" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Начало</Label>
              <Input 
                type="time" 
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Конец</Label>
              <Input 
                type="time" 
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            onClick={handleSubmit}
          >
            Сохранить изменения
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
