import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Schedule } from '@/types';

interface ScheduleCardProps {
  schedule: Schedule;
  getTeacherName: (id: number) => string;
  getGroupName: (id: number) => string;
  getCampusName: (id: number) => string;
  isEditMode: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: number) => void;
}

export default function ScheduleCard({
  schedule,
  getTeacherName,
  getGroupName,
  getCampusName,
  isEditMode,
  onEdit,
  onDelete
}: ScheduleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
              </Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                {schedule.room}
              </Badge>
            </div>
            <h4 className="text-lg font-semibold mb-1">{schedule.subject}</h4>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="User" size={14} />
                <span>{getTeacherName(schedule.teacher_id)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={14} />
                <span>Группа: {getGroupName(schedule.group_id)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Building" size={14} />
                <span>{getCampusName(schedule.campus_id)}</span>
              </div>
            </div>
          </div>
          
          {isEditMode && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10"
                onClick={() => onEdit(schedule)}
              >
                <Icon name="Edit" size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(schedule.id)}
              >
                <Icon name="Trash2" size={18} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}