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
            viewMode={viewMode}
            size="small"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        {/* Для 3D подгоняем под twisty-player */}
        <div className="mx-auto" style={{ width: '100%' }}>
          <CubeVisualization
            scramble={scramble}
            cubeType={cubeType}
            viewMode={viewMode}
            size="large"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
