import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { TwistyPlayer } from 'cubing/twisty';

interface CubeVisualizationProps {
  scramble: string;
  cubeType: string;
  viewMode?: '2D' | '3D';
  size?: 'small' | 'large';
}

export const CubeVisualization = ({ scramble, cubeType, viewMode = '2D', size = 'small' }: CubeVisualizationProps) => {
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
        visualization: viewMode,
        background: 'none',
        controlPanel: 'none',
        hintFacelets: 'none',
      });

      const dimensions = size === 'large' ? { width: '100%', height: '400px', maxWidth: '600px' } : { width: '100%', height: '120px', maxWidth: '150px' };
      player.style.width = dimensions.width;
      player.style.height = dimensions.height;
      player.style.maxWidth = dimensions.maxWidth;

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
  }, [scramble, cubeType, viewMode, size]);

  const containerHeight = size === 'large' ? 'min-h-[400px]' : 'min-h-[120px]';

  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center ${containerHeight} bg-card/30 rounded-lg border border-border/30`}
    />
  );
};
