import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { generateEnhancedScramble } from '@/lib/enhanced-scramble-generator';
import { toast } from 'sonner';

interface ScrambleDisplayProps {
  cubeType: string;
  scramble: string;
  onScrambleChange: (scramble: string) => void;
}

export const ScrambleDisplay = ({ cubeType, scramble, onScrambleChange }: ScrambleDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleNewScramble = () => {
    const newScramble = generateEnhancedScramble(cubeType);
    onScrambleChange(newScramble);
    toast.success('New scramble generated!');
  };

  const handleCopyScramble = async () => {
    try {
      await navigator.clipboard.writeText(scramble);
      setCopied(true);
      toast.success('Scramble copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy scramble');
    }
  };

  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Scramble</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyScramble}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewScramble}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 min-h-[4rem] flex items-center">
          <p className="font-mono text-lg leading-relaxed break-all select-all">
            {scramble || 'Press refresh to generate scramble'}
          </p>
        </div>
      </div>
    </Card>
  );
};