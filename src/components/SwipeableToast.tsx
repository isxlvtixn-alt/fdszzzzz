import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface SwipeableToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const SwipeableToast = ({ 
  message, 
  type = 'success', 
  duration = 2000, 
  onClose 
}: SwipeableToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const startX = touch.clientX;
    setDragX(startX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragX) > 100) {
      handleClose();
    } else {
      setDragX(0);
    }
    setIsDragging(false);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'border-destructive/50 bg-destructive/10 text-destructive';
      case 'info':
        return 'border-accent/50 bg-accent/10 text-accent';
      default:
        return 'border-primary/50 bg-primary/10 text-primary';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <Card
        className={`${getTypeStyles()} border-2 shadow-lg transition-all duration-300 ${
          isVisible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
        }`}
        style={{ transform: `translateX(${dragX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between p-4">
          <span className="font-medium">{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};