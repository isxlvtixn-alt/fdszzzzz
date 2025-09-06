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
  duration = 1000,
  onClose,
}: SwipeableToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false); // проигрываем анимацию исчезновения
    setTimeout(onClose, 300); // вызываем родителя только после анимации
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

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <Card
        className={`pointer-events-auto ${getTypeStyles()} border-2 shadow-xl transition-transform duration-300
          ${isVisible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'}`}
      >
        <div className="flex items-center justify-between p-4 min-w-[200px] max-w-[400px]">
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
