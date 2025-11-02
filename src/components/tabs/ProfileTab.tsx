import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Group } from '@/types';

interface ProfileTabProps {
  groups: Group[];
}

export default function ProfileTab({ groups }: ProfileTabProps) {
  return (
    <div className="animate-fade-in">
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
    </div>
  );
}
