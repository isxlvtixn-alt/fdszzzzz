import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit3, MoreVertical, Star, Plus as PlusTwo, Ban } from 'lucide-react';
import { formatTime } from '@/lib/timer-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TimeEntry, Session } from '@/store/types';

interface HistoryTabProps {
  sessions: Session[];
  currentSessionId: string;
  onSessionChange: (sessionId: string) => void;
  onCreateSession: (name: string, cubeType: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onPlusTwo: (timeId: string) => void;
  onDNF: (timeId: string) => void;
  onDelete: (timeId: string) => void;
}

export const HistoryTab = ({
  sessions,
  currentSessionId,
  onSessionChange,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  onPlusTwo,
  onDNF,
  onDelete
}: HistoryTabProps) => {
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameSessionId, setRenameSessionId] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionCubeType, setNewSessionCubeType] = useState('3x3');
  const [renameValue, setRenameValue] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onCreateSession(newSessionName.trim(), newSessionCubeType);
      setNewSessionName('');
      setNewSessionDialogOpen(false);
    }
  };

  const handleRenameSession = () => {
    if (renameValue.trim() && renameSessionId) {
      onRenameSession(renameSessionId, renameValue.trim());
      setRenameDialogOpen(false);
      setRenameSessionId('');
      setRenameValue('');
    }
  };

  const openRenameDialog = (sessionId: string, currentName: string) => {
    setRenameSessionId(sessionId);
    setRenameValue(currentName);
    setRenameDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <Dialog open={newSessionDialogOpen} onOpenChange={setNewSessionDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input
                  id="session-name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Enter session name"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSession()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cube-type">Cube Type</Label>
                <Select value={newSessionCubeType} onValueChange={setNewSessionCubeType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3x3">3×3×3</SelectItem>
                    <SelectItem value="2x2">2×2×2</SelectItem>
                    <SelectItem value="4x4">4×4×4</SelectItem>
                    <SelectItem value="5x5">5×5×5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateSession} className="w-full">
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Session Selector */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <Select value={currentSessionId} onValueChange={onSessionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((session) => (
              <SelectItem key={session.id} value={session.id}>
                {session.name} ({session.times.length} solves)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Session Actions */}
        {currentSession && (
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openRenameDialog(currentSession.id, currentSession.name)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </Button>
            {sessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteSession(currentSession.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Times List */}
      <div className="flex-1 overflow-hidden p-4">
        {currentSession && (
          <>
            <h3 className="font-semibold mb-4">
              Times ({currentSession.times.length})
            </h3>
            
            {currentSession.times.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No times recorded yet
              </Card>
            ) : (
              <div className="h-full overflow-y-auto space-y-2">
                {[...currentSession.times].reverse().map((timeEntry, reversedIndex) => {
                  const displayIndex = currentSession.times.length - reversedIndex;
                  return (
                    <Card key={timeEntry.id} className="p-3 flex items-center justify-between group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">
                          #{displayIndex}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-lg ${timeEntry.dnf ? 'text-destructive' : ''}`}>
                              {timeEntry.dnf ? 'DNF' : formatTime(timeEntry.plusTwo ? timeEntry.time + 2000 : timeEntry.time)}
                            </span>
                            {timeEntry.plusTwo && !timeEntry.dnf && (
                              <span className="text-xs text-accent bg-accent/10 px-1 rounded">+2</span>
                            )}
                            {timeEntry.favorite && (
                              <Star className="h-4 w-4 text-timer-stopped fill-current" />
                            )}
                            {timeEntry.autoDnf && (
                              <span className="text-xs text-destructive bg-destructive/10 px-1 rounded">AUTO</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {timeEntry.scramble}
                          </div>
                          {timeEntry.comment && (
                            <div className="text-xs text-muted-foreground italic">
                              "{timeEntry.comment}"
                            </div>
                          )}
                        </div>
                      </div>
                      
<div className="flex gap-2"> {/* gap-2 вместо gap-1 */}
  {!timeEntry.autoDnf && (
    <button
      onClick={(e) => { e.stopPropagation(); onPlusTwo(timeEntry.id); }}
      className="px-3 py-1.5 text-sm rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors font-medium"
    >
      {timeEntry.plusTwo ? '-2' : '+2'}
    </button>
  )}
  {!timeEntry.autoDnf && (
    <button
      onClick={(e) => { e.stopPropagation(); onDNF(timeEntry.id); }}
      className="px-3 py-1.5 text-sm rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-medium"
    >
      {timeEntry.dnf ? 'OK' : 'DNF'}
    </button>
  )}
  <button
    onClick={(e) => { e.stopPropagation(); onDelete(timeEntry.id); }}
    className="px-3 py-1.5 text-sm rounded bg-muted-foreground/20 text-muted-foreground border border-muted-foreground/30 hover:bg-muted-foreground/30 transition-colors font-medium"
  >
    ×
  </button>
</div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rename-input">Session Name</Label>
              <Input
                id="rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Enter new name"
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSession()}
              />
            </div>
            <Button onClick={handleRenameSession} className="w-full">
              Rename Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
