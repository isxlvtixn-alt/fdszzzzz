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
    <div className="flex flex-col gap-2 p-4">
      {/* Scramble Display - Fixed height with vertical scrolling and text wrapping */}
      <div className="bg-card/50 rounded-lg border border-border/50 h-20">
        <div className="p-3 h-full overflow-y-auto">
          <p className="font-mono text-sm text-foreground/90 leading-relaxed break-words">
            {scramble || 'Press refresh to generate scramble'}
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-2 justify-center">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewScramble}
          className="h-8 w-8 p-0"
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
    </div>
  );
};