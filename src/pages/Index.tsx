import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Campus, Teacher, Group, Schedule } from '@/types';
import { fetchAllData, fetchSchedules } from '@/lib/api';
import Header from '@/components/Header';
import ScheduleTab from '@/components/schedule/ScheduleTab';
import GroupsTab from '@/components/tabs/GroupsTab';
import TeachersTab from '@/components/tabs/TeachersTab';
import CampusesTab from '@/components/tabs/CampusesTab';
import ProfileTab from '@/components/tabs/ProfileTab';

export default function Index() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchAllData();
      setCampuses(data.campuses);
      setTeachers(data.teachers);
      setGroups(data.groups);
      
      const scheduleData = await fetchSchedules();
      setSchedule(scheduleData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка загрузки данных');
      setLoading(false);
    }
  };

  const handleShowTeacherSchedule = (teacherId: number) => {
    setActiveTab('schedule');
  };

  const getCampusName = (id: number) => {
    return campuses.find(c => c.id === id)?.name || 'Неизвестен';
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
      <Header />

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

          <TabsContent value="schedule">
            <ScheduleTab
              schedule={schedule}
              setSchedule={setSchedule}
              groups={groups}
              teachers={teachers}
              campuses={campuses}
              onRefresh={loadData}
            />
          </TabsContent>

          <TabsContent value="groups">
            <GroupsTab groups={groups} getCampusName={getCampusName} />
          </TabsContent>

          <TabsContent value="teachers">
            <TeachersTab teachers={teachers} onShowSchedule={handleShowTeacherSchedule} />
          </TabsContent>

          <TabsContent value="campuses">
            <CampusesTab campuses={campuses} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab groups={groups} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
