import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Box } from 'lucide-react';
import { CUBE_EVENTS } from '@/lib/enhanced-scramble-generator';

interface TopBarProps {
  scramble: string;
  cubeType: string;
  onNewScramble: () => void;
  onCubeTypeChange: (cubeType: string) => void;
  disabled?: boolean;
}

export const TopBar = ({ 
  scramble, 
  cubeType, 
  onNewScramble, 
  onCubeTypeChange,
  disabled 
}: TopBarProps) => {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Scramble Display */}
      <div className="flex-1 bg-card/50 rounded-lg p-3 border border-border/50">
        <p className="font-mono text-sm text-foreground/90 leading-relaxed break-all">
          {scramble || 'Press refresh to generate scramble'}
        </p>
      </div>

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewScramble}
        className="h-8 w-8 p-0 shrink-0"
        disabled={disabled}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      {/* Cube Type Selector */}
      <Select 
        value={cubeType} 
        onValueChange={onCubeTypeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-auto h-8 gap-2 bg-card/50 border-border/50">
          <Box className="h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CUBE_EVENTS.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};