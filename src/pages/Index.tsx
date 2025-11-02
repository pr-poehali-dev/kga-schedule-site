import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Campus {
  id: number;
  name: string;
  address: string;
}

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

interface Group {
  id: number;
  name: string;
  campus_id: number;
  year: number;
}

interface Schedule {
  id: number;
  group_id: number;
  teacher_id: number;
  campus_id: number;
  subject: string;
  room: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export default function Index() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setCampuses([
        { id: 1, name: 'Главный корпус', address: 'г. Хабаровск, ул. Ленина, 1' },
        { id: 2, name: 'Корпус №2', address: 'г. Хабаровск, ул. Пушкина, 15' },
        { id: 3, name: 'Корпус №3', address: 'г. Хабаровск, ул. Карла Маркса, 45' }
      ]);

      setTeachers([
        { id: 1, full_name: 'Сидоров Иван Петрович', email: 'sidorov@college.ru', phone: '+7 (999) 123-45-67' },
        { id: 2, full_name: 'Иванова Мария Сергеевна', email: 'ivanova@college.ru', phone: '+7 (999) 234-56-78' },
        { id: 3, full_name: 'Петров Алексей Николаевич', email: 'petrov@college.ru', phone: '+7 (999) 345-67-89' }
      ]);

      setGroups([
        { id: 1, name: 'ЛА-23', campus_id: 1, year: 2023 },
        { id: 2, name: 'ИС-22', campus_id: 1, year: 2022 },
        { id: 3, name: 'ПО-24', campus_id: 2, year: 2024 },
        { id: 4, name: 'КС-23', campus_id: 3, year: 2023 }
      ]);

      setSchedule([
        { id: 1, group_id: 1, teacher_id: 1, campus_id: 1, subject: 'Математика', room: 'А-101', day_of_week: 1, start_time: '09:00', end_time: '10:30' },
        { id: 2, group_id: 1, teacher_id: 1, campus_id: 1, subject: 'Физика', room: 'А-102', day_of_week: 1, start_time: '10:45', end_time: '12:15' },
        { id: 3, group_id: 1, teacher_id: 2, campus_id: 1, subject: 'Русский язык', room: 'Б-201', day_of_week: 2, start_time: '09:00', end_time: '10:30' },
        { id: 4, group_id: 1, teacher_id: 3, campus_id: 1, subject: 'Информатика', room: 'К-301', day_of_week: 3, start_time: '09:00', end_time: '10:30' },
        { id: 5, group_id: 2, teacher_id: 1, campus_id: 1, subject: 'Алгебра', room: 'А-103', day_of_week: 1, start_time: '13:00', end_time: '14:30' },
        { id: 6, group_id: 2, teacher_id: 2, campus_id: 1, subject: 'Литература', room: 'Б-202', day_of_week: 2, start_time: '10:45', end_time: '12:15' },
        { id: 7, group_id: 3, teacher_id: 3, campus_id: 2, subject: 'Программирование', room: 'К-101', day_of_week: 1, start_time: '09:00', end_time: '10:30' },
        { id: 8, group_id: 4, teacher_id: 1, campus_id: 3, subject: 'Компьютерные сети', room: 'С-201', day_of_week: 1, start_time: '09:00', end_time: '10:30' }
      ]);

      setSelectedGroup(1);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка загрузки данных');
    }
  };

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
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300 hover-scale border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {item.start_time} - {item.end_time}
                          </Badge>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                            {item.room}
                          </Badge>
                        </div>
                        <h4 className="text-lg font-semibold mb-1">{item.subject}</h4>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="User" size={14} />
                            <span>{getTeacherName(item.teacher_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Users" size={14} />
                            <span>Группа: {getGroupName(item.group_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Building" size={14} />
                            <span>{getCampusName(item.campus_id)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {isEditMode && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                            <Icon name="Edit" size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteSchedule(item.id)}
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  КГА ПОУ ГАСКК МЦК
                </h1>
                <p className="text-sm text-muted-foreground">Расписание занятий</p>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Icon name="LogOut" size={18} />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur">
            <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden sm:inline">Группы</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2">
              <Icon name="UserCheck" size={18} />
              <span className="hidden sm:inline">Преподаватели</span>
            </TabsTrigger>
            <TabsTrigger value="campuses" className="gap-2">
              <Icon name="Building" size={18} />
              <span className="hidden sm:inline">Кампусы</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 animate-fade-in">
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
          </TabsContent>

          <TabsContent value="groups" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Учебные группы</CardTitle>
                <CardDescription>Список всех групп колледжа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groups.map(group => (
                    <Card key={group.id} className="hover:shadow-md transition-all hover-scale">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {group.name}
                          <Badge variant="secondary">{group.year}</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Icon name="Building" size={14} />
                          {getCampusName(group.campus_id)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Преподаватели</CardTitle>
                <CardDescription>Педагогический состав колледжа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {teachers.map(teacher => (
                    <Card key={teacher.id} className="hover:shadow-md transition-all hover-scale">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {teacher.full_name.split(' ')[1][0]}
                          </div>
                          {teacher.full_name}
                        </CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon name="Mail" size={14} />
                            {teacher.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Phone" size={14} />
                            {teacher.phone}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => {
                            setSelectedTeacher(teacher.id);
                            setActiveTab('schedule');
                          }}
                        >
                          <Icon name="Calendar" size={16} />
                          Показать расписание
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campuses" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Кампусы</CardTitle>
                <CardDescription>Учебные корпуса колледжа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {campuses.map(campus => (
                    <Card key={campus.id} className="hover:shadow-md transition-all hover-scale border-t-4 border-t-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon name="Building" size={20} />
                          {campus.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          {campus.address}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Личный кабинет</CardTitle>
                <CardDescription>Настройте своё расписание</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    С
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Студент</h3>
                    <p className="text-muted-foreground">student1@example.com</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Моя группа</Label>
                    <p className="text-sm text-muted-foreground mb-2">Привяжите группу для быстрого доступа к расписанию</p>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(g => (
                          <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
