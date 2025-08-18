import { Button } from '@/components/ui/button';
import { Timer, History } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: 'timer' | 'history';
  onTabChange: (tab: 'timer' | 'history') => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="grid grid-cols-2">
        <Button
          variant={activeTab === 'timer' ? 'default' : 'ghost'}
          onClick={() => onTabChange('timer')}
          className="h-14 rounded-none border-r border-border flex flex-col gap-1"
        >
          <Timer className="h-5 w-5" />
          <span className="text-xs">Timer</span>
        </Button>
        
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => onTabChange('history')}
          className="h-14 rounded-none flex flex-col gap-1"
        >
          <History className="h-5 w-5" />
          <span className="text-xs">History</span>
        </Button>
      </div>
    </div>
  );
};