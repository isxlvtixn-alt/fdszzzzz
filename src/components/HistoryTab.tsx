import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit3, MoreVertical } from 'lucide-react';
import { formatTime } from '@/lib/timer-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Session {
  id: string;
  name: string;
  cubeType: string;
  times: number[];
  createdAt: Date;
}

interface HistoryTabProps {
  sessions: Session[];
  currentSessionId: string;
  onSessionChange: (sessionId: string) => void;
  onCreateSession: (name: string, cubeType: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onDeleteTime: (sessionId: string, timeIndex: number) => void;
}

export const HistoryTab = ({
  sessions,
  currentSessionId,
  onSessionChange,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  onDeleteTime
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
    <div className="p-4 space-y-6">
      {/* Session Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
          <div className="flex gap-2">
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
      {currentSession && (
        <div className="space-y-4">
          <h3 className="font-semibold">
            Times ({currentSession.times.length})
          </h3>
          
          {currentSession.times.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No times recorded yet
            </Card>
          ) : (
            <div className="space-y-2">
              {currentSession.times.map((time, index) => (
                <Card key={index} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">
                      #{currentSession.times.length - index}
                    </span>
                    <span className="font-mono text-lg">
                      {formatTime(time)}
                    </span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDeleteTime(currentSession.id, index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

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