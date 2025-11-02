import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Header() {
  return (
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
  );
}
