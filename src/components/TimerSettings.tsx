import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { TimerSettings as TimerSettingsType } from '@/hooks/useTimer';

interface TimerSettingsProps {
  settings: TimerSettingsType;
  onSettingsChange: (settings: Partial<TimerSettingsType>) => void;
}

export const TimerSettings = ({ settings, onSettingsChange }: TimerSettingsProps) => {
  return (
    <Card className="timer-card rounded-2xl p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Timer Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Inspection Time */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="inspection">Inspection Time</Label>
              <p className="text-xs text-muted-foreground">
                Enable 15-second inspection before solving
              </p>
            </div>
            <Switch
              id="inspection"
              checked={settings.useInspection}
              onCheckedChange={(checked) => 
                onSettingsChange({ useInspection: checked })
              }
            />
          </div>

          {/* Inspection Duration */}
          {settings.useInspection && (
            <div className="space-y-2">
              <Label htmlFor="inspection-time">Inspection Duration</Label>
              <Select
                value={settings.inspectionTime.toString()}
                onValueChange={(value) => 
                  onSettingsChange({ inspectionTime: parseInt(value) })
                }
              >
                <SelectTrigger className="bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Stackmat Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stackmat">Stackmat Mode</Label>
              <p className="text-xs text-muted-foreground">
                Emulate Stackmat timer behavior
              </p>
            </div>
            <Switch
              id="stackmat"
              checked={settings.stackmatMode}
              onCheckedChange={(checked) => 
                onSettingsChange({ stackmatMode: checked })
              }
            />
          </div>

          {/* Hide Time While Solving */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-time">Hide Time While Solving</Label>
              <p className="text-xs text-muted-foreground">
                Hide timer display during solve
              </p>
            </div>
            <Switch
              id="hide-time"
              checked={settings.hideTimeWhileSolving}
              onCheckedChange={(checked) => 
                onSettingsChange({ hideTimeWhileSolving: checked })
              }
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Hold SPACE to start timer</div>
            <div>• Release SPACE to stop timer</div>
            <div>• Press SPACE when stopped to reset</div>
          </div>
        </div>
      </div>
    </Card>
  );
};