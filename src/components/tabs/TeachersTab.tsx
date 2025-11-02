import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Teacher } from '@/types';

interface TeachersTabProps {
  teachers: Teacher[];
  onShowSchedule: (teacherId: number) => void;
}

export default function TeachersTab({ teachers, onShowSchedule }: TeachersTabProps) {
  return (
    <div className="animate-fade-in">
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
                    onClick={() => onShowSchedule(teacher.id)}
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
    </div>
  );
}
