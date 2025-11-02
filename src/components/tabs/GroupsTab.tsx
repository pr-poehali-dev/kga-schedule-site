import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Group } from '@/types';

interface GroupsTabProps {
  groups: Group[];
  getCampusName: (id: number) => string;
}

export default function GroupsTab({ groups, getCampusName }: GroupsTabProps) {
  return (
    <div className="animate-fade-in">
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
    </div>
  );
}
