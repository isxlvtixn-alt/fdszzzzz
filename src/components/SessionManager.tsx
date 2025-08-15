import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { CUBE_EVENTS } from '@/lib/enhanced-scramble-generator';
import { toast } from 'sonner';

interface SessionManagerProps {
  currentSession: string;
  cubeType: string;
  onSessionChange: (session: string) => void;
  onCubeTypeChange: (cubeType: string) => void;
  onClearSession: () => void;
}

export const SessionManager = ({ 
  currentSession, 
  cubeType, 
  onSessionChange, 
  onCubeTypeChange,
  onClearSession 
}: SessionManagerProps) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [showNewSession, setShowNewSession] = useState(false);

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onSessionChange(newSessionName.trim());
      setNewSessionName('');
      setShowNewSession(false);
      toast.success(`Created session: ${newSessionName.trim()}`);
    }
  };

  const handleClearSession = () => {
    onClearSession();
    toast.success('Session cleared');
  };

  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Session & Settings</h3>

        {/* Cube Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Cube Type
          </label>
          <Select value={cubeType} onValueChange={onCubeTypeChange}>
            <SelectTrigger className="bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CUBE_EVENTS.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Current Session
            </label>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewSession(!showNewSession)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSession}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="font-mono text-lg px-3 py-2 bg-muted/30 rounded-lg">
            {currentSession}
          </div>

          {showNewSession && (
            <div className="flex gap-2">
              <Input
                placeholder="New session name"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSession()}
                className="bg-muted/30"
              />
              <Button onClick={handleCreateSession} size="sm">
                Create
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Press SPACE to start/stop timer</div>
            <div>• Use inspection time in settings</div>
            <div>• Generate new scrambles anytime</div>
          </div>
        </div>
      </div>
    </Card>
  );
};