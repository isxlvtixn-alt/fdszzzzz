import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, Palette, Eye, Volume2, Box } from 'lucide-react';

interface AppSettings {
  inspection: boolean;
  inspectionTime: number;
  hideTimeWhileSolving: boolean;
  sounds: boolean;
  scrambleView: '2D' | '3D';
  theme: string;
}

interface MenuSettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MenuSettings = ({ settings, onSettingsChange, disabled, onOpenChange }: MenuSettingsProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Settings
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Timer Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h3 className="font-semibold">Timer</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inspection">Inspection Time</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable 15-second inspection
                  </p>
                </div>
                <Switch
                  id="inspection"
                  checked={settings.inspection}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ inspection: checked })
                  }
                />
              </div>

              {settings.inspection && (
                <div className="space-y-2">
                  <Label>Inspection Duration</Label>
                  <Select
                    value={settings.inspectionTime.toString()}
                    onValueChange={(value) => 
                      onSettingsChange({ inspectionTime: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hide-time">Hide Time While Solving</Label>
                  <p className="text-xs text-muted-foreground">
                    Hide timer during solve
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
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <h3 className="font-semibold">Audio</h3>
            </div>
            
            <div className="pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sounds">Enable Sounds</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for timer events
                  </p>
                </div>
                <Switch
                  id="sounds"
                  checked={settings.sounds}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ sounds: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Visualization Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              <h3 className="font-semibold">Scramble Visualization</h3>
            </div>
            
            <div className="pl-6">
              <div className="space-y-2">
                <Label>View Mode</Label>
                <Select
                  value={settings.scrambleView}
                  onValueChange={(value: '2D' | '3D') => 
                    onSettingsChange({ scrambleView: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2D">2D View</SelectItem>
                    <SelectItem value="3D">3D View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="font-semibold">Appearance</h3>
            </div>
            
            <div className="pl-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => 
                    onSettingsChange({ theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="amber">Amber</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};