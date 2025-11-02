import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Campus, Teacher, Group, Schedule } from '@/types';
import ScheduleCard from './ScheduleCard';

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

interface ScheduleTabProps {
  schedule: Schedule[];
  setSchedule: (schedule: Schedule[]) => void;
  groups: Group[];
  teachers: Teacher[];
  campuses: Campus[];
}

export default function ScheduleTab({ schedule, setSchedule, groups, teachers, campuses }: ScheduleTabProps) {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(1);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const getFilteredSchedule = () => {
    let filtered = schedule;
    
    if (selectedGroup) {
      filtered = filtered.filter(s => s.group_id === selectedGroup);
    }
    
    if (selectedTeacher) {
      filtered = filtered.filter(s => s.teacher_id === selectedTeacher);
    }
    
    return filtered;
  };

  const getTeacherName = (id: number) => {
    return teachers.find(t => t.id === id)?.full_name || 'Неизвестен';
  };

  const getGroupName = (id: number) => {
    return groups.find(g => g.id === id)?.name || 'Неизвестна';
  };

  const getCampusName = (id: number) => {
    return campuses.find(c => c.id === id)?.name || 'Неизвестен';
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedule(schedule.filter(s => s.id !== id));
    toast.success('Занятие удалено');
  };

  const renderScheduleByDay = () => {
    const filtered = getFilteredSchedule();
    const scheduleByDay: { [key: number]: Schedule[] } = {};
    
    filtered.forEach(item => {
      if (!scheduleByDay[item.day_of_week]) {
        scheduleByDay[item.day_of_week] = [];
      }
      scheduleByDay[item.day_of_week].push(item);
    });

    return DAYS.map((day, index) => {
      const daySchedule = scheduleByDay[index + 1] || [];
      
      return (
        <div key={index} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <h3 className="text-xl font-bold">{day}</h3>
          </div>
          
          {daySchedule.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="py-6 text-center text-muted-foreground">
                Нет занятий
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {daySchedule.map(item => (
                <ScheduleCard
                  key={item.id}
                  schedule={item}
                  getTeacherName={getTeacherName}
                  getGroupName={getGroupName}
                  getCampusName={getCampusName}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteSchedule}
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Расписание занятий</CardTitle>
              <CardDescription>Просматривайте и редактируйте расписание</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isEditMode ? "default" : "outline"}
                onClick={() => setIsEditMode(!isEditMode)}
                className="gap-2"
              >
                <Icon name="Edit" size={18} />
                {isEditMode ? 'Готово' : 'Редактировать'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Plus" size={18} />
                    Добавить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить занятие</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о новом занятии
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Предмет</Label>
                      <Input placeholder="Название предмета" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Группа</Label>
                        <Select>
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
                        <Select>
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
                        <Input placeholder="А-101" />
                      </div>
                      <div className="space-y-2">
                        <Label>Кампус</Label>
                        <Select>
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
                        <Select>
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
                        <Input type="time" />
                      </div>
                      <div className="space-y-2">
                        <Label>Конец</Label>
                        <Input type="time" />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Сохранить
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedGroup?.toString()} onValueChange={(v) => setSelectedGroup(Number(v))}>
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Все группы</SelectItem>
                {groups.map(g => (
                  <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTeacher?.toString() || '0'} onValueChange={(v) => setSelectedTeacher(v === '0' ? null : Number(v))}>
              <SelectTrigger className="sm:w-[250px]">
                <SelectValue placeholder="Все преподаватели" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Все преподаватели</SelectItem>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {renderScheduleByDay()}
      </div>
    </div>
  );
}
