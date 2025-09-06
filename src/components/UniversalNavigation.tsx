import { Button } from '@/components/ui/button';
import { Timer, History } from 'lucide-react';

interface UniversalNavigationProps {
  activeTab: 'timer' | 'history';
  onTabChange: (tab: 'timer' | 'history') => void;
}

export const UniversalNavigation = ({ activeTab, onTabChange }: UniversalNavigationProps) => {
  return (
    <div className="nav-glass sticky bottom-0 left-0 right-0 z-50">
      <div className="section-divider"></div>
      <div className="flex w-full">
        <Button
          variant={activeTab === 'timer' ? 'default' : 'ghost'}
          onClick={() => onTabChange('timer')}
          className={`h-12 flex-1 rounded-none flex items-center justify-center gap-2 text-xs font-medium transition-glow relative overflow-hidden ${
            activeTab === 'timer' ? 'btn-primary' : 'hover-lift'
          }`}
        >
          <Timer className="h-4 w-4" />
          <span>Timer</span>
        </Button>
        
        <div className="section-divider-vertical"></div>
        
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => onTabChange('history')}
          className={`h-12 flex-1 rounded-none flex items-center justify-center gap-2 text-xs font-medium transition-glow relative overflow-hidden ${
            activeTab === 'history' ? 'btn-primary' : 'hover-lift'
          }`}
        >
          <History className="h-4 w-4" />
          <span>History</span>
        </Button>
      </div>
    </div>
  );
};
