import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Campus } from '@/types';

interface CampusesTabProps {
  campuses: Campus[];
}

export default function CampusesTab({ campuses }: CampusesTabProps) {
  return (
    <div className="animate-fade-in">
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
    </div>
  );
}
