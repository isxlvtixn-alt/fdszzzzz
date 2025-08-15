import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { TwistyPlayer } from 'cubing/twisty';

interface CubeVisualizationProps {
  scramble: string;
  cubeType: string;
}

export const CubeVisualization = ({ scramble, cubeType }: CubeVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous player
    if (playerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      // Create new TwistyPlayer
      const player = new TwistyPlayer({
        puzzle: cubeType === '3x3' ? '3x3x3' : cubeType === '2x2' ? '2x2x2' : cubeType === '4x4' ? '4x4x4' : '5x5x5',
        alg: scramble,
        visualization: '2D',
        background: 'none',
        controlPanel: 'none',
        hintFacelets: 'none',
      });

      player.style.width = '100%';
      player.style.height = '200px';
      player.style.maxWidth = '300px';

      containerRef.current.appendChild(player);
      playerRef.current = player;
    } catch (error) {
      console.error('Error creating cube visualization:', error);
      // Fallback to text display if visualization fails
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-48 text-muted-foreground">
            <div class="text-center">
              <div class="text-2xl mb-2">🧩</div>
              <div class="text-sm">Cube visualization</div>
              <div class="text-xs mt-1">${cubeType}</div>
            </div>
          </div>
        `;
      }
    }

    return () => {
      if (playerRef.current && containerRef.current) {
        containerRef.current.innerHTML = '';
        playerRef.current = null;
      }
    };
  }, [scramble, cubeType]);

  return (
    <Card className="timer-card rounded-2xl p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground text-center">
          Cube State
        </h3>
        <div 
          ref={containerRef}
          className="flex items-center justify-center min-h-[200px] bg-muted/20 rounded-lg"
        />
      </div>
    </Card>
  );
};