import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Box, Edit3 } from 'lucide-react';
import { CUBE_EVENTS } from '@/lib/enhanced-scramble-generator';

interface TopBarProps {
  scramble: string;
  cubeType: string;
  onNewScramble: () => void;
  onCubeTypeChange: (cubeType: string) => void;
  onCustomScramble: (scramble: string) => void;
  disabled?: boolean;
}

export const TopBar = ({
  scramble,
  cubeType,
  onNewScramble,
  onCubeTypeChange,
  onCustomScramble,
  disabled,
}: TopBarProps) => {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customScrambleText, setCustomScrambleText] = useState('');

  const handleCustomScrambleSubmit = () => {
    if (customScrambleText.trim()) {
      onCustomScramble(customScrambleText.trim());
      setCustomScrambleText('');
      setIsCustomDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-1 items-center w-full">
      {/* Scramble Display - Enhanced glass container */}
      <div className="container-frame rounded-lg w-full max-w-4xl h-24 hover-lift transition-glow flex items-center justify-center mx-auto overflow-hidden">
        <div className="px-2 pt-0 pb-2 h-full w-full overflow-y-auto scrollbar-modern flex justify-center">
          <p className="scramble-container">
            {scramble || 'Press refresh to generate scramble'}
          </p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-3 justify-center w-full max-w-2xl">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewScramble}
          className="h-10 w-10 p-0 glow-primary transition-glow hover:scale-105"
          disabled={disabled}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>

        {/* Custom Scramble Button */}
        <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 glow-primary transition-glow hover:scale-105"
              disabled={disabled}
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md container-frame">
            <DialogHeader>
              <DialogTitle>Custom Scramble</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your custom scramble..."
                value={customScrambleText}
                onChange={(e) => setCustomScrambleText(e.target.value)}
                className="min-h-[100px] input-glass transition-glow"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCustomDialogOpen(false);
                    setCustomScrambleText('');
                  }}
                  className="transition-glow"
                >
                  Cancel
                </Button>
                <Button onClick={handleCustomScrambleSubmit} className="btn-primary">
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cube Type Selector */}
        <Select value={cubeType} onValueChange={onCubeTypeChange} disabled={disabled}>
          <SelectTrigger className="w-auto h-10 gap-2 container-frame-subtle transition-glow hover:scale-105 px-3 min-w-[140px]">
            <Box className="h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="container-frame">
            {CUBE_EVENTS.map((event) => (
              <SelectItem key={event.id} value={event.id} className="hover-lift">
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
