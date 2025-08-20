import { Button } from '@/components/ui/button';
import { Timer, History } from 'lucide-react';

interface UniversalNavigationProps {
  activeTab: 'timer' | 'history';
  onTabChange: (tab: 'timer' | 'history') => void;
}

export const UniversalNavigation = ({ activeTab, onTabChange }: UniversalNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex w-full">
        <Button
          variant={activeTab === 'timer' ? 'default' : 'ghost'}
          onClick={() => onTabChange('timer')}
          className="h-12 flex-1 rounded-none border-r border-border flex items-center justify-center gap-2 text-xs font-medium"
        >
          <Timer className="h-4 w-4" />
          <span>Timer</span>
        </Button>
        
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => onTabChange('history')}
          className="h-12 flex-1 rounded-none flex items-center justify-center gap-2 text-xs font-medium"
        >
          <History className="h-4 w-4" />
          <span>History</span>
        </Button>
      </div>
    </div>
  );
};