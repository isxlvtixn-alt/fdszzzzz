import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CubeVisualization } from '@/components/CubeVisualization';

interface BottomVisualizationProps {
  scramble: string;
  cubeType: string;
  viewMode: '2D' | '3D';
  disabled?: boolean;
}

export const BottomVisualization = ({ 
  scramble, 
  cubeType, 
  viewMode,
  disabled 
}: BottomVisualizationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (disabled) {
    return (
      <div className="h-32 w-32 mx-auto bg-card/30 rounded-lg border border-border/30 flex items-center justify-center">
        <div className="text-muted-foreground/50 text-xs">Disabled</div>
      </div>
    );
  }

  return (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogTrigger asChild>
        <div className="h-32 w-32 mx-auto cursor-pointer transition-transform hover:scale-105">
          <CubeVisualization
            scramble={scramble}
            cubeType={cubeType}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-8">
        <div className="w-full h-96">
          <CubeVisualization
            scramble={scramble}
            cubeType={cubeType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};