import { useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  disabled,
}: BottomVisualizationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pointerMoved = useRef(false);

  if (disabled) {
    return (
      <div className="h-32 w-32 mx-auto bg-card/30 rounded-lg border border-border/30 flex items-center justify-center">
        <div className="text-muted-foreground/50 text-xs">Disabled</div>
      </div>
    );
  }

  const handlePointerDown = () => {
    pointerMoved.current = false;
  };

  const handlePointerMove = () => {
    pointerMoved.current = true;
  };

  const handlePointerUp = () => {
    // Открываем fullscreen только если pointer не двигался
    if (!pointerMoved.current) {
      setIsFullscreen(true);
    }
  };

  return (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <div
        className="h-32 w-32 mx-auto cursor-pointer transition-transform hover:scale-105"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <CubeVisualization
          scramble={scramble}
          cubeType={cubeType}
          viewMode={viewMode}
          size="small"
        />
      </div>

      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
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
