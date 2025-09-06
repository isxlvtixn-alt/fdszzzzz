import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu } from 'lucide-react';

interface AppSettings {
  inspection: boolean;
  inspectionTime: number;
  hideTime: boolean;
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

      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Menu className="h-5 w-5" />
              Settings
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            {/* Timer */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Timer
              </h3>

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
    onSettingsChange({
      inspection: checked,
      inspectionTime: 15, // всегда фиксированное значение
    })
  }
/>
 </div>
{settings.inspection && (
  <div className="space-y-2">
    <Label>Inspection Duration</Label>
    <div className="text-sm text-muted-foreground">15 seconds</div>
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
                  checked={settings.hideTime}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ hideTime: checked })
                  }
                />
              </div>
            </div>

            {/* Visualization */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Scramble Visualization
              </h3>

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

            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Appearance
              </h3>

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
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
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
